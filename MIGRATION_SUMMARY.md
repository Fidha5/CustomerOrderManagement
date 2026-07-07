# Migration Summary: SQLite → PostgreSQL + Firebase Cloud Functions

## Overview

This document summarizes all changes made to migrate the Customer Order Management application from SQLite to PostgreSQL and enable deployment on Firebase Cloud Functions.

## Changes Made

### 1. Backend Changes

#### Prisma Schema (`backend/prisma/schema.prisma`)
**Before:**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**After:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL") // Required for Cloud SQL connection pooling
}
```

#### Cloud Functions Wrapper (`backend/src/cloud-functions.ts`)
- **NEW FILE**: Created Cloud Functions wrapper
- Enables NestJS app to run as Firebase Cloud Function
- Implements caching for better cold start performance
- Handles HTTP requests through Express adapter

#### Main Application (`backend/src/main.ts`)
- Added `CLOUD_FUNCTIONS` environment variable support
- Conditional Swagger documentation (disabled in Cloud Functions)
- CORS configuration for Firebase environment

#### Environment Configuration (`backend/.env.example`)
- Added PostgreSQL connection string examples
- Added Cloud SQL connection string examples
- Added `CLOUD_FUNCTIONS` flag
- Added `DIRECT_URL` for Prisma Cloud SQL

#### Package.json Updates
- Added `firebase-admin` dependency
- Added `firebase-functions` dependency
- Added deployment scripts:
  - `firebase:deploy` - Deploy Cloud Functions only
  - `firebase:deploy:hosting` - Deploy hosting only
  - `firebase:deploy:all` - Deploy everything

### 2. Firebase Configuration Files

#### `firebase.json`
- Configured Cloud Functions deployment
- Configured Firebase Hosting for frontend
- Set up rewrites: `/api/*` → Cloud Functions
- Added predeploy hooks for Prisma generation
- Set runtime to Node.js 18

#### `.firebaserc`
- Firebase project ID configuration
- Hosting target configuration

### 3. Frontend Changes

#### `.env.example`
- Added Firebase API URL examples
- Added local development configuration
- Added Firebase Hosting same-domain configuration

### 4. Documentation

#### `FIREBASE_DEPLOYMENT.md`
- Complete deployment guide
- Architecture overview
- Step-by-step instructions
- Troubleshooting section
- Security best practices
- Remote database management options

#### `DEPLOYMENT_CHECKLIST.md`
- Quick start checklist
- Pre-flight checks
- Step-by-step deployment steps
- Important URLs
- Troubleshooting commands

## Migration Path

### For Existing SQLite Database

If you have data in SQLite that needs to be migrated:

1. **Export SQLite data:**
```bash
cd backend
npx prisma db pull
npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > schema.sql
```

2. **Use Prisma Seed Script:**
Create `prisma/seed.ts` to migrate data from SQLite to PostgreSQL.

3. **Import to Cloud SQL:**
```bash
# After creating Cloud SQL instance
psql -h CLOUD_SQL_IP -U postgres -d customer_order_db < schema.sql
```

### For New Deployments

No data migration needed. Simply:

1. Create Cloud SQL instance
2. Update DATABASE_URL
3. Run `prisma db push`
4. Deploy

## Prisma Compatibility

All Prisma features used in this project are fully compatible with PostgreSQL:

| Feature | SQLite | PostgreSQL | Status |
|---------|--------|------------|--------|
| UUID IDs | ✅ | ✅ | ✅ Compatible |
| Relations | ✅ | ✅ | ✅ Compatible |
| Transactions | ✅ | ✅ | ✅ Compatible |
| Unique constraints | ✅ | ✅ | ✅ Compatible |
| Default values | ✅ | ✅ | ✅ Compatible |
| @@map decorators | ✅ | ✅ | ✅ Compatible |
| onDelete Cascade | ✅ | ✅ | ✅ Compatible |
| onDelete Restrict | ✅ | ✅ | ✅ Compatible |

**Note**: OrderStatus.id uses auto-increment in SQLite, which works identically in PostgreSQL using `SERIAL` or `BIGSERIAL` types. Prisma handles this automatically.

## API Endpoint Changes

### Before Deployment (Local)
```
Backend: http://localhost:3000/api
Frontend: http://localhost:5173
```

### After Deployment (Firebase)
```
Backend: https://us-central1-PROJECT_ID.cloudfunctions.net/api
Frontend: https://PROJECT_ID.web.app
OR: https://PROJECT_ID.firebaseapp.com
```

### Frontend Configuration
Update `frontend/.env`:
```env
VITE_API_URL=https://us-central1-PROJECT_ID.cloudfunctions.net/api
```

Or use same-domain via Firebase rewrites:
```env
VITE_API_URL=/api
```

## Environment Variables Reference

| Variable | Local Dev | Firebase Cloud Functions | Notes |
|----------|-----------|---------------------------|-------|
| `DATABASE_URL` | `file:./dev.db` | Cloud SQL connection string | Required |
| `DIRECT_URL` | Not used | Direct Cloud SQL connection | For Prisma Cloud |
| `CLOUD_FUNCTIONS` | `false` | `true` | Enables CF mode |
| `JWT_SECRET` | Local value | Production value | Sign with Firebase Secret Manager |
| `FRONTEND_URL` | `http://localhost:5173` | Firebase domain | For CORS |

## Deployment Commands Reference

```bash
# Initial Setup
firebase login
firebase use your-project-id

# Backend Deployment
cd backend
DATABASE_URL="cloud-sql-url" npm run prisma:generate
npm run build
firebase deploy --only functions

# Frontend Deployment
cd frontend
npm run build
cd ..
firebase deploy --only hosting

# Full Deployment
firebase deploy

# Monitor
firebase functions:log
```

## Testing Checklist

Before deploying to production:

- [ ] All API endpoints work locally with PostgreSQL
- [ ] Authentication works correctly
- [ ] CRUD operations for all entities work
- [ ] File uploads (if any) work
- [ ] CORS configuration is correct
- [ ] Environment variables are set
- [ ] Prisma migrations run successfully
- [ ] Cloud Functions deploy without errors
- [ ] Frontend builds successfully
- [ ] Integration tests pass

## Rollback Plan

If issues arise after deployment:

1. **Backend:**
```bash
# Revert code changes
git checkout previous-commit

# Redeploy
cd backend && npm run build && firebase deploy --only functions
```

2. **Frontend:**
```bash
# Revert frontend
git checkout previous-commit

# Redeploy
cd frontend && npm run build && firebase deploy --only hosting
```

3. **Database:**
- Cloud SQL has automatic backups
- Restore via Google Cloud Console if needed

## Support & Troubleshooting

For issues, refer to:
- `FIREBASE_DEPLOYMENT.md` - Detailed guide
- `DEPLOYMENT_CHECKLIST.md` - Quick reference
- Firebase Console logs
- Google Cloud Console logs

## Next Steps

1. Set up Google Cloud billing
2. Create Cloud SQL instance
3. Configure environment variables
4. Test locally with PostgreSQL
5. Deploy to Firebase
6. Monitor and optimize
7. Set up CI/CD pipeline
