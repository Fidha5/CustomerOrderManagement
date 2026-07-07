# Firebase Cloud Functions + Cloud SQL Deployment Guide

This guide covers deploying the Customer Order Management application to Firebase using Cloud Functions for the backend and Cloud SQL for the PostgreSQL database.

## Architecture Overview

```
┌─────────────────────┐
│  Firebase Hosting   │ (Frontend - React App)
│    (frontend/dist)  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────┐
│  Cloud Functions (2nd Gen) │ (Backend - NestJS App)
│       /api/*            │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────┐
│   Cloud SQL         │ (Database - PostgreSQL)
│  (PostgreSQL 14+)   │
└─────────────────────┘
```

## Prerequisites

1. **Firebase Project**: Create one at https://console.firebase.google.com/
2. **Google Cloud Project**: Enabled for Cloud Functions and Cloud SQL
3. **Node.js 18+**: Required for Cloud Functions 2nd Gen
4. **Firebase CLI**: `npm install -g firebase-tools`
5. **PostgreSQL knowledge**: For database management

## Step 1: Firebase Project Setup

```bash
# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init

# Or set your project directly
firebase use your-project-id
```

Update `.firebaserc` with your project ID:

```json
{
  "projects": {
    "default": "your-actual-project-id"
  }
}
```

## Step 2: Enable Required APIs

Enable these APIs in Google Cloud Console (or via gcloud CLI):

```bash
# Enable Cloud Functions API
gcloud services enable cloudfunctions.googleapis.com

# Enable Cloud SQL API
gcloud services enable sqladmin.googleapis.com

# Enable Cloud Build API (for deployment)
gcloud services enable cloudbuild.googleapis.com

# Enable Artifact Registry API
gcloud services enable artifactregistry.googleapis.com
```

## Step 3: Create Cloud SQL Instance

### Option A: Using Google Cloud Console

1. Go to https://console.cloud.google.com/sql
2. Click "Create Instance"
3. Choose PostgreSQL
4. Configure:
   - **Instance ID**: `customer-order-db`
   - **Region**: Choose near your users (e.g., `us-central1`)
   - **Database version**: PostgreSQL 14+
   - **Machine type**: Shared core (dev) or higher (prod)
   - **Storage**: 10GB+ (adjust based on needs)
   - **Password**: Set strong password
5. Create database: `customer_order_db`

### Option B: Using gcloud CLI

```bash
# Create Cloud SQL instance
gcloud sql instances create customer-order-db \
  --database-version=POSTGRES_14 \
  --tier=db-f1-micro \
  --region=us-central1 \
  --storage-auto-increase \
  --project=your-project-id

# Set password
gcloud sql users set-password postgres \
  --instance=customer-order-db \
  --password=your-strong-password

# Create database
gcloud sql databases create customer_order_db \
  --instance=customer-order-db
```

## Step 4: Get Cloud SQL Connection String

### Find your connection details:

1. Go to Cloud SQL instance in console
2. Click "Connect" tab
3. Copy the connection string

Format:
```
# Direct URL (for Prisma)
postgres://postgres:password@project-id:region:instance-id/dbname?schema=public

# Connection Pool URL (for Prisma Cloud)
prisma://aws.connect.psdb.cloud/<connection-id>?pgbouncer=true&connection_limit=10&pool_timeout=20&schema=public
```

## Step 5: Set Up Cloud SQL Connection (Prisma Cloud)

### Option A: Using Prisma Cloud (Recommended for production)

1. Sign up at https://console.prisma.io/
2. Create new project
3. Enable "Prisma Cloud" for connection pooling
4. Add your Cloud SQL database
5. Copy the connection strings

### Option B: Direct Connection

For development or if not using Prisma Cloud:

```env
DATABASE_URL="postgres://postgres:password@project-id:region:instance-id/customer_order_db?schema=public&pgbouncer=true"
DIRECT_URL="postgres://postgres:password@project-id:region:instance-id/customer_order_db?schema=public"
```

## Step 6: Configure Environment Variables

Create `backend/.env.production`:

```env
NODE_ENV=production
CLOUD_FUNCTIONS=true
PORT=8080

# Database (Cloud SQL)
DATABASE_URL="prisma://aws.connect.psdb.cloud/your-connection-id?pgbouncer=true&connection_limit=10&pool_timeout=20&schema=public"
DIRECT_URL="postgres://postgres:password@project:region:instance/customer_order_db?schema=public"

# JWT
JWT_SECRET=your-production-secret-key
JWT_EXPIRES_IN=15d

# CORS (add your Firebase Hosting domain)
FRONTEND_URL=https://your-project-id.web.app,https://your-project-id.firebaseapp.com
```

## Step 7: Update Backend Dependencies

```bash
cd backend

# Install Firebase Functions dependencies
npm install firebase-admin firebase-functions

# Install Prisma PostgreSQL adapter
npm install @prisma/client@latest
npm install -D prisma@latest

# Update TypeScript types
npm install -D @types/node@latest
```

## Step 8: Generate Prisma Client for PostgreSQL

```bash
# Set DATABASE_URL to Cloud SQL for production
export DATABASE_URL="your-cloud-sql-connection-string"

# Generate Prisma Client
npm run prisma:generate

# Push schema to database
npm run prisma:db push  # Or use migrations
```

## Step 9: Update tsconfig for Cloud Functions

Update `backend/tsconfig.json` to include Cloud Functions types:

