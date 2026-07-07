# 🔥 Deploy to Firebase - Step by Step Guide

## Prerequisites Checklist

Before starting, ensure you have:
- [ ] Google account with billing enabled
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] PostgreSQL database access (local or Cloud SQL)

---

## Step 1: Create Firebase Project

### Option A: Via Firebase Console
1. Go to https://console.firebase.google.com/
2. Click "Add project" or "Create a project"
3. Enter project name (e.g., `customer-order-management`)
4. Accept terms and continue
5. **Disable Google Analytics** for now (can enable later)
6. Click "Create project"
7. Note your **Project ID** (shown after creation)

### Option B: Via Firebase CLI
```bash
firebase login
firebase projects:create
```

**Note your Project ID:** `_____________________________`

---

## Step 2: Set Up Firebase Locally

```bash
# 1. Login to Firebase
firebase login

# 2. Set your project (replace with your Project ID)
firebase use your-project-id

# 3. Verify
firebase projects:list
```

---

## Step 3: Create Cloud SQL Instance

### A. Using Google Cloud Console

1. Go to https://console.cloud.google.com/sql
2. Click **"Create Instance"**
3. Choose **PostgreSQL**
4. Configure:
   - **Instance ID**: `customer-order-db`
   - **Password**: Generate strong password → save it!
   - **Region**: Choose near you (e.g., `us-central1`)
   - **Database version**: PostgreSQL 14 or later
   - **Machine type**: Shared core (free tier)
   - **Storage**: 10 GB
5. Click **"Create"**

### B. Create Database

After instance is ready (~3-5 minutes):

1. Click on your instance
2. Go to **"Databases"** tab
3. Click **"Create database"**
4. Name: `customer_order_db`
5. Click **"Create"**

---

## Step 4: Get Cloud SQL Connection String

### Option A: Direct Connection (Simple)

From Cloud SQL instance page:
1. Click **"Connect"** tab
2. Copy **"Public IP"** connection string:

```
DATABASE_URL="postgres://postgres:YOUR-PASSWORD@PUBLIC-IP:5432/customer_order_db?schema=public"
```

### Option B: Via Prisma Cloud (Recommended for Production)

1. Go to https://console.prisma.io/
2. Sign up/login
3. Create new project
4. Add datasource → Cloud SQL
5. Follow wizard to connect
6. Copy connection strings:

```
DATABASE_URL="prisma://aws.connect.psdb.cloud/..."
DIRECT_URL="postgres://..."
```

---

## Step 5: Update Backend Configuration

### Update `.firebaserc` with your project ID:```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

### Update `backend/.env` with production values:```env
# Cloud Functions mode
CLOUD_FUNCTIONS=true

# Database - Use your actual Cloud SQL connection
DATABASE_URL="your-cloud-sql-connection-string"
DIRECT_URL="your-direct-connection-string"

# JWT
JWT_SECRET="your-production-secret-key"

# CORS - Add your Firebase domain
FRONTEND_URL=https://your-project-id.web.app,https://your-project-id.firebaseapp.com
```

---

## Step 6: Install Dependencies and Build

```bash
# 1. Go to backend
cd backend

# 2. Install Firebase dependencies
npm install firebase-admin firebase-functions

# 3. Generate Prisma Client for PostgreSQL
set DATABASE_URL=your-cloud-sql-connection-string
npx prisma generate

# 4. Build the application
npm run build
```

---

## Step 7: Push Database Schema

### Option A: Push Direct (Fastest)

```bash
cd backend
set DATABASE_URL=your-cloud-sql-connection-string
npx prisma db push
```

### Option B: Create Migration (Better for Production)

```bash
cd backend
set DATABASE_URL=your-cloud-sql-connection-string
npx prisma migrate deploy
```

---

## Step 8: Deploy Backend to Cloud Functions

```bash
# From project root
firebase deploy --only functions

# You should see:
# i  deploying functions
# i  functions: ensuring API is enabled
# i  functions: building
# i  functions: uploading files
# i  functions: cleaning up
# ✔  Deploy complete!

# Note the Function URL:
# API URL: https://us-central1-project-id.cloudfunctions.net/api
```

---

## Step 9: Build and Deploy Frontend

```bash
# 1. Build frontend
cd frontend
npm run build

