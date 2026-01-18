import React from 'react';
import { Video } from '../types';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  className?: string;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, className }) => {
  // Safe format for time ago
  const timeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  const formatViews = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n;
  };

  return (
    <div 
      onClick={() => onClick(video)}
      className={`group cursor-pointer flex flex-col gap-3 p-2 rounded-2xl transition-all duration-300 hover:-translate-y-2 
      bg-gradient-to-br from-white to-[#fff176] dark:from-[#1e1e1e] dark:to-[#4a3b00]
      hover:shadow-2xl hover:shadow-accent-yellow/20 dark:hover:shadow-accent-yellow/10 border border-transparent hover:border-accent-yellow/50 ${className}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://picsum.photos/seed/${video.id}/640/360`; }}
        />
        <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-1 rounded-md tracking-wide">
          {video.duration}
        </div>
      </div>

      {/* Metadata */}
      <div className="flex gap-3 px-1 pb-2">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img 
             src={`https://ui-avatars.com/api/?name=${video.uploader}&background=random`} 
             alt={video.uploader}
             className="w-9 h-9 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
          />
        </div>
        {/* Info */}
        <div className="flex flex-col">
          <h3 className="text-base font-bold text-text-main dark:text-dark-text leading-tight line-clamp-2 mb-1 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          <p className="text-xs font-medium text-text-light dark:text-gray-400">
            {video.uploader}
          </p>
          <p className="text-xs text-text-light dark:text-gray-400 mt-0.5">
            {formatViews(video.views)} views • {timeAgo(video.timestamp)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
