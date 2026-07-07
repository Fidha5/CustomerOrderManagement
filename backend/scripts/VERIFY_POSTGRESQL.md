# How to Verify PostgreSQL Connection

## Quick Verification Checklist

### ✅ Method 1: Check Schema File
```bash
# The schema should show "postgresql"
cat backend/prisma/schema.prisma | grep provider
```

Expected output:
```
provider = "postgresql"
```

### ✅ Method 2: Check .env File
```bash
# Should have postgresql:// not file:./
cat backend/.env | grep DATABASE_URL
```

Expected output:
```
DATABASE_URL="postgresql://..."
```

### ✅ Method 3: Regenerate Prisma Client

**IMPORTANT:** Close any running backend first!

```bash
# 1. Stop any running backend (Ctrl+C if running)

# 2. Regenerate Prisma Client
cd backend
npx prisma generate

# 3. Verify the generated schema
cat node_modules/.prisma/client/schema.prisma | grep provider
```

Should now show: `provider = "postgresql"`

### ✅ Method 4: Run Verification Script

```bash
cd backend
npx ts-node scripts/verify-db.ts
```

Expected output:
```
🔍 Verifying database connection...
✅ Database connected successfully
📊 Database Info: [ { current_database: 'customer_order_db' } ]
📌 Version: PostgreSQL 14.x...
📋 Tables: customer, order, order_history, order_item, order_status, product, user
📈 Row Counts:
  - Users: 0
  - Customers: 0
  - Products: 0
  - Orders: 0
✅ Verification complete - Using PostgreSQL!
```

### ✅ Method 5: Use Prisma Studio

```bash
cd backend
npx prisma studio
```

- Check the top bar - it should show your PostgreSQL database name
- Not "dev.db" (SQLite)

### ✅ Method 6: Run the Backend

```bash
cd backend
npm run start:dev
```

Watch the logs - should see:
```
Prisma schema loaded from prisma/schema.prisma
Database connection established
```

NOT:
```
Loading from file:./dev.db  ← This means SQLite!
```

### ✅ Method 7: Test with PostgreSQL-specific Query

Create a test endpoint or use the verification script:

```typescript
// PostgreSQL-specific queries won't work with SQLite
await prisma.$queryRaw`SELECT current_database()`;  // PostgreSQL only
await prisma.$queryRaw`SELECT version()`;           // PostgreSQL only
```

## 🔧 Troubleshooting

### Issue: "Still using SQLite"

**Cause:** Prisma Client was generated with old schema

**Solution:**
```bash
# Stop all running processes
taskkill /F /IM node.exe 2>nul

# Regenerate Prisma Client
cd backend
npx prisma generate

# Restart backend
npm run start:dev
```

### Issue: "Connection refused"

**Cause:** PostgreSQL not running or wrong connection string

**Solution:**
```bash
# For Docker PostgreSQL
docker ps  # Check if PostgreSQL container is running

# For local PostgreSQL
psql -U postgres -c "SELECT version();"  # Test connection

# Update DATABASE_URL in .env with correct credentials
```

### Issue: "Database does not exist"

**Solution:**
```bash
# Create database
psql -U postgres -c "CREATE DATABASE customer_order_db;"

# Or use Prisma to push schema
cd backend
npx prisma db push
```

## 📊 Complete Verification Commands

```bash
# One comprehensive check
cd backend

echo "1. Checking schema..."
grep -A2 "datasource db" prisma/schema.prisma

echo "2. Checking .env..."
grep DATABASE_URL .env

echo "3. Checking generated client..."
grep provider node_modules/.prisma/client/schema.prisma

echo "4. Regenerating Prisma Client..."
npx prisma generate

echo "5. Running verification..."
npx ts-node scripts/verify-db.ts

echo "6. Starting application..."
npm run start:dev
```

## ✅ What You Should See

| Check | PostgreSQL ✅ | SQLite ❌ |
|-------|--------------|-----------|
| Schema provider | `postgresql` | `sqlite` |
| DATABASE_URL | `postgresql://...` | `file:./dev.db` |
| Prisma Studio | Shows DB name | Shows "dev.db" |
| Query: `current_database()` | Works | Error |
| Generated schema | `postgresql` | `sqlite` |

## 🎯 Verification Complete!

If all checks pass with ✅, you're successfully using PostgreSQL!

---

## Next Steps

Once verified:

1. **For local development:** Ensure PostgreSQL is running
   ```bash
   # Docker
   docker run -d -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres:14

   # Or install PostgreSQL locally
   ```

2. **For production:** Update with Cloud SQL connection string
   ```env
   DATABASE_URL="prisma://aws.connect.psdb.cloud/..."
   ```

3. **Deploy:**
   ```bash
   firebase deploy --only functions
   ```
