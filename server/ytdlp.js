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

// Use system yt-dlp/ffmpeg in production (Docker), or fallback to local paths for dev if needed
// In Docker, these are in /usr/local/bin or /usr/bin, which are in PATH.
const YTDLP_PATH = 'yt-dlp';
const FFMPEG_PATH = 'ffmpeg'; // Assumes ffmpeg is in PATH

app.use(cors());
app.use(express.json());

// Serve static files from the React frontend app
app.use(express.static(path.join(__dirname, '../dist')));

// Helper to sanitize filenames
const sanitizeFilename = (name) => {
    return name.replace(/[^\w\s.-]/gi, '').trim();
};

/**
 * Get all available formats for a YouTube video
 */
async function getVideoFormats(videoId) {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    try {
        // -j for JSON output
        const { stdout } = await execAsync(`${YTDLP_PATH} -j "${url}"`, { maxBuffer: 10 * 1024 * 1024 });
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
        // Get video title for filename
        // Minimal metadata fetch
        const { stdout: titleOut } = await execAsync(`${YTDLP_PATH} --get-filename -o "%(title)s" "https://www.youtube.com/watch?v=${videoId}"`);
        const title = titleOut.trim();
        const safeTitle = sanitizeFilename(title);
        const ext = type === 'audio' ? 'mp3' : 'mp4';
        const filename = `${safeTitle}.${ext}`;

        const url = `https://www.youtube.com/watch?v=${videoId}`;
        let args = [url, '-o', '-']; // Output to stdout

        if (type === 'audio') {
            args.push('-x', '--audio-format', 'mp3', '--audio-quality', format || '192');
        } else {
            const height = format || '720';
            args.push('-f', `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`);
            args.push('--merge-output-format', 'mp4');
        }

        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
        res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');

        const process = spawn(YTDLP_PATH, args);

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
});
