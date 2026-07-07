# Quick Start Deployment Checklist

Use this checklist to deploy your application to Firebase with Cloud SQL.

## Pre-Deployment Checklist

- [ ] Firebase project created at https://console.firebase.google.com/
- [ ] Project ID noted: `______________________`
- [ ] Google Cloud billing enabled
- [ ] Firebase CLI installed: `npm install -g firebase-tools`
- [ ] Logged in to Firebase: `firebase login`

## Step 1: Cloud SQL Setup

- [ ] Cloud SQL instance created (PostgreSQL 14+)
- [ ] Instance name: `______________________`
- [ ] Region: `______________________`
- [ ] Database created: `customer_order_db`
- [ ] Connection string obtained:
  ```
  DATABASE_URL="_____________________________________________________"
  DIRECT_URL="_____________________________________________________"
  ```

## Step 2: Configuration Files

- [ ] `.firebaserc` updated with project ID
- [ ] `firebase.json` configured for hosting and functions
- [ ] `backend/.env` updated with Cloud SQL connection strings
- [ ] `backend/prisma/schema.prisma` updated to PostgreSQL provider

## Step 3: Backend Setup

- [ ] Backend dependencies installed:
  ```bash
  cd backend && npm install
  ```
- [ ] Firebase Functions packages installed:
  ```bash
  npm install firebase-admin firebase-functions
  ```
- [ ] Prisma Client generated:
  ```bash
  DATABASE_URL="your-cloud-sql-url" npm run prisma:generate
  ```

## Step 4: Database Migration

- [ ] Prisma schema pushed to Cloud SQL:
  ```bash
  DATABASE_URL="your-cloud-sql-url" npx prisma db push
  ```
- [ ] Or migrations deployed:
  ```bash
  DATABASE_URL="your-cloud-sql-url" npx prisma migrate deploy
  ```

## Step 5: Build and Test

- [ ] Backend built successfully:
  ```bash
  npm run build
  ```
- [ ] Tested locally (optional):
  ```bash
  DATABASE_URL="your-url" npm run start:prod
  ```

## Step 6: Deploy Backend

- [ ] Cloud Functions deployed:
  ```bash
  firebase deploy --only functions
  ```
- [ ] Function URL noted: `______________________`

## Step 7: Deploy Frontend

- [ ] Frontend built:
  ```bash
  cd frontend && npm run build
  ```
- [ ] Hosting deployed:
  ```bash
  firebase deploy --only hosting
  ```
- [ ] App URL: `______________________`

## Step 8: Verification

- [ ] Backend API accessible at: `https://us-central1-project-id.cloudfunctions.net/api`
- [ ] Frontend accessible at: `https://project-id.web.app`
- [ ] Login works
- [ ] Create customer works
- [ ] Create order works
- [ ] Database changes visible in Google Cloud Console

## Step 9: Post-Deployment Setup

- [ ] Set up Firebase Authentication (if not already)
- [ ] Configure custom domain (optional)
- [ ] Set up monitoring and alerts
- [ ] Enable Cloud SQL automatic backups
- [ ] Document API endpoints for frontend
- [ ] Share access with team members

## Important URLs After Deployment

| Service | URL |
|---------|-----|
| Firebase Console | https://console.firebase.google.com/project/PROJECT-ID |
| Cloud Functions | https://console.cloud.google.com/functions |
| Cloud SQL | https://console.cloud.google.com/sql |
| Application | https://PROJECT-ID.web.app |
| API Endpoint | https://REGION-PROJECT-ID.cloudfunctions.net/api |

## Troubleshooting Commands

```bash
# View Cloud Function logs
firebase functions:log

# View Cloud Function logs for specific function
firebase functions:log --filter api

# View Cloud SQL logs
gcloud sql logs tail customer-order-db

# Connect to Cloud SQL locally
cloud_sql_proxy -instances=PROJECT:REGION:INSTANCE=tcp:5432
psql -h 127.0.0.1 -U postgres -d customer_order_db

# Redeploy backend
cd backend && npm run build && firebase deploy --only functions

# Redeploy frontend
cd frontend && npm run build && firebase deploy --only hosting
```

## Support Resources

- Firebase Documentation: https://firebase.google.com/docs
- Cloud SQL Documentation: https://cloud.google.com/sql/docs
- Prisma Cloud SQL Guide: https://www.prisma.io/docs/guides/database/cloud-sql
- Stack Overflow: Tag with `firebase` and `google-cloud-sql`
