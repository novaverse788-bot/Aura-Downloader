import React, { useState } from 'react';
import { Video } from '../types';

// Helper to extract Video ID
const extractVideoId = (url: string): string | null => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    return match ? match[1] : null;
};

import { usePWA } from '../context/PWAContext';

const MetadataExtractor: React.FC = () => {
    const { isInstallable, showInstallPrompt } = usePWA();
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<Video | null>(null);
    const [error, setError] = useState('');

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

    const handleFetch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setData(null);

        const videoId = extractVideoId(url);
        if (!videoId) {
            setError('Invalid YouTube URL');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`/api/formats/${videoId}`);
            const result = await response.json();

            if (result.success && result.formats) {
                // Map backend format to frontend Video type
                const videoData: Video = {
                    id: videoId,
                    title: result.formats.title,
                    thumbnail: result.formats.thumbnail,
                    videoUrl: `https://youtu.be/${videoId}`,
                    duration: result.formats.duration,
                    description: result.formats.description,
                    uploader: result.formats.uploader,
                    uid: 'local',
                    views: result.formats.viewCount,
                    timestamp: Date.now(),
                    tags: result.formats.tags,
                    thumbnails: result.formats.thumbnails
                };
                setData(videoData);
            } else {
                setError('Failed to fetch metadata. Make sure the server is running.');
            }
        } catch (err) {
            console.error(err);
            setError('Error connecting to server.');
        } finally {
            setLoading(false);
        }
    };

    // Toast State
    const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
    // Track which element triggered the copy for specific icon feedback
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToast({ message, visible: true });
        setTimeout(() => setToast({ message: '', visible: false }), 3000);
    };

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        showToast('Copied to clipboard!');

        // Reset icon after 5 seconds
        setTimeout(() => {
            setCopiedId(prevCopiedId => (prevCopiedId === id ? null : prevCopiedId));
        }, 5000); // 5 seconds duration as requested
    };

    const downloadThumbnail = async (imageUrl: string, filename: string) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Failed to download thumbnail directly, opening in new tab", err);
            window.open(imageUrl, '_blank');
        }
    };

    // Filter meaningful thumbnails for display
    const getDisplayThumbnails = () => {
        if (!data?.thumbnails) return [];
        // Prioritize specific resolutions or standard names if available, mostly we want maxres, high, medium
        // Since list might be long, let's pick best 3 unique resolutions
        // Or simply: High (MaxRes), Medium, Low

        // Sort by width descending
        const sorted = [...data.thumbnails].sort((a, b) => b.width - a.width);

        // Filter duplicates by width to get distinct sizes
        const unique = [];
        const seenWidths = new Set();
        for (const t of sorted) {
            if (!seenWidths.has(t.width)) {
                unique.push(t);
                seenWidths.add(t.width);
            }
        }

        // USER REQUEST: Remove "Max" option (index 0), keep next two as "High" and "Low"
        // Also Preview should be the "High" one (index 1 of original sorted list)
        return unique.slice(1, 3);
    };

    const thumbnails = getDisplayThumbnails();

    return (
        <div className="w-full max-w-6xl mx-auto px-6 py-12 animate-fadeIn min-h-screen relative">
            {/* Toast Notification */}
            <div className={`fixed top-24 right-6 z-50 transform transition-all duration-300 ${toast.visible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <div className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 font-bold">
                    <span className="material-symbols-rounded text-green-500">check_circle</span>
                    {toast.message}
                </div>
            </div>

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold font-display mb-4 bg-clip-text text-transparent bg-gradient-to-r from-accent-purple to-primary">
                    YouTube Metadata Extractor
                </h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">
                    Extract High-Quality Thumbnails, Tags, and SEO Data
                </p>
            </div>

            {/* Input Section */}
            <form onSubmit={handleFetch} className={`max-w-2xl mx-auto relative group transition-all duration-500 ${data ? 'mb-12' : 'mb-20'}`}>
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-purple to-primary rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative flex items-center bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-xl overflow-hidden p-2">
                    <input
                        type="text"
                        placeholder="Paste YouTube Link (e.g., https://youtu.be/...)"
                        className="w-full h-14 px-4 bg-transparent outline-none text-lg dark:text-white placeholder-gray-400"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        onPaste={handlePaste}
                    />
                    <button
                        type="submit"
                        disabled={loading || !url.trim()}
                        className="h-12 px-8 rounded-xl bg-accent-purple hover:bg-purple-600 text-white font-bold text-lg transition-all shadow-lg flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? <span className="material-symbols-rounded animate-spin">progress_activity</span> : 'Extract'}
                    </button>
                </div>
                {error && <p className="absolute -bottom-8 left-0 text-accent-red text-sm font-medium animate-fadeIn">{error}</p>}
            </form>

            {/* Results Section */}
            {data && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-scaleUp">

                    {/* Left Column: Thumbnails */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800">
                            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 dark:text-white">
                                <span className="material-symbols-rounded text-primary">image</span>
                                Preview
                            </h2>

                            {/* Main Preview Image */}
                            {thumbnails.length > 0 && (
                                <div className="relative rounded-xl overflow-hidden shadow-lg mb-6 group">
                                    <img
                                        src={thumbnails[0].url}
                                        className="w-full h-auto object-cover"
                                        alt="Video Thumbnail"
                                    />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors pointer-events-none"></div>
                                </div>
                            )}

                            {/* Download Options List */}
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Download Options</h3>
                            <div className="space-y-3">
                                {thumbnails.map((thumb, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-[#141414] rounded-xl hover:bg-gray-100 dark:hover:bg-[#252525] transition-colors border border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-gray-200 dark:bg-gray-800 flex items-center justify-center font-bold text-xs text-gray-600 dark:text-gray-400">
                                                JPG
                                            </div>
                                            <div>
                                                {/* Label Logic: First item is High (was Medium), Second is Low (was Low/Small) */}
                                                <p className="font-bold text-gray-800 dark:text-white text-sm">
                                                    {idx === 0 ? 'High' : 'Low'}
                                                </p>
                                                <p className="text-xs text-gray-500">{thumb.width}x{thumb.height}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => downloadThumbnail(thumb.url, `thumbnail-${idx === 0 ? 'high' : 'low'}.png`)}
                                            className="px-4 py-2 bg-primary/10 hover:bg-primary text-primary hover:text-white rounded-lg text-sm font-bold transition-all flex items-center gap-1"
                                        >
                                            <span className="material-symbols-rounded text-base">download</span>
                                            Download
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Metadata */}
                    <div className="space-y-6">

                        {/* Title */}
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 relative group">
                            <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-2">Video Title</h3>
                            <p className="text-xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-3">{data.title}</p>
                            <button
                                onClick={() => copyToClipboard(data.title, 'title')}
                                className={`absolute top-6 right-6 p-2 rounded-lg transition-colors ${copiedId === 'title' ? 'bg-green-100 text-green-600' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-primary hover:text-white'}`}
                                title="Copy Title"
                            >
                                <span className="material-symbols-rounded">
                                    {copiedId === 'title' ? 'check_circle' : 'content_copy'}
                                </span>
                            </button>
                        </div>

                        {/* Description */}
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 relative group">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Description</h3>
                                <button
                                    onClick={() => copyToClipboard(data.description, 'desc')}
                                    className={`text-sm font-bold hover:underline flex items-center gap-1 transition-colors ${copiedId === 'desc' ? 'text-green-500' : 'text-primary'}`}
                                >
                                    <span className="material-symbols-rounded text-base">
                                        {copiedId === 'desc' ? 'check_circle' : 'content_copy'}
                                    </span>
                                    {copiedId === 'desc' ? 'Copied!' : 'Copy All'}
                                </button>
                            </div>
                            <div className="bg-gray-50 dark:bg-[#141414] rounded-xl p-4 max-h-60 overflow-y-auto custom-scrollbar">
                                <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap font-mono">
                                    {data.description}
                                </p>
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="bg-white dark:bg-[#1e1e1e] p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-800 relative group">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-gray-400 text-sm font-bold uppercase tracking-wider">Tags ({data.tags?.length || 0})</h3>
                                <button
                                    onClick={() => copyToClipboard(data.tags?.join(', ') || '', 'tags_all')}
                                    className={`text-sm font-bold hover:underline flex items-center gap-1 transition-colors ${copiedId === 'tags_all' ? 'text-green-500' : 'text-primary'}`}
                                >
                                    <span className="material-symbols-rounded text-base">
                                        {copiedId === 'tags_all' ? 'check_circle' : 'content_copy'}
                                    </span>
                                    {copiedId === 'tags_all' ? 'Copied!' : 'Copy All'}
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {data.tags?.map((tag, i) => (
                                    <span
                                        key={i}
                                        className={`px-3 py-1 rounded-full text-sm font-medium border transition-colors cursor-pointer ${copiedId === `tag_${i}` ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-primary hover:text-primary'}`}
                                        onClick={() => copyToClipboard(tag, `tag_${i}`)}
                                        title="Click to copy"
                                    >
                                        #{tag}
                                        {copiedId === `tag_${i}` && <span className="ml-1 text-xs">✓</span>}
                                    </span>
                                ))}
                                {!data.tags?.length && <p className="text-gray-500 italic">No tags found.</p>}
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default MetadataExtractor;
