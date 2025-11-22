# 🚀 Complete Setup Guide

This guide will walk you through setting up the URL Shortener application step by step.

## 📋 Prerequisites Checklist

- [ ] Node.js (v18 or higher) - [Download here](https://nodejs.org/)
- [ ] MongoDB (local or Atlas account) - [Download here](https://www.mongodb.com/try/download/community) or [Sign up for Atlas](https://www.mongodb.com/cloud/atlas)

## 🔧 Step 1: MongoDB Setup

### Option A: Local MongoDB (Recommended for Development)

1. **Download and Install MongoDB:**
   - Visit: https://www.mongodb.com/try/download/community
   - Download the Community Server for your OS
   - Follow the installation wizard

2. **Start MongoDB:**
   - **Windows:**
     - MongoDB usually starts automatically as a Windows service
     - If not, open Services (services.msc) and start "MongoDB"
     - Or run: `mongod` in a terminal
   
   - **macOS:**
     ```bash
     brew services start mongodb-community
     ```
   
   - **Linux:**
     ```bash
     sudo systemctl start mongod
     ```

3. **Verify MongoDB is Running:**
   ```bash
   mongosh
   ```
   If you see the MongoDB shell prompt, you're good to go! Type `exit` to leave.

4. **Connection String:**
   ```
   mongodb://localhost:27017/url_shortener
   ```

### Option B: MongoDB Atlas (Cloud - Free Tier)

1. **Create Account:**
   - Go to: https://www.mongodb.com/cloud/atlas
   - Click "Try Free" and sign up

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose **FREE** (M0) tier
   - Select a cloud provider (AWS, Google Cloud, or Azure)
   - Choose a region closest to you
   - Click "Create"

3. **Create Database User:**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Enter a username (e.g., `urlshortener`)
   - Click "Autogenerate Secure Password" or create your own
   - **⚠️ IMPORTANT:** Copy and save the password!
   - Set user privileges to "Atlas admin" (or "Read and write to any database")
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - For development, click "Allow Access from Anywhere" (adds 0.0.0.0/0)
   - Click "Confirm"
   - ⚠️ **Note:** For production, restrict to specific IPs

5. **Get Connection String:**
   - Go to "Database" → "Connect"
   - Click "Connect your application"
   - Choose "Node.js" and version "5.5 or later"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name at the end: `...mongodb.net/url_shortener?retryWrites=true&w=majority`

6. **Final Connection String Format:**
   ```
   mongodb+srv://urlshortener:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/url_shortener?retryWrites=true&w=majority
   ```

## 🔧 Step 2: Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install all required packages (Express, Mongoose, TypeScript, etc.)

3. **Create environment file:**
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

4. **Edit `.env` file:**
   Open `backend/.env` in a text editor and update:

   **For Local MongoDB:**
   ```env
   PORT=4000
   MONGODB_URI=mongodb://localhost:27017/url_shortener
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```

   **For MongoDB Atlas:**
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/url_shortener?retryWrites=true&w=majority
   CLIENT_ORIGIN=http://localhost:5173
   NODE_ENV=development
   ```
   
   ⚠️ **Replace:**
   - `username` with your Atlas database username
   - `password` with your Atlas database password
   - `cluster0.xxxxx` with your actual cluster address

5. **Start the backend server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   ✅ MongoDB connected successfully
   🚀 Server running on http://localhost:4000
   📊 Environment: development
   ```

   ✅ **Backend is now running!** Keep this terminal open.

## 🔧 Step 3: Frontend Setup

1. **Open a NEW terminal window** (keep backend running)

2. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

3. **Install dependencies:**
   ```bash
   npm install
   ```
   This will install React, Vite, Tailwind CSS, etc.

4. **Create environment file:**
   ```bash
   # Windows (PowerShell)
   Copy-Item .env.example .env
   
   # macOS/Linux
   cp .env.example .env
   ```

5. **Edit `.env` file:**
   Open `frontend/.env` in a text editor:
   ```env
   VITE_API_BASE_URL=http://localhost:4000/api
   ```
   (This should already be correct if backend is on port 4000)

6. **Start the frontend development server:**
   ```bash
   npm run dev
   ```

   You should see:
   ```
   VITE v5.x.x  ready in xxx ms
   
   ➜  Local:   http://localhost:5173/
   ➜  Network: use --host to expose
   ```

   The browser should automatically open to `http://localhost:5173`

   ✅ **Frontend is now running!**

## ✅ Step 4: Verify Everything Works

1. **Check Backend Health:**
   - Open: http://localhost:4000/api/health
   - Should see: `{"status":"ok","timestamp":"..."}`

2. **Test the App:**
   - Go to: http://localhost:5173
   - You should see the "LinkShort" dashboard
   - Try creating a short URL:
     - Enter: `https://www.google.com`
     - Click "Shorten URL"
     - You should see a new entry in the table

3. **Test Redirect:**
   - Click on the short URL in the table
   - It should redirect to the original URL
   - Go back and check the "Clicks" count increased

4. **Test Stats:**
   - Click "Stats" on any URL
   - You should see detailed statistics

## 🐛 Troubleshooting

### Backend Issues

**"MongoDB connection error"**
- ✅ Check MongoDB is running (local) or connection string is correct (Atlas)
- ✅ Verify `.env` file has correct `MONGODB_URI`
- ✅ For Atlas: Check network access allows your IP
- ✅ For Atlas: Verify username/password are correct

**"Port 4000 already in use"**
- Change `PORT` in `backend/.env` to another port (e.g., 4001)
- Update `VITE_API_BASE_URL` in `frontend/.env` accordingly

**"Cannot find module" errors**
- Run `npm install` again in the backend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

### Frontend Issues

**"Network error" or "Failed to fetch"**
- ✅ Check backend is running on port 4000
- ✅ Verify `VITE_API_BASE_URL` in `frontend/.env` matches backend URL
- ✅ Check browser console for CORS errors (shouldn't happen if setup correctly)

**"Cannot find module" errors**
- Run `npm install` again in the frontend directory
- Delete `node_modules` and `package-lock.json`, then `npm install`

### MongoDB Atlas Issues

**"Authentication failed"**
- Double-check username and password in connection string
- Make sure password doesn't contain special characters that need URL encoding
- Try creating a new database user

**"IP not whitelisted"**
- Go to Network Access in Atlas
- Add your current IP address or use 0.0.0.0/0 for development

## 📝 Quick Reference

### Environment Variables

**Backend (`backend/.env`):**
- `PORT` - Backend server port (default: 4000)
- `MONGODB_URI` - MongoDB connection string
- `CLIENT_ORIGIN` - Frontend URL (default: http://localhost:5173)
- `NODE_ENV` - Environment mode (development/production)

**Frontend (`frontend/.env`):**
- `VITE_API_BASE_URL` - Backend API URL (default: http://localhost:4000/api)

### Useful Commands

**Backend:**
```bash
cd backend
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production build
```

**Frontend:**
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## 🎉 You're All Set!

Your URL shortener is now running! Start creating short links and tracking their statistics.

For more details, see:
- [Root README](./README.md)
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)

