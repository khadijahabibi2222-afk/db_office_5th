# بخش اداری موسسه خیریه رفاه یتیم
## Orphan Management System — Full Stack

A complete orphan welfare management system built with **Node.js + Express + MongoDB**, deployable on **GitHub → Render + MongoDB Atlas**.

---

## 🗂 Project Structure

```
orphan-app/
├── server.js              # Express entry point
├── package.json
├── render.yaml            # Render auto-deploy config
├── .env.example           # Copy to .env for local dev
├── middleware/
│   └── auth.js            # JWT verification
├── models/
│   ├── User.js
│   ├── Orphan.js
│   ├── School.js
│   ├── Sponsor.js
│   ├── Score.js
│   └── KVStore.js         # subjects / seasons / graduates / books
├── routes/
│   ├── auth.js            # POST /api/auth/login
│   ├── orphans.js         # GET/PUT /api/orphans
│   ├── schools.js         # GET/PUT /api/schools
│   ├── sponsors.js        # GET/PUT /api/sponsors
│   ├── users.js           # CRUD  /api/users
│   └── kv.js              # GET/PUT /api/kv/:key
└── public/
    └── index.html         # Full frontend (single file)
```

---

## 🚀 Deployment Guide (Step by Step)

### Step 1 — Create MongoDB Atlas Database (Free)

1. Go to [mongodb.com/cloud/atlas](https://mongodb.com/cloud/atlas) → **Sign Up** (free)
2. Create a **Free M0** cluster (any region)
3. **Database Access** → Add user:
   - Username: `orphan_admin`
   - Password: (choose a strong password, save it)
   - Role: **Atlas admin**
4. **Network Access** → Add IP → **Allow Access From Anywhere** (`0.0.0.0/0`)
5. **Connect** → **Drivers** → Copy your connection string:
   ```
   mongodb+srv://orphan_admin:<password>@cluster0.xxxxx.mongodb.net/orphan-db
   ```
   Replace `<password>` with your actual password.

---

### Step 2 — Push to GitHub

```bash
# In your project folder
git init
git add .
git commit -m "Initial commit"
git branch -M main

# Create a new repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/orphan-management-system.git
git push -u origin main
```

---

### Step 3 — Deploy on Render (Free)

1. Go to [render.com](https://render.com) → Sign Up with GitHub
2. Click **New → Web Service**
3. Connect your GitHub repo
4. Render auto-detects `render.yaml` — just confirm settings:
   - **Name:** `orphan-management-system`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add **Environment Variables**:
   | Key | Value |
   |-----|-------|
   | `MONGODB_URI` | your Atlas connection string |
   | `JWT_SECRET` | any random string (e.g. `my$ecretK3y2024!`) |
   | `NODE_ENV` | `production` |
6. Click **Create Web Service**
7. Wait ~2 minutes → your app is live at `https://orphan-management-system.onrender.com`

---

## 🔐 Default Login Credentials

The server auto-seeds these users on first startup:

| Username | Password   | Role     |
|----------|-----------|----------|
| `admin`  | `admin123` | Admin    |
| `editor` | `edit123`  | Editor   |
| `viewer` | `view123`  | Viewer   |

> ⚠️ **Change passwords immediately after first login!**

---

## 💻 Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file
cp .env.example .env
# Edit .env and fill in MONGODB_URI and JWT_SECRET

# 3. Run development server
npm run dev
# → http://localhost:3000
```

---

## 🔌 API Reference

All endpoints require `Authorization: Bearer <token>` header (except login).

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login → returns JWT token |
| GET  | `/api/auth/me`    | Get current user info |

### Data Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/PUT | `/api/orphans`  | Get / Replace all orphan records |
| GET/PUT | `/api/schools`  | Get / Replace all schools |
| GET/PUT | `/api/sponsors` | Get / Replace all sponsors |
| GET/PUT/POST/DELETE | `/api/users/:id` | User management (admin only) |
| GET/PUT | `/api/kv/:key`  | Generic key-value store |

**KV Store keys:** `subjects`, `scores`, `season_days`, `graduates`, `books`, `bookTx`

---

## 🔄 How Data Sync Works

The frontend sends the **complete array** to the server on every save. The server does a MongoDB **bulk upsert** — adding new records, updating changed ones, and deleting removed ones. This keeps the logic simple and compatible with the existing single-page app design.

---

## 📸 Photo & Attachment Storage

Photos and file attachments are stored as **Base64 strings** inside the orphan documents in MongoDB. For production with many records, consider migrating to **Cloudinary** or **AWS S3** for binary storage and storing only URLs in MongoDB.

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Vanilla JS, Single HTML file |
| Backend | Node.js + Express |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Hosting | Render.com (free tier) |
| CI/CD | GitHub → Render auto-deploy |
