export interface Video {
  id: string;
  title: string;
  thumbnail: string;
  videoUrl: string; // YouTube or other embeddable URL
  duration: string;
  description: string;
  uploader: string;
  uid: string;
  views: number;
  timestamp: number;
  category?: string;
  isYouTubeApi?: boolean; // Flag to distinguish API videos from Firebase videos
  tags?: string[];
  thumbnails?: Array<{ url: string; width: number; height: number; }>;
}

export interface Comment {
  id: string;
  text: string;
  user: string; // displayName
  uid: string;
  avatar?: string;
  timestamp: number;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AnalyticsData {
  views: Record<string, { t: number }>; // viewId -> { t: timestamp }
}

// YouTube API Response Types
export interface YouTubeSearchResult {
  id: {
    videoId: string;
  };
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
}

export interface YouTubeVideoDetails {
  id: string;
  snippet: {
    title: string;
    description: string;
    thumbnails: {
      medium: { url: string };
      high: { url: string };
    };
    channelTitle: string;
    publishedAt: string;
  };
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
}

// Categories for the bubble system
export const CATEGORIES = [
  "All", "Music", "Gaming", "Code", "News", "Sports", "Live",
  "Learning", "Java", "Python", "Vlogs", "Comedy"
];

// Specific colors for category gradients
export const CATEGORY_GRADIENTS = [
  "bg-aura-black text-white", // All
  "bg-gradient-to-r from-[#FF9A9E] to-[#FECFEF] text-aura-black", // Music
  "bg-gradient-to-r from-[#a18cd1] to-[#fbc2eb] text-aura-black", // Gaming
  "bg-gradient-to-r from-[#84fab0] to-[#8fd3f4] text-aura-black", // Code
  "bg-gradient-to-r from-[#cfd9df] to-[#e2ebf0] text-aura-black", // News
  "bg-gradient-to-r from-[#a6c0fe] to-[#f68084] text-aura-black", // Sports
  "bg-gradient-to-r from-[#fccb90] to-[#d57eeb] text-aura-black", // Live
  "bg-gradient-to-r from-[#e0c3fc] to-[#8ec5fc] text-aura-black", // Learning
  "bg-gradient-to-r from-[#f093fb] to-[#f5576c] text-aura-black", // Java
  "bg-gradient-to-r from-[#4facfe] to-[#00f2fe] text-aura-black", // Python
  "bg-gradient-to-r from-[#43e97b] to-[#38f9d7] text-aura-black", // Vlogs
  "bg-gradient-to-r from-[#fa709a] to-[#fee140] text-aura-black", // Comedy
];