```json
{
  "compilerOptions": {
    // ... existing options
    "types": ["node", "firebase-functions"]
  }
}
```

## Step 10: Build and Test Locally

```bash
# Build the application
npm run build

# Test with Cloud Functions emulator (optional)
npm install -g firebase-functions-framework
npm run start:firebase

# Or test with NestJS standalone
DATABASE_URL="your-connection-string" npm run start:prod
```

## Step 11: Deploy to Firebase

### Deploy Backend (Cloud Functions)

```bash
# From project root
cd backend

# Generate Prisma Client for production
DATABASE_URL="your-cloud-sql-url" npm run prisma:generate

# Deploy only Cloud Functions
npm run firebase:deploy

# Or from project root
firebase deploy --only functions
```

### Deploy Frontend (Firebase Hosting)

```bash
cd frontend

# Build the React app
npm run build

# Deploy to Firebase Hosting
cd ..
firebase deploy --only hosting
```

### Deploy Everything

```bash
# Deploy both backend and frontend
firebase deploy
```

## Step 12: Configure Cloud SQL IAM Authentication (Optional but Recommended)

1. Enable IAM Authentication:
```bash
gcloud sql instances patch customer-order-db \
  --cloud-sql-iamAuthenticationEnabled=true
```

2. Create IAM database user:
```bash
gcloud sql users create cloud-sql-iam-user \
  --instance=customer-order-db \
  --type=cloud-iam
```

3. Update connection string to use IAM authentication

## Step 13: Set Up Firebase Security Rules

Create `firestore.rules` (if using Firestore for other data):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false; // Default deny
    }
  }
}
```

## Step 14: Monitoring and Logs

### View Cloud Function Logs

```bash
# View logs
firebase functions:log

# View logs for specific function
firebase functions:log --filter api

# Or use Google Cloud Console
# Cloud Logging → Logs Viewer
```

### Monitor Cloud SQL

```bash
# View instance details
gcloud sql instances describe customer-order-db

# View database logs
gcloud sql logs tail customer-order-db --database=customer_order_db
```

## Step 15: Set Up CI/CD (Optional)

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Firebase

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install Firebase CLI
        run: npm install -g firebase-tools

      - name: Install Backend Dependencies
        run: cd backend && npm ci

      - name: Generate Prisma Client
        run: |
          cd backend
          echo "DATABASE_URL=${{ secrets.DATABASE_URL }}" >> $GITHUB_ENV
          npm run prisma:generate

      - name: Build Backend
        run: cd backend && npm run build

      - name: Install Frontend Dependencies
        run: cd frontend && npm ci

      - name: Build Frontend
        run: cd frontend && npm run build

      - name: Deploy to Firebase
        run: firebase deploy --only functions,hosting
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
```

## Troubleshooting

### Common Issues

1. **Cold Start Delays**: Cloud Functions may take 2-5 seconds on first request
2. **Connection Pool Exhaustion**: Adjust `connection_limit` in DATABASE_URL
3. **Memory Issues**: Increase memory in `firebase.json` → functions → runtimeOptions
4. **Prisma Generation**: Must run before each deployment

### Debug Mode

```bash
# Enable debug logging
export DEBUG=*
firebase functions:log --only api
```

### Database Connection Issues

```bash
# Test Cloud SQL connection
gcloud sql connect customer-order-db --user=postgres

# Check connection string format
# Should include pgbouncer=true for connection pooling
```

## Cost Considerations

- **Cloud Functions**: Pay per use (free tier: 2M invocations/month)
- **Cloud SQL**: Always running (shared core ~$8-15/month)
- **Firebase Hosting**: Free tier generous; pay for bandwidth
- **Prisma Cloud**: Free tier available

## Remote Database Management

### Options to Remotely Manage Your Database:

1. **Google Cloud Console** - Web-based SQL editor
   ```
   https://console.cloud.google.com/sql/instances/customer-order-db/overview
   ```

2. **Cloud SQL Proxy** - Secure local connection
   ```bash
   cloud_sql_proxy -instances=project:region:instance=tcp:5432
   psql -h 127.0.0.1 -U postgres -d customer_order_db
   ```

3. **Prisma Studio** - Visual database browser
   ```bash
   DATABASE_URL="your-cloud-sql-url" npx prisma studio
   ```

4. **Your Admin Panel** - The existing frontend continues to work!

5. **Cloud SQL Admin API** - Programmatic access

## Security Best Practices

1. **Never commit** `.env` files
2. **Use Firebase Secret Manager** for sensitive values
3. **Enable IAM Authentication** for Cloud SQL
4. **Use Cloud Armor** for DDoS protection
5. **Restrict API access** with Firebase Authentication
6. **Regular backups** are automatic with Cloud SQL

## Next Steps

1. Set up Google Cloud billing
2. Create Cloud SQL instance
3. Configure DATABASE_URL
4. Test locally with Cloud Functions emulator
5. Deploy to Firebase
6. Configure custom domain (optional)
7. Set up monitoring and alerts

## Additional Resources

- [Firebase Functions Documentation](https://firebase.google.com/docs/functions)
- [Cloud SQL Documentation](https://cloud.google.com/sql/docs)
- [Prisma Cloud SQL Guide](https://www.prisma.io/docs/guides/database/cloud-sql)
- [Firebase CLI Reference](https://firebase.google.com/docs/cli)
