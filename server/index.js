import express from 'express';
import cors from 'cors';
import { getVideoFormats, getDownloadUrl, FFMPEG_PATH } from './ytdlp.js';
import { spawn } from 'child_process';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Get available formats for a video
app.get('/api/formats/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const formats = await getVideoFormats(videoId);
        res.json({ success: true, formats });
    } catch (error) {
        console.error('Error getting formats:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get download URL for specific format
app.get('/api/download/:videoId', async (req, res) => {
    try {
        const { videoId } = req.params;
        const { format, type } = req.query; // format: '1080', '720', etc. type: 'video' or 'audio'

        const result = await getDownloadUrl(videoId, format, type);
        res.json({ success: true, ...result });
    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Stream download (proxies the download through server)
app.get('/api/stream/:videoId', async (req, res) => {
    const { videoId } = req.params;
    const { format, type } = req.query;

    try {
        const { getVideoInfo } = await import('./ytdlp.js');
        const { title } = await getVideoInfo(videoId);
        const safeTitle = title.replace(/[^a-zA-Z0-9\s\-_]/g, '').trim();
        const resolutionLabel = type === 'audio' ? '' : ` - ${format}p`;
        const filename = `${safeTitle}${resolutionLabel}`;

        const url = `https://www.youtube.com/watch?v=${videoId}`;

        let args = [url, '-o', '-']; // Output to stdout

        args.push('--ffmpeg-location', FFMPEG_PATH);

        if (type === 'audio') {
            args.push('-x', '--audio-format', 'mp3', '--audio-quality', format || '192');
        } else {
            // Video with audio merged
            const height = format || '720';
            args.push('-f', `bestvideo[height<=${height}]+bestaudio/best[height<=${height}]`);
        }

        const ext = type === 'audio' ? 'mp3' : 'mp4';

        // Encode filename for header
        res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}.${ext}"`);
        res.setHeader('Content-Type', type === 'audio' ? 'audio/mpeg' : 'video/mp4');

        const ytdlp = spawn('C:\\Users\\lenovo\\AppData\\Local\\Packages\\PythonSoftwareFoundation.Python.3.13_qbz5n2kfra8p0\\LocalCache\\local-packages\\Python313\\Scripts\\yt-dlp.exe', args);

        ytdlp.stdout.pipe(res);

        ytdlp.stderr.on('data', (data) => {
            console.error(`yt-dlp stderr: ${data}`);
        });

        ytdlp.on('close', (code) => {
            if (code !== 0) {
                console.error(`yt-dlp exited with code ${code}`);
            }
        });

        req.on('close', () => {
            ytdlp.kill();
        });

    } catch (error) {
        console.error('Stream error:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 yt-dlp Server running on http://localhost:${PORT}`);
});
