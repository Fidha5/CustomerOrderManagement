# 🚀 Render + Firebase Deployment Guide

Complete guide to deploy your application with **ONE URL** using Render (backend) + Firebase (frontend) + Neon (database).

---

## Architecture Overview

```
┌──────────────────────────────────────┐
│  https://customer-management-70ec9.web.app  │
│         (Firebase Hosting)            │
└──────────────┬─────────────────────────┘
               │
       ┌───────┴────────┐
       │                │
       ▼                ▼
Frontend      API Requests → Render Backend
(React)        (https://customer-order-api.onrender.com)
                        │
                        ▼
                Neon PostgreSQL
```

**User sees ONE URL:** `https://customer-management-70ec9.webapp`

---

## Step 1: Push Code to GitHub

### If you don't have a GitHub repository:

```bash
# Initialize git (if not already done)
cd c:\Training\docs
git init
git add .
git commit -m "Initial commit for deployment"

# Create GitHub repository first at https://github.com/new
# Then add remote (replace YOUR_USERNAME/REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### If you already have GitHub:

```bash
cd c:\Training\docs
git add .
git commit -m "Add Neon database and Render configuration"
git push
```

---

## Step 2: Deploy Backend to Render

### Option A: Via Render Dashboard (Easier)

1. **Create Render Account:**
   - Go to: https://render.com
   - Click "Sign Up"
   - Sign up with GitHub (recommended)

2. **Create New Web Service:**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service:**
   - **Name**: `customer-order-api`
   - **Region**: `Singapore` (or closest to you)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Node`

4. **Build & Deploy Settings:**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start:prod`

5. **Environment Variables:**
   Click "Add Environment Variable" for each:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql://neondb_owner:npg_8RnB0fExOYLQ@ep-patient-king-aox3f3ak.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
   | `DIRECT_URL` | `postgresql://neondb_owner:npg_8RnB0fExOYLQ@ep-patient-king-aox3f3ak.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
   | `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production` |
   | `NODE_ENV` | `production` |
   | `PORT` | `10000` |
   | `FRONTEND_URL` | `https://customer-management-70ec9.webapp` |

6. **Click "Deploy Web Service"**

7. **Wait for deployment** (3-5 minutes)
8. **Note your backend URL:** `https://customer-order-api.onrender.com`

---

### Option B: Via Blueprint (Auto-deploy)

If you pushed the `render.yaml` file:

1. Go to Render dashboard
2. Click "New" → "Blueprint"
3. Connect your GitHub repository
4. Render will detect `render.yaml` and configure automatically
5. Click "Apply Blueprint"

---

## Step 3: Verify Backend Deployment

After deployment completes:

```bash
# Test your backend API
curl https://customer-order-api.onrender.com/api

# Or open in browser:
https://customer-order-api.onrender.com/api
```

Expected: Response from your NestJS app

---

## Step 4: Update Firebase Hosting Configuration

Update `firebase.json` to add API rewrites:```json
{
  "hosting": {
    "public": "frontend/dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "/api/**",
        "destination": "https://customer-order-api.onrender.com/api"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Cache-Control",
            "value": "no-cache, no-store, must-revalidate"
          }
        ]
      }
    ]
  }
}
```

---

## Step 5: Build and Deploy Frontend

```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## Step 6: Configure Frontend Environment

Create `frontend/.env.production`:
```env
VITE_API_URL=/api
```

Rebuild and redeploy:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## Step 7: Test Your Application

1. **Open your app:** `https://customer-management-70ec9.webapp`
2. **Test login**
3. **Test CRUD operations**
4. **Verify everything works from ONE URL!**

---

## 🎯 Final URLs

| Service | URL |
|---------|-----|
| **Main App** | `https://customer-management-70ec9.webapp` (ONE URL!) |
| **Backend API** | `https://customer-order-api.onrender.com` (direct access) |
| **Neon Database** | https://console.neon.tech |
| **Firebase Console** | https://console.firebase.google.com/p/customer-management-70ec9 |
| **Render Dashboard** | https://dashboard.render.com |

---

## 💰 Costs

- **Render:** Free tier (spins down after inactivity, wakes in ~30s)
- **Firebase Hosting:** Free
- **Neon:** Free tier
- **Total:** $0/month

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to backend"
- Check Render dashboard for logs
- Verify environment variables are correct
- Check backend service is live

### Issue: "CORS errors"
- Verify FRONTEND_URL includes your Firebase domain
- Check backend CORS configuration

### Issue: "Render service sleeping"
- First request takes ~30 seconds to wake up
- This is normal on free tier

---

## 🔄 Updates and Redeployment

### Backend Updates:
```bash
git add .
git commit -m "Update backend"
git push
# Render auto-deploys from GitHub!
```

### Frontend Updates:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

**Ready to deploy? Start with Step 1!** 🚀
