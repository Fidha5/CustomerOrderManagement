# PostgreSQL Setup Instructions for Windows

## Step 1: Download and Install PostgreSQL

1. **Download PostgreSQL for Windows**
   - Visit: https://www.postgresql.org/download/windows/
   - Download the latest stable version (recommended: PostgreSQL 16.x)
   - Alternatively, use the interactive installer: https://get.enterprisedb.com/postgresql/postgresql-16.3-1-windows-x64.exe

2. **Run the Installer**
   - Double-click the downloaded `.exe` file
   - Follow the installation wizard:
     - **Installation Directory**: Keep default (e.g., `C:\Program Files\PostgreSQL\16`)
     - **Data Directory**: Keep default
     - **Password**: Set a password for the `postgres` user (remember this password!)
     - **Port**: Keep default `5432`
     - **Locale**: Keep default

3. **Verify Installation**
   - Open Command Prompt and run:
   ```bash
   psql --version
   ```
   - You should see the PostgreSQL version number

## Step 2: Create Database and User

1. **Open psql as postgres user**
   ```bash
   psql -U postgres
   ```

2. **Create the development database**
   ```sql
   CREATE DATABASE order_management_dev;
   ```

3. **Create a development user**
   ```sql
   CREATE USER dev_user WITH PASSWORD 'dev_password';
   GRANT ALL PRIVILEGES ON DATABASE order_management_dev TO dev_user;
   ```

4. **Exit psql**
   ```sql
   \q
   ```

## Step 3: Verify Connection

```bash
psql -h localhost -U dev_user -d order_management_dev
```

If successful, you should see the psql prompt.

## Step 4: Update Application .env File

The backend .env file should already be configured with:
```
DATABASE_URL="postgresql://dev_user:dev_password@localhost:5432/order_management_dev?schema=public"
```

## Alternative: Using pgAdmin

PostgreSQL comes with pgAdmin, a graphical interface:

1. **Open pgAdmin** (installed with PostgreSQL)
2. **Connect to default server** (localhost:5432)
3. **Create Database**: Right-click "Databases" → Create → Database
   - Name: `order_management_dev`
4. **Create Login Role**: Right-click "Login Roles" → Create → Login Role
   - Name: `dev_user`
   - Password: `dev_password`

## Troubleshooting

### PostgreSQL service not running
- Open Services (Win + R → services.msc)
- Find "postgresql-x64-16" service
- Start the service if stopped

### Port conflicts
- Check if port 5432 is available
- Change PostgreSQL port if needed

### Connection issues
- Ensure pg_hba.conf allows local connections
- Check firewall settings

## Quick Setup Commands

Once PostgreSQL is installed, run these commands in order:

```bash
# Create database
createdb -U postgres order_management_dev

# Create user and grant privileges
psql -U postgres -c "CREATE USER dev_user WITH PASSWORD 'dev_password';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE order_management_dev TO dev_user;"

# Test connection
psql -h localhost -U dev_user -d order_management_dev
```

---

**Next Steps**: After PostgreSQL is set up, I'll run the Prisma migrations and seed the database.