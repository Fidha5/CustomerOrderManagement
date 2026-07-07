# ✅ Render Deployment Checklist

Follow these steps to deploy your application with ONE URL!

---

## Phase 1: GitHub Setup (5 minutes)

- [ ] **Step 1.1:** Create GitHub repository
  - Go to: https://github.com/new
  - Repository name: `customer-order-management`
  - Make it Public (or Private)
  - Click "Create repository"

- [ ] **Step 1.2:** Push code to GitHub
  ```bash
  cd c:\Training\docs
  git init
  git add .
  git commit -m "Initial commit"
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  git branch -M main
  git push -u origin main
  ```

---

## Phase 2: Deploy Backend to Render (10 minutes)

- [ ] **Step 2.1:** Create Render account
  - Go to: https://render.com
  - Click "Sign Up"
  - Sign up with GitHub

- [ ] **Step 2.2:** Create new web service
  - Click "New" → "Web Service"
  - Connect your GitHub repository

- [ ] **Step 2.3:** Configure service
  - **Name:** `customer-order-api`
  - **Region:** `Singapore`
  - **Branch:** `main`
  - **Root Directory:** `backend`
  - **Runtime:** `Node`

- [ ] **Step 2.4:** Build settings
  - **Build Command:** `npm install && npm run build`
  - **Start Command:** `npm run start:prod`

- [ ] **Step 2.5:** Add environment variables (click "Add Environment Variable" for each):

  | Key | Value |
  |-----|-------|
  | `DATABASE_URL` | `postgresql://neondb_owner:npg_8RnB0fExOYLQ@ep-patient-king-aox3f3ak.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
  | `DIRECT_URL` | `postgresql://neondb_owner:npg_8RnB0fExOYLQ@ep-patient-king-aox3f3ak.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require` |
  | `JWT_SECRET` | `your-super-secret-jwt-key-change-in-production` |
  | `NODE_ENV` | `production` |
  | `PORT` | `10000` |
  | `FRONTEND_URL` | `https://customer-management-70ec9.webapp` |

- [ ] **Step 2.6:** Click "Deploy Web Service"
- [ ] **Step 2.7:** Wait 3-5 minutes for deployment
- [ ] **Step 2.8:** Note your backend URL: `https://customer-order-api.onrender.com`

---

## Phase 3: Deploy Frontend to Firebase (5 minutes)

- [ ] **Step 3.1:** Create production environment file
  ```bash
  cd frontend
  echo VITE_API_URL=/api > .env.production
  ```

- [ ] **Step 3.2:** Build frontend
  ```bash
  npm run build
  ```

- [ ] **Step 3.3:** Deploy to Firebase
  ```bash
  cd ..
  firebase deploy --only hosting
  ```

---

## Phase 4: Test (5 minutes)

- [ ] **Step 4.1:** Open your app
  ```
  https://customer-management-70ec9.webapp
  ```

- [ ] **Step 4.2:** Test login

- [ ] **Step 4.3:** Test create customer

- [ ] **Step 4.4:** Test create order

---

## 🎯 Done! Your App is Live!

### Save These URLs:

| Service | URL |
|---------|-----|
| **Your App** | `https://customer-management-70ec9.webapp` (ONE URL!) |
| **Backend API** | `https://customer-order-api.onrender.com` |
| **Render Dashboard** | `https://dashboard.render.com` |
| **Neon Console** | `https://console.neon.tech` |
| **Firebase Console** | `https://console.firebase.google.com/p/customer-management-70ec9` |

---

## 💡 Important Notes

1. **First API call takes ~30 seconds** - Render service wakes up from sleep
2. **Subsequent calls are instant** - Service stays awake for 15 minutes
3. **All from ONE URL** - User sees single domain!

---

## 🔧 Quick Commands (for later)

```bash
# Update backend
git add . && git commit -m "Update" && git push

# Update frontend
cd frontend && npm run build && cd .. && firebase deploy --only hosting

# View Render logs
# Go to: https://dashboard.render.com → customer-order-api → Logs
```

---

**Ready to deploy? Start with Phase 1!** 🚀
