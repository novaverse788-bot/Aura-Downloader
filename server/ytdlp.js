import express from 'express';
import cors from 'cors';
import { exec, spawn } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import { fileURLToPath } from 'url';

const execAsync = promisify(exec);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3001;

// Paths for Local Dev (Windows) vs Production (Docker)
// Paths for Local Dev (Windows) vs Production (Docker)
// Reliable check: If not Windows, we assume we are in the Docker/Linux environment
const IS_WINDOWS = process.platform === 'win32';
const IS_PRODUCTION = !IS_WINDOWS;

// Fallback to the specific local path if not in production
const LOCAL_YTDLP = 'C:\\Users\\lenovo\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\Scripts\\yt-dlp.exe';
const LOCAL_FFMPEG_DIR = 'C:\\Users\\lenovo\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-8.0.1-full_build\\bin';

const YTDLP_PATH = IS_PRODUCTION ? 'yt-dlp' : LOCAL_YTDLP;
const FFMPEG_PATH = IS_PRODUCTION ? 'ffmpeg' : LOCAL_FFMPEG_DIR;

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// Helper to sanitize filenames
const sanitizeFilename = (name) => {
    return name.replace(/[^\w\s.-]/gi, '').trim();
};

/**
 * Execute a command string in a cross-platform way
 */
const executeCommand = async (commandStr) => {
    const options = { maxBuffer: 10 * 1024 * 1024 };

    if (!IS_PRODUCTION) {
        // Windows Dev: Use PowerShell because of complex paths and " " requirements
        options.shell = 'powershell.exe';
        // Ensure the executable path is quoted and invoked with &
        // The commandStr passed in is expected to be just arguments if we were spawning,
        // but here we are constructing the full string.
        // We will assume the caller constructs the string appropriately for the platform OR we handle it here.
        // Let's rely on the caller using the proper syntax for now, or simplify.
    }

    return execAsync(commandStr, options);
};

/**
 * Get all available formats for a YouTube video
 */
async function getVideoFormats(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    try {
        let cmd;
        if (IS_PRODUCTION) {
            // Linux: Simple execution
            cmd = `${YTDLP_PATH} -j "${url}"`;
        } else {
            // Windows: PowerShell syntax
            cmd = `& "${YTDLP_PATH}" -j "${url}"`;
        }

        const { stdout } = await executeCommand(cmd);
        const info = JSON.parse(stdout);

        // Extract video formats
        const videoFormats = info.formats
            .filter(f => f.vcodec !== 'none' && f.height)
            .map(f => ({
                formatId: f.format_id,
                ext: f.ext,
                resolution: `${f.height}p`,
                height: f.height,
                filesize: f.filesize || f.filesize_approx,
            }))
            .sort((a, b) => b.height - a.height);

        // Get unique resolutions
        const uniqueResolutions = [...new Set(videoFormats.map(f => f.height))]
            .sort((a, b) => b - a)
            .slice(0, 6);

        return {
            title: info.title,
            duration: info.duration,
            thumbnail: info.thumbnail,
            uploader: info.uploader,
            viewCount: info.view_count,
            description: info.description,
            tags: info.tags || [],
            thumbnails: info.thumbnails || [],
            videoFormats: uniqueResolutions.map(h => ({ height: h, label: `${h}p`, available: true })),
        };
    } catch (error) {
        console.error('Error getting formats:', error);
        throw new Error('Failed to get video formats.');
    }
}

// API Route to fetch metadata
app.get('/api/formats/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const info = await getVideoFormats(videoId);
        res.json({ success: true, formats: info });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stream download endpoint
app.get('/api/stream/:videoId', async (req, res) => {
    const { videoId } = req.params;
    const { format, type } = req.query;

    try {
        let titleCmd;
        if (IS_PRODUCTION) {
            titleCmd = `${YTDLP_PATH} --get-filename -o "%(title)s" "https://www.youtube.com/watch?v=${videoId}"`;
        } else {
            titleCmd = `& "${YTDLP_PATH}" --get-filename -o "%(title)s" "https://www.youtube.com/watch?v=${videoId}" --ffmpeg-location "${FFMPEG_PATH}"`;
        }

        const { stdout: titleOut } = await executeCommand(titleCmd);
        const title = titleOut.trim();
        const safeTitle = sanitizeFilename(title);
        const ext = type === 'audio' ? 'mp3' : 'mp4';
        const filename = `${safeTitle}.${ext}`;

        const url = `https://www.youtube.com/watch?v=${videoId}`;
        let args = [url, '-o', '-']; // Output to stdout

        if (!IS_PRODUCTION) {
            args.push('--ffmpeg-location', FFMPEG_PATH);
        }
        // In Docker, ffmpeg is in standard path, so yt-dlp finds it automatically.

        if (type === 'audio') {
            args.push('-x', '--audio-format', 'mp3', '--audio-quality', format || '192');
        } else {
            const height = format || '720';
            args.push('-f', `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`);
            args.push('--merge-output-format', 'mp4');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');

        // Spawn process
        let process;
        if (IS_PRODUCTION) {
            process = spawn(YTDLP_PATH, args);
        } else {
            // Windows/Local: Use 'powershell' to spawn formatting correctly if needed,
            // or better yet, just spawn the executable directly if the path works.
            // Spawning with spaces in path on Windows without shell can be tricky.
            // Using shell: true handles the command parsing better.
            // But 'spawn' with absolute path usually works if quoted args are clean.
            process = spawn(YTDLP_PATH, args, { shell: true });
        }

        process.stdout.pipe(res);

        process.stderr.on('data', (data) => console.error(`stderr: ${data}`));

        process.on('close', (code) => {
            if (code !== 0) console.error(`Process exited with code ${code}`);
        });

        req.on('close', () => process.kill());

    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).end();
    }
});

// Catch-all route to serve the SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Environment: ${IS_PRODUCTION ? 'Production' : 'Development'}`);
});