# 2. Deploy to Firebase Hosting
cd ..
firebase deploy --only hosting

# You should see:
# ✔  Deploy complete!
# Project Console: https://console.firebase.google.com/p/project-id/overview
# Hosting URL: https://project-id.web.app
```

---

## Step 10: Update Frontend Environment

Create `frontend/.env.production`:
```env
VITE_API_URL=https://us-central1-your-project-id.cloudfunctions.net/api
```

Or use same-domain (recommended):
```env
VITE_API_URL=/api
```

Then rebuild and redeploy:
```bash
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## Step 11: Verify Deployment

### Check Backend API
```bash
# Test API health
curl https://us-central1-project-id.cloudfunctions.net/api

# Or open in browser:
# https://us-central1-project-id.cloudfunctions.net/api
```

### Check Frontend
```
Open: https://project-id.web.app
```

### Check Cloud Functions Logs
```bash
firebase functions:log

# Or filter for API
firebase functions:log --only api
```

---

## Step 12: Test Your Application

1. **Open your app**: https://project-id.web.app
2. **Test login** with existing credentials
3. **Create a customer**
4. **Create an order**
5. **Verify data in Cloud SQL**:
   - Go to Google Cloud Console
   - Cloud SQL → your instance
   - Browse → your database
   - Run query: `SELECT * FROM customer;`

---

## 🎯 Quick Deploy Commands (All-in-One)

```bash
# Replace placeholders with your actual values
PROJECT_ID="your-project-id"
DB_URL="your-cloud-sql-connection-string"

# 1. Set project
firebase use $PROJECT_ID

# 2. Deploy backend
cd backend
DATABASE_URL="$DB_URL" npx prisma generate
DATABASE_URL="$DB_URL" npx prisma db push
npm run build
cd ..
firebase deploy --only functions

# 3. Deploy frontend
cd frontend
npm run build
cd ..
firebase deploy --only hosting
```

---

## 📋 Post-Deployment Checklist

- [ ] Backend API responds at Cloud Functions URL
- [ ] Frontend loads at Firebase Hosting URL
- [ ] Login works
- [ ] CRUD operations work
- [ ] Database data persists in Cloud SQL
- [ ] CORS errors are resolved
- [ ] Logs show no errors

---

## 🔧 Troubleshooting

### Issue: "Function failed on loading"

**Cause:** Prisma Client not generated or wrong architecture

**Solution:**
```bash
cd backend
rm -rf node_modules/.prisma
DATABASE_URL="your-url" npx prisma generate
npm run build
firebase deploy --only functions
```

### Issue: "CORS errors"

**Solution:** Update `.env`:
```env
FRONTEND_URL=https://your-project-id.web.app,https://your-project-id.firebaseapp.com
```

### Issue: "Database connection error"

**Solution:**
1. Verify DATABASE_URL is correct
2. Check Cloud SQL instance is running
3. Verify IAM permissions

### Issue: "High latency on first request"

**Cause:** Cloud Functions cold start (normal behavior)

**Solution:** This is expected. First request takes 2-5 seconds.

---

## 💰 Cost Estimates

| Service | Free Tier | Estimated Cost |
|---------|-----------|----------------|
| Cloud Functions | 2M invocations/month | Pay per use |
| Cloud SQL | None | $8-15/month (shared core) |
| Firebase Hosting | 10GB/month | Free for most apps |

---

## 🚀 Next Steps After Deployment

1. **Set up custom domain** (optional)
2. **Enable Cloud SQL backups**
3. **Set up monitoring alerts**
4. **Configure CI/CD**
5. **Add team members** to Firebase project

---

## 📞 Support Resources

- [Firebase Console](https://console.firebase.google.com)
- [Cloud Functions Documentation](https://firebase.google.com/docs/functions)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Prisma Cloud SQL Guide](https://www.prisma.io/docs/guides/database/cloud-sql)

---

## ✅ You're Live!

Your application is now deployed on Firebase with Cloud SQL!

**URLs to save:**
- Frontend: `https://your-project-id.web.app`
- Backend: `https://us-central1-your-project-id.cloudfunctions.net/api`
- Firebase Console: `https://console.firebase.google.com/p/your-project-id`
- Cloud SQL: `https://console.cloud.google.com/sql/instances/customer-order-db`
