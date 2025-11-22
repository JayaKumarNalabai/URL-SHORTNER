# LinkShort - URL Shortener Application

A production-quality URL shortener web application similar to bit.ly, built with modern web technologies.

## 🚀 Tech Stack

### Backend
- **Node.js** + **Express** (TypeScript)
- **MongoDB** + **Mongoose**
- **Zod** for validation
- **Express Rate Limit** for API protection

### Frontend
- **React** + **TypeScript**
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## 📁 Project Structure

```
url-shortener-app/
├── backend/          # Express API server
│   ├── src/
│   │   ├── config/   # Environment & DB config
│   │   ├── models/   # Mongoose models
│   │   ├── routes/   # Express routes
│   │   ├── controllers/ # Route handlers
│   │   ├── middleware/  # Custom middleware
│   │   ├── utils/    # Utility functions
│   │   ├── app.ts    # Express app setup
│   │   └── server.ts # Server entry point
│   └── package.json
│
└── frontend/         # React application
    ├── src/
    │   ├── components/ # React components
    │   ├── pages/      # Page components
    │   ├── lib/        # API client & utils
    │   ├── App.tsx     # Main app
    │   └── main.tsx    # Entry point
    └── package.json
```

## 🛠️ Setup Instructions

### Prerequisites

1. **Node.js** (v18 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file with your MongoDB connection string:
   ```
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

5. Start MongoDB (if using local):
   - Windows: Start MongoDB service or run `mongod`
   - macOS/Linux: `brew services start mongodb-community` or `sudo systemctl start mongod`

6. Run the backend:
   ```bash
   npm run dev
   ```

   Backend will run on `http://localhost:4000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Edit `.env` file:
   ```
   VITE_API_BASE_URL=http://localhost:4000/api
   ```

5. Run the frontend:
   ```bash
   npm run dev
   ```

   Frontend will open at `http://localhost:5173`

## 📝 MongoDB Setup

### Option 1: Local MongoDB

1. **Install MongoDB:**
   - Download from [MongoDB Download Center](https://www.mongodb.com/try/download/community)
   - Follow installation instructions for your OS

2. **Start MongoDB:**
   - **Windows**: MongoDB usually runs as a service automatically
   - **macOS**: `brew services start mongodb-community`
   - **Linux**: `sudo systemctl start mongod`

3. **Verify MongoDB is running:**
   ```bash
   mongosh
   ```
   If it connects, MongoDB is running correctly.

4. **Update `.env` in backend:**
   ```
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   ```

### Option 2: MongoDB Atlas (Cloud)

1. **Create a MongoDB Atlas account:**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a cluster:**
   - Click "Build a Database"
   - Choose the free tier (M0)
   - Select a cloud provider and region
   - Click "Create"

3. **Create a database user:**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter username and password (save these!)
   - Set privileges to "Atlas admin" or "Read and write to any database"
   - Click "Add User"

4. **Configure network access:**
   - Go to "Network Access"
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `url_shortener` (or your preferred database name)

6. **Update `.env` in backend:**
   ```
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/url_shortener?retryWrites=true&w=majority
   ```

## 🎯 Features

- ✅ Shorten long URLs
- ✅ View click statistics for each short URL
- ✅ Manage links (list, search, edit, delete)
- ✅ Pagination for URL list
- ✅ Search functionality
- ✅ Copy short URLs to clipboard
- ✅ Responsive design
- ✅ Clean, modern UI

## 📡 API Endpoints

### Health Check
- `GET /api/health` - Server status

### URL Management
- `POST /api/urls` - Create short URL
- `GET /api/urls` - List URLs (with pagination & search)
- `GET /api/urls/:id` - Get URL by ID
- `GET /api/urls/:id/stats` - Get URL statistics
- `PATCH /api/urls/:id` - Update URL
- `DELETE /api/urls/:id` - Delete URL

### Redirect
- `GET /:shortId` - Redirect to original URL

## 🚦 Running the Application

1. **Start MongoDB** (if using local)
2. **Start Backend:**
   ```bash
   cd backend
   npm run dev
   ```
3. **Start Frontend** (in a new terminal):
   ```bash
   cd frontend
   npm run dev
   ```
4. **Open browser:** `http://localhost:5173`

## 📚 Additional Documentation

- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

## 🔧 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_ORIGIN` - Frontend URL (default: http://localhost:5173)
- `NODE_ENV` - Environment (development/production)

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:4000/api)

## 📝 Notes

- This is a local development setup. No deployment configuration is included.
- The app works without authentication for simplicity.
- All URLs are publicly accessible (no user accounts).
- Rate limiting is applied to prevent abuse.

