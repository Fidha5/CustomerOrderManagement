# ✅ Firebase Deployment Checklist

Copy your Project ID here: `_________________________`

## Phase 1: Setup (5 minutes)

- [ ] **Step 1.1:** Install Firebase CLI
  ```bash
  npm install -g firebase-tools
  ```

- [ ] **Step 1.2:** Login to Firebase
  ```bash
  firebase login
  ```

- [ ] **Step 1.3:** Create Firebase Project
  - Go to: https://console.firebase.google.com/
  - Click: "Create a project"
  - Name: `customer-order-management`
  - Note your Project ID: `_________________________`

- [ ] **Step 1.4:** Set local project
  ```bash
  cd c:\Training\docs
  firebase use your-project-id
  ```

- [ ] **Step 1.5:** Update `.firebaserc`
  - Replace `your-project-id-here` with actual Project ID

---

## Phase 2: Cloud SQL Setup (10 minutes)

- [ ] **Step 2.1:** Go to Google Cloud Console
  - URL: https://console.cloud.google.com/sql

- [ ] **Step 2.2:** Click "Create Instance"
  - Database: PostgreSQL
  - Instance ID: `customer-order-db`
  - Region: `us-central1` (or closest to you)
  - Password: Generate and save → `_____________________`
  - Machine type: Shared core
  - Storage: 10 GB

- [ ] **Step 2.3:** Wait for instance (3-5 minutes)

- [ ] **Step 2.4:** Create database
  - Click instance → "Databases" tab
  - Name: `customer_order_db`

- [ ] **Step 2.5:** Get connection string
  - Click "Connect" tab
  - Copy connection info
  - Format: `postgres://postgres:PASSWORD@IP:5432/customer_order_db`

---

## Phase 3: Configuration (5 minutes)

- [ ] **Step 3.1:** Update `backend/.env`

  Replace DATABASE_URL with your Cloud SQL connection:
  ```env
  DATABASE_URL="your-cloud-sql-connection-string"
  DIRECT_URL="your-cloud-sql-connection-string"
  CLOUD_FUNCTIONS=true
  ```

- [ ] **Step 3.2:** Install Firebase packages
  ```bash
  cd backend
  npm install firebase-admin firebase-functions
  ```

---

## Phase 4: Database Setup (5 minutes)

- [ ] **Step 4.1:** Generate Prisma Client
  ```bash
  cd backend
  DATABASE_URL="your-cloud-sql-url" npx prisma generate
  ```

- [ ] **Step 4.2:** Push schema to database
  ```bash
  DATABASE_URL="your-cloud-sql-url" npx prisma db push
  ```

- [ ] **Step 4.3:** Verify connection
  ```bash
  npx ts-node scripts/verify-db.ts
  ```

---

## Phase 5: Backend Deployment (5 minutes)

- [ ] **Step 5.1:** Build backend
  ```bash
  cd backend
  npm run build
  ```

- [ ] **Step 5.2:** Deploy Cloud Functions
  ```bash
  cd ..
  firebase deploy --only functions
  ```

- [ ] **Step 5.3:** Note the API URL
  - Save: `https://us-central1-PROJECT-ID.cloudfunctions.net/api`

---

## Phase 6: Frontend Deployment (3 minutes)

- [ ] **Step 6.1:** Create `frontend/.env.production`
  ```env
  VITE_API_URL=/api
  ```

- [ ] **Step 6.2:** Build frontend
  ```bash
  cd frontend
  npm run build
  ```

- [ ] **Step 6.3:** Deploy to Firebase Hosting
  ```bash
  cd ..
  firebase deploy --only hosting
  ```

---

## Phase 7: Verification (5 minutes)

- [ ] **Step 7.1:** Test frontend
  - Open: `https://YOUR-PROJECT-ID.web.app`
  - Expected: Login page loads

- [ ] **Step 7.2:** Test backend
  ```bash
  curl https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api
  ```
  - Expected: Response from backend

- [ ] **Step 7.3:** Test login
  - Email: `test@example.com` (or your user)
  - Password: `password123` (or your password)
  - Expected: Login successful

- [ ] **Step 7.4:** Test CRUD
  - Create a customer
  - Create an order
  - Expected: Success

- [ ] **Step 7.5:** Verify database
  - Go to: https://console.cloud.google.com/sql
  - Click your instance
  - Browse → customer_order_db → customer table
  - Expected: See your data

---

## 🎉 Done!

Your application is live!

### Save These URLs:

| Service | URL |
|---------|-----|
| **Frontend** | `https://YOUR-PROJECT-ID.web.app` |
| **Backend API** | `https://us-central1-YOUR-PROJECT-ID.cloudfunctions.net/api` |
| **Firebase Console** | `https://console.firebase.google.com/p/YOUR-PROJECT-ID` |
| **Cloud SQL** | `https://console.cloud.google.com/sql/instances/customer-order-db` |

---

## 🔧 Quick Commands (for reference)

```bash
# View logs
firebase functions:log

# Redeploy backend
cd backend && npm run build && cd .. && firebase deploy --only functions

# Redeploy frontend
cd frontend && npm run build && cd .. && firebase deploy --only hosting

# Deploy everything
firebase deploy

# View Cloud SQL
# https://console.cloud.google.com/sql/instances/customer-order-db/overview
```

---

## 💡 Tips

1. **First request is slow** (2-5 seconds) - This is normal (cold start)
2. **Keep your .env file secret** - Don't commit it
3. **Set up backups** in Cloud SQL settings
4. **Monitor costs** in Google Cloud Console

---

## Need Help?

- Check logs: `firebase functions:log`
- Check Firebase Console
- Check Cloud SQL Console
- Read [DEPLOY_NOW.md](DEPLOY_NOW.md) for detailed guide
