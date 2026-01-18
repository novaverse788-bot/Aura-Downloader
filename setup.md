# Aura Downloader - Setup Guide

YouTube videos download karne ke liye complete setup guide.

## Prerequisites

### 1. Node.js Install Karo
Agar Node.js nahi hai toh download karo: https://nodejs.org/

Check karo installed hai ya nahi:
```bash
node --version
npm --version
```

### 2. yt-dlp Install Karo

**Option A: pip se (Python required)**
```bash
pip install yt-dlp
```

**Option B: winget se (Windows 10/11)**
```bash
winget install yt-dlp
```

**Option C: Direct Download**
- https://github.com/yt-dlp/yt-dlp/releases se `yt-dlp.exe` download karo
- Isko `C:\Windows` ya kisi PATH folder me daalo

Verify installation:
```bash
yt-dlp --version
```

### 3. FFmpeg Install Karo (Required for video+audio merge)

**Option A: winget se**
```bash
winget install ffmpeg
```

**Option B: Chocolatey se**
```bash
choco install ffmpeg
```

**Option C: Manual Install**
1. https://www.gyan.dev/ffmpeg/builds/ se download karo
2. Extract karo `C:\ffmpeg` me
3. `C:\ffmpeg\bin` ko System PATH me add karo

Verify installation:
```bash
ffmpeg -version
```

---

## App Setup

### Step 1: Dependencies Install Karo
```bash
npm install
```

### Step 2: App Start Karo

**Both frontend + backend ek saath:**
```bash
npm run dev:all
```

**Ya separately (2 terminals me):**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Step 3: Browser me Open Karo
```
http://localhost:5173
```

---

## Usage

1. YouTube video ka URL paste karo
2. "Start" button click karo
3. Video info load hone ke baad resolution select karo:
   - **Video:** 1080p, 720p, 480p (MP4)
   - **Audio:** 320kbps, 192kbps, 128kbps (MP3)
4. "Download" click karo

---

## Troubleshooting

### "yt-dlp not found" Error
- Check karo yt-dlp PATH me hai: `yt-dlp --version`
- System restart karo after installation

### "ffmpeg not found" Error
- FFmpeg install karo (upar dekho)
- Without ffmpeg, video aur audio alag download honge

### Download slow hai
- yt-dlp update karo: `pip install -U yt-dlp`
- VPN try karo agar YouTube throttle kar raha hai

### Backend not responding
- Check karo server chal raha hai: `npm run server`
- Port 3001 free hona chahiye

### CORS Error
- Backend server zaroor chalna chahiye
- Frontend aur backend dono start karo

---

## Ports

| Service  | Port |
|----------|------|
| Frontend | 5173 |
| Backend  | 3001 |

---

## Available Scripts

```bash
npm run dev       # Frontend only (Vite)
npm run server    # Backend only (Express + yt-dlp)
npm run dev:all   # Both together
npm run build     # Production build
```

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Downloader:** yt-dlp (Python CLI)
- **Video Processing:** FFmpeg
