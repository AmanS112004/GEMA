# AI & Robotics Summer Camp - Landing Page & Enquiry API

A premium, highly interactive parent-trust oriented landing page and backend registration API for the **AI & Robotics Summer Camp 2026**.

Developed using React (Vite + TypeScript), Tailwind CSS, Framer Motion, Anime.js, and Three.js for the frontend, and Node.js (Express + TypeScript) with MongoDB (Mongoose) for the backend.

---

## Folder Structure

```text
├── frontend/             # React Vite Client
│   ├── src/
│   │   ├── components/   # Section Components (Hero, FAQ, Navbar, etc.)
│   │   ├── services/     # Axios client configuration
│   │   ├── App.tsx       # Main page layout coordinator
│   │   └── main.tsx      # Mount entry script
│   ├── index.html        # HTML layout with SEO meta & schema tags
│   ├── tailwind.config.js# Curated color variables & design configurations
│   └── tsconfig.json     # Strict TS compilation properties
│
├── backend/              # Node Express API
│   ├── src/
│   │   ├── config/       # Mongoose DB connector
│   │   ├── controllers/  # Route event controllers
│   │   ├── models/       # Mongoose Schema definitions
│   │   ├── routes/       # Express route mapping (/api/enquiry)
│   │   ├── validators/   # Payload verification using express-validator
│   │   └── server.ts     # Main server entry script
│   ├── tsconfig.json     # Backend compilation options
│   └── .env.example      # Example environment variables
```

---

## Environment Variables

Every endpoint and URL configuration is environment-driven. Do not hardcode values.

### Frontend (`frontend/.env`)
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SITE_URL=http://localhost:5173
```

### Backend (`backend/.env`)
Create a `.env` file in the `backend` folder:
```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb+srv://asteinwords_db_user:cFw4EU1eZHi45cgK@cluster0.sdba6xu.mongodb.net/workshop
```

---

## Local Development Setup

### Prerequisite
Ensure you have **Node.js (v18+)** and **npm** installed on your system.

### Step 1: Clone and Navigate
Navigate into the project workspace:
```bash
cd GEMA
```

### Step 2: Install and Run Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server (runs with hot reloading via `ts-node-dev`):
   ```bash
   npm run dev
   ```
4. Verify the backend health check at `http://localhost:5000/health`.

### Step 3: Install and Run Frontend
1. Navigate to the frontend directory (from workspace root):
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Access the web app at `http://localhost:5173`.

---

## Compilation / Production Builds

To compile and verify code correctness:

### Backend Build
```bash
cd backend
npm run build
```
This compiles typescript into JavaScript under `./dist/`. Start in production:
```bash
npm start
```

### Frontend Build
```bash
cd frontend
npm run build
```
This packages optimized chunks and compiles static files under `./dist/`. Test compilation locally:
```bash
npm run preview
```

---

## Deployment Instructions

### 1. Backend Deployment (Render)
- Sign in to [Render](https://render.com/).
- Select **New Web Service** and link your repository.
- Configure settings:
  - **Root Directory**: `backend`
  - **Environment**: `Node`
  - **Build Command**: `npm install && npm run build`
  - **Start Command**: `npm start`
- Add **Environment Variables** matching `backend/.env.example`:
  - `PORT`: `10000` (or leave default)
  - `MONGODB_URI`: `mongodb+srv://asteinwords_db_user:cFw4EU1eZHi45cgK@cluster0.sdba6xu.mongodb.net/workshop`
  - `CLIENT_URL`: Your Netlify client site URL.

### 2. Frontend Deployment (Netlify)
- Sign in to [Netlify](https://www.netlify.com/).
- Select **Add new site** -> **Import from Git**.
- Configure settings:
  - **Root Directory**: `frontend`
  - **Build Command**: `npm run build`
  - **Publish Directory**: `frontend/dist`
- Add **Environment Variables** in Site Settings:
  - `VITE_API_URL`: Your deployed Render API root endpoint (e.g. `https://roboai-api.onrender.com/api`)
  - `VITE_SITE_URL`: Your Netlify site URL.
