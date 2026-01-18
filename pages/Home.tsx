import React, { useState, useEffect, useMemo } from 'react';
import { Video } from '../types';
import { getVideoDetails } from '../services/youtube';

// Helper to extract Video ID
const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
};

// Helper to parse duration string (H:MM:SS or MM:SS) to seconds
const durationToSeconds = (duration: string): number => {
    if (!duration) return 0;
    const parts = duration.split(':').map(p => parseInt(p, 10));
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

// Helper to calculate estimated file size
const calculateFileSize = (seconds: number, bitrateKbps: number): string => {
    const bytes = (bitrateKbps * 1000 / 8) * seconds;
    const mb = bytes / (1024 * 1024);
    if (mb < 1) return '< 1 MB';
    return `${mb.toFixed(1)} MB`;
};

import { usePWA } from '../context/PWAContext';

const Home: React.FC = () => {
    const { isInstallable, showInstallPrompt } = usePWA();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [video, setVideo] = useState<Video | null>(null);
    const [error, setError] = useState('');
    const [downloading, setDownloading] = useState<{ [key: string]: boolean }>({});
    const [progress, setProgress] = useState<{ [key: string]: number }>({});
    const [history, setHistory] = useState<Video[]>([]);

    // Check if device is desktop
    const isDesktop = () => {
        const userAgent = window.navigator.userAgent;
        return !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent) && window.innerWidth > 1024;
    };

    const handlePaste = () => {
        // Condition: Desktop + Installable (PWA not installed) + Not seen before
        if (isDesktop() && isInstallable) {
            const hasSeen = localStorage.getItem('aura_install_prompt_seen');
            if (!hasSeen) {
                showInstallPrompt();
                localStorage.setItem('aura_install_prompt_seen', 'true');
            }
        }
    };

    // Dynamic Download Options Calculation
    const downloadOptions = useMemo(() => {
        if (!video) return { video: [], audio: [] };
        const seconds = durationToSeconds(video.duration);

        const vOpts = [
            { id: 'v1080', label: '1080p Full HD', bitrate: 4500, ext: 'mp4', badge: 'HD', color: 'bg-primary' },
            { id: 'v720', label: '720p HD', bitrate: 2500, ext: 'mp4', badge: 'HD', color: 'bg-primary' },
            { id: 'v480', label: '480p', bitrate: 1000, ext: 'mp4', badge: null, color: 'bg-gray-500' }
        ].map(opt => ({ ...opt, size: calculateFileSize(seconds, opt.bitrate) }));

        const aOpts = [
            { id: 'mp3-320', label: 'MP3 320kbps', bitrate: 320, ext: 'mp3', badge: 'HQ' },
            { id: 'mp3-192', label: 'MP3 192kbps', bitrate: 192, ext: 'mp3', badge: null },
            { id: 'mp3-128', label: 'MP3 128kbps', bitrate: 128, ext: 'mp3', badge: null },
        ].map(opt => ({ ...opt, size: calculateFileSize(seconds, opt.bitrate) }));

        return { video: vOpts, audio: aOpts };
    }, [video]);

    const handleFetch = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        setError('');
        setVideo(null);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL. Please check the link and try again.');
            return;
        }

        setLoading(true);
        try {
            const details = await getVideoDetails(videoId);
            if (details) {
                setVideo(details);
                // Add to history if unique
                setHistory(prev => {
                    if (prev.find(v => v.id === details.id)) return prev;
                    return [details, ...prev].slice(0, 5);
                });
            } else {
                setError('Video not found. It might be private or removed.');
            }
        } catch (err) {
            setError('An error occurred while processing the video.');
        } finally {
            setLoading(false);
        }
    };

    const startDownload = async (formatId: string, filename: string, type: 'video' | 'audio') => {
        if (downloading[formatId]) return;
        if (!video) return;

        setDownloading(prev => ({ ...prev, [formatId]: true }));
        setProgress(prev => ({ ...prev, [formatId]: 5 }));

        const BACKEND_URL = '';

        // Reset state helper
        const resetState = (delay = 2000) => {
            setTimeout(() => {
                setDownloading(prev => ({ ...prev, [formatId]: false }));
                setProgress(prev => ({ ...prev, [formatId]: 0 }));
            }, delay);
        };

        try {
            // Extract quality from formatId
            let quality: string;
            if (type === 'video') {
                quality = formatId.replace('v', ''); // '1080', '720', '480'
            } else {
                quality = formatId.replace('mp3-', ''); // '320', '192', '128'
            }

            setProgress(prev => ({ ...prev, [formatId]: 20 }));

            // Use streaming endpoint
            const streamUrl = `${BACKEND_URL}/api/stream/${video.id}?format=${quality}&type=${type}`;

            setProgress(prev => ({ ...prev, [formatId]: 50 }));

            // Create download link
            const link = document.createElement('a');
            link.href = streamUrl;
            const ext = type === 'audio' ? 'mp3' : 'mp4';
            link.setAttribute('download', `${video.title}.${ext}`);
            link.setAttribute('target', '_blank');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setProgress(prev => ({ ...prev, [formatId]: 100 }));
            resetState();

        } catch (err) {
            console.error('Download error:', err);
            setError('Download failed. Make sure the backend server is running (npm run server).');
            setProgress(prev => ({ ...prev, [formatId]: 0 }));
            setDownloading(prev => ({ ...prev, [formatId]: false }));
        }
    };

    return (
        <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden min-h-[calc(100vh-200px)]">

            {/* Background Blobs */}
            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-accent-purple/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="w-full max-w-4xl z-10 flex flex-col items-center text-center">

                {!video && (
                    <>
                        <h1 className="text-4xl md:text-6xl font-extrabold font-display mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 animate-fadeIn">
                            Download YouTube Videos <br />
                            <span className="text-primary">Fast & Free</span>
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                            Convert and download YouTube videos in MP4, MP3, and more. No registration required. Just paste the link.
                        </p>
                    </>
                )}

                {/* Search Input */}
                <form onSubmit={handleFetch} className={`w-full max-w-2xl relative group transition-all duration-500 ${video ? 'mb-8' : 'mb-16'}`}>
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent-purple rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                    <div className="relative flex items-center bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden p-2">
                        <div className="pl-4 text-gray-400">
                            <span className="material-symbols-rounded text-2xl">link</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Paste YouTube link here..."
                            className="w-full h-14 px-4 bg-transparent outline-none text-lg dark:text-white placeholder-gray-400"
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            onPaste={handlePaste}
                        />
                        <button
                            type="submit"
                            disabled={loading || !url.trim()}
                            className="h-12 px-8 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-lg transition-all shadow-lg hover:shadow-primary/30 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? <span className="material-symbols-rounded animate-spin">progress_activity</span> : 'Start'}
                        </button>
                    </div>
                    {error && <p className="absolute -bottom-8 left-0 text-accent-red text-sm font-medium animate-fadeIn">{error}</p>}
                </form>

                {/* Video Result */}
                {video && (
                    <div className="w-full bg-white dark:bg-[#1e1e1e] rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-scaleUp flex flex-col md:flex-row">
                        {/* Left: Thumbnail & Meta */}
                        <div className="md:w-5/12 p-6 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-800 flex flex-col gap-4">
                            <div className="relative aspect-video rounded-2xl overflow-hidden group shadow-lg">
                                <img src={video.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Thumbnail" />
                                <a href={video.videoUrl} target="_blank" rel="noreferrer" className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="material-symbols-rounded text-white text-5xl drop-shadow-lg">play_circle</span>
                                </a>
                                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-bold px-2 py-1 rounded">
                                    {video.duration}
                                </div>
                            </div>
                            <div className="text-left">
                                <h2 className="text-xl font-bold line-clamp-2 mb-2 dark:text-white">{video.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{video.uploader}</p>
                                <p className="text-xs text-gray-400">
                                    {video.views.toLocaleString()} views • {new Date(video.timestamp).toLocaleDateString()}
                                </p>
                            </div>
                        </div>

                        {/* Right: Download Options */}
                        <div className="md:w-7/12 p-6 flex flex-col">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 dark:text-white">
                                <span className="material-symbols-rounded text-primary">download</span>
                                Download Options
                            </h3>

                            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3">
                                {/* Video Formats */}
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Video</div>
                                {downloadOptions.video.map(fmt => (
                                    <div key={fmt.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#141414] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold text-xs uppercase">
                                                {fmt.ext}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm dark:text-white flex items-center gap-2">
                                                    {fmt.label}
                                                    {fmt.badge && <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-red text-white">HD</span>}
                                                </div>
                                                <div className="text-xs text-gray-400">{fmt.size}</div>
                                            </div>
                                        </div>

                                        {downloading[fmt.id] ? (
                                            <div className="w-28 h-9 flex items-center px-3 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 bg-accent-green/20 transition-all duration-300" style={{ width: `${progress[fmt.id]}%` }}></div>
                                                <span className="relative z-10 text-xs font-bold w-full text-center text-accent-green">{Math.floor(progress[fmt.id])}%</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startDownload(fmt.id, `${video.title}.${fmt.ext}`, 'video')}
                                                className={`px-4 py-2 rounded-lg ${fmt.color} text-white text-sm font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1`}
                                            >
                                                Download
                                            </button>
                                        )}
                                    </div>
                                ))}

                                {/* Audio Formats */}
                                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4">Audio</div>
                                {downloadOptions.audio.map(fmt => (
                                    <div key={fmt.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#141414] hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors group">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple font-bold text-xs uppercase">
                                                {fmt.ext}
                                            </div>
                                            <div className="text-left">
                                                <div className="font-bold text-sm dark:text-white flex items-center gap-2">
                                                    {fmt.label}
                                                    {fmt.badge && <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent-green text-white">{fmt.badge}</span>}
                                                </div>
                                                <div className="text-xs text-gray-400">{fmt.size}</div>
                                            </div>
                                        </div>
                                        {downloading[fmt.id] ? (
                                            <div className="w-28 h-9 flex items-center px-3 bg-gray-200 dark:bg-gray-800 rounded-lg relative overflow-hidden">
                                                <div className="absolute left-0 top-0 bottom-0 bg-accent-green/20 transition-all duration-300" style={{ width: `${progress[fmt.id]}%` }}></div>
                                                <span className="relative z-10 text-xs font-bold w-full text-center text-accent-green">{Math.floor(progress[fmt.id])}%</span>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => startDownload(fmt.id, `${video.title}.${fmt.ext}`, 'audio')}
                                                className="px-4 py-2 rounded-lg bg-accent-purple text-white text-sm font-bold shadow hover:shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-1"
                                            >
                                                Download
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* History Section */}
                {history.length > 0 && !video && (
                    <div className="mt-20 w-full animate-fadeIn">
                        <h3 className="text-lg font-bold text-gray-400 uppercase tracking-wider mb-6">Recent Downloads</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {history.map(h => (
                                <div key={h.id} onClick={() => { setVideo(h); setUrl(h.videoUrl) }} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-[#1e1e1e] border border-gray-100 dark:border-gray-800 cursor-pointer hover:border-primary/50 transition-all group">
                                    <img src={h.thumbnail} className="w-20 h-12 rounded object-cover" alt="" />
                                    <div className="text-left overflow-hidden">
                                        <div className="font-bold text-sm truncate dark:text-white group-hover:text-primary transition-colors">{h.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{h.duration} • {h.uploader}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </main>
    );
};

export default Home;
