# URL Shortener Frontend

Frontend application for the URL shortener built with React, Vite, TypeScript, and Tailwind CSS.

## Prerequisites

- Node.js (v18 or higher)
- Backend server running (see backend README)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Edit `.env` file:**
   - `VITE_API_BASE_URL`: Backend API URL (default: `http://localhost:4000/api`)

4. **Start the development server:**
   ```bash
   npm run dev
   ```

   The app will open in your browser at `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Features

- **Dashboard**: Create and manage short URLs
- **URL Table**: View all your links with search and pagination
- **Statistics**: View detailed stats for each short URL
- **Copy to Clipboard**: One-click copy for short URLs
- **Responsive Design**: Works on mobile, tablet, and desktop

## Project Structure

```
frontend/
├── src/
│   ├── components/     # React components
│   ├── pages/          # Page components
│   ├── lib/            # API client and utilities
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind styles
├── index.html
├── vite.config.ts
├── tailwind.config.cjs
└── package.json
```

