# Database Setup Guide for SwapTN Application

## Issue
The application fails to run because the PostgreSQL database `swapTN_new` does not exist.

## Solution

### Option 1: Create Database Using PostgreSQL CLI (Recommended)

1. Open Command Prompt or PowerShell
2. Connect to PostgreSQL:
```bash
psql -U postgres
```
3. Create the database:
```sql
CREATE DATABASE "swapTN_new";
```
4. Exit psql:
```
\q
```

### Option 2: Create Database Using pgAdmin GUI

1. Open pgAdmin (if installed)
2. Right-click on "Databases"
3. Select "Create" → "Database"
4. Name: `swapTN_new`
5. Click "Create"

### Option 3: Use a Database URL Tool

Use a PostgreSQL client tool like DBeaver to create the database.

## Verify Database Creation

Run the test command to verify everything works:
```bash
.\mvnw.cmd clean test
```

Or run the application:
```bash
.\mvnw.cmd spring-boot:run
```

## Current Database Configuration

File: `src/main/resources/application.properties`

- **URL**: jdbc:postgresql://localhost:5432/swapTN_new
- **Username**: postgres
- **Password**: YASSINE197019
- **DDL Mode**: update (Hibernate will automatically create/update tables)

## What Happens After Database Creation

Once the database exists:
1. Hibernate will automatically create all required tables
2. The application will start successfully on port 8081
3. The following tables will be created:
   - users
   - listings
   - messages
   - reviews
   - conversations

---

**Note**: Make sure PostgreSQL server is running before attempting to connect.

