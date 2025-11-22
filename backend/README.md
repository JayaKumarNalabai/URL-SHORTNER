# URL Shortener Backend

Backend API for the URL shortener application built with Node.js, Express, TypeScript, and MongoDB.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running locally or MongoDB Atlas connection string)

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
   - `PORT`: Server port (default: 4000)
   - `MONGODB_URI`: MongoDB connection string (e.g., `mongodb://localhost:27017/url_shortener`)
   - `CLIENT_ORIGIN`: Frontend URL (default: `http://localhost:5173`)
   - `NODE_ENV`: Environment (development/production)

4. **Start MongoDB:**
   - If using local MongoDB, ensure it's running on `localhost:27017`
   - Or use MongoDB Atlas and update `MONGODB_URI` in `.env`

5. **Run the development server:**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server (requires build first)

## API Endpoints

### Health Check
- `GET /api/health` - Server health status

### URL Management
- `POST /api/urls` - Create a new short URL
- `GET /api/urls` - Get paginated list of URLs (query params: `page`, `limit`, `search`)
- `GET /api/urls/:id` - Get a single URL by ID
- `GET /api/urls/:id/stats` - Get statistics for a URL
- `PATCH /api/urls/:id` - Update a URL
- `DELETE /api/urls/:id` - Delete a URL

### Redirect
- `GET /:shortId` - Redirect to original URL (increments click count)

## Project Structure

```
backend/
├── src/
│   ├── config/        # Configuration (env, db)
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── controllers/   # Route handlers
│   ├── middleware/    # Custom middleware
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   ├── app.ts         # Express app setup
│   └── server.ts      # Server entry point
├── package.json
├── tsconfig.json
└── .env.example
```

