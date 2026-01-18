# Use Node.js LTS (Long Term Support) as base image
FROM node:20-bookworm-slim

# Install system dependencies required for yt-dlp and ffmpeg
# python3: required for yt-dlp
# ffmpeg: required for media processing
# curl: for downloading yt-dlp
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    ffmpeg \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp binary directly
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the React frontend
# This creates the 'dist' folder which the server will serve
RUN npm run build

# Expose the port the app runs on
EXPOSE 3001

# Start the server
# Note: Ensure your start script runs the backend, e.g., "node server/ytdlp.js"
CMD ["npm", "run", "server"]
