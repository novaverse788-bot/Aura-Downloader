import { Video, YouTubeSearchResult, YouTubeVideoDetails } from "../types";

const API_KEY = "AIzaSyBm8STxYgGlmWpNFzMigTulcj6gc3LV0vw";
const GOOGLE_BASE_URL = "https://www.googleapis.com/youtube/v3";

// Mock Data for specific fallback scenarios
const MOCK_VIDEO_DETAILS: Video = {
    id: "dQw4w9WgXcQ",
    title: "Rick Astley - Never Gonna Give You Up (Official Music Video)",
    thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1",
    duration: "3:32",
    description: "The official video for “Never Gonna Give You Up” by Rick Astley",
    uploader: "Rick Astley",
    uid: "mock_rick",
    views: 1400000000,
    timestamp: Date.now(),
    category: "Music",
    isYouTubeApi: true
};

/**
 * Helper to parse duration from various formats (ISO 8601, seconds, MM:SS)
 */
const parseDuration = (duration: any): string => {
  if (!duration) return "0:00";
  
  if (typeof duration === 'number') {
     const hours = Math.floor(duration / 3600);
     const minutes = Math.floor((duration % 3600) / 60);
     const seconds = duration % 60;
     
     if (hours > 0) {
         return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
     }
     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  const str = String(duration);
  if (str.includes(":")) return str;

  const match = str.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  if (!match) return "0:00";
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  let result = "";
  if (hours) result += `${hours}:`;
  result += `${minutes ? (hours && minutes.length < 2 ? '0' + minutes : minutes) : '0'}:`;
  result += `${seconds ? (seconds.length < 2 ? '0' + seconds : seconds) : '00'}`;
  
  return result;
};

/**
 * Fetches details for a specific video ID.
 */
export const getVideoDetails = async (videoId: string): Promise<Video | null> => {
    if (!videoId) return null;
    
    // Check if using API Key
    if (!API_KEY) return MOCK_VIDEO_DETAILS;

    try {
        const response = await fetch(
            `${GOOGLE_BASE_URL}/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`
        );

        if (!response.ok) {
            console.warn("YouTube API Error, falling back to mock.");
            return MOCK_VIDEO_DETAILS;
        }

        const data = await response.json();
        if (!data.items || data.items.length === 0) return null;

        const item = data.items[0];
        return {
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium.url,
            videoUrl: `https://www.youtube.com/embed/${item.id}`,
            duration: parseDuration(item.contentDetails.duration),
            description: item.snippet.description,
            uploader: item.snippet.channelTitle,
            uid: "youtube_api",
            views: parseInt(item.statistics.viewCount || "0"),
            timestamp: new Date(item.snippet.publishedAt).getTime(),
            category: "All",
            isYouTubeApi: true
        };

    } catch (error) {
        console.error("Error fetching video details:", error);
        return MOCK_VIDEO_DETAILS;
    }
};

// Keep existing exports to prevent breaking other potential imports, 
// though they are less used in the downloader version.
export const fetchPopularVideos = async () => [];
export const searchYouTubeVideos = async () => [];