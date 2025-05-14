# Excel Import Setup for UN-Habitat App

This guide provides detailed instructions for setting up the Excel import process for the UN-Habitat application.

## 1. Prerequisites

- Node.js (v16 or later)
- MySQL server installed and running
- Excel file with UN-Habitat project data

## 2. Required NPM Packages

The import process requires the following Node.js packages:

```bash
# Install required dependencies
npm install mysql2 xlsx dotenv fs path
```

## 3. Place the Excel File

Place the Excel file in one of these locations:

- In the project's public directory: `un-habitat-app/public/Application Development - Exam Data.xlsx`
- In the project's root directory: `un-habitat-app/Application Development - Exam Data.xlsx`
- Or, update the `possiblePaths` array in the import script to include the actual location of your file

## 4. Configure Database Settings

Create or update the `.env.local` file in the project root with your MySQL credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unhabitat
```

## 5. Understanding the Scripts

The project includes three scripts for database and data setup:

### setup-database.js

This script:

- Creates the unhabitat database if it doesn't exist
- Creates all required tables by executing statements from init-db.sql
- Handles each SQL statement independently to prevent the entire script from failing if one statement fails

### import-excel-to-mysql.js

This script:

- Reads the Excel file from one of the possible locations
- Processes each row and normalizes the data
- Handles many-to-many relationships for countries, themes, and donors
- Inserts data into the appropriate tables using prepared statements

### setup-and-import.js

This combined script:

- Runs setup-database.js and import-excel-to-mysql.js in sequence
- Provides a single command to set up the entire application
- Handles errors gracefully at each step

## 6. Running the Scripts

You have several options to set up the database:

### Option 1: One-step setup and import (recommended)

```bash
node setup-and-import.js
```

### Option 2: Step-by-step setup

```bash
# First set up the database schema
node setup-database.js

# Then import Excel data
node import-excel-to-mysql.js
```

### Option 3: Manual setup with SQL

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS unhabitat;"

# Import schema
mysql -u root -p unhabitat < init-db.sql

# Then run the import script
node import-excel-to-mysql.js
```

## 7. Troubleshooting

### Database Connection Issues

If you see "Access denied" errors:

- Check that your MySQL server is running
- Verify the credentials in .env.local
- Try connecting to MySQL manually to confirm your password works

### Excel File Not Found

If the script can't find the Excel file:

- Verify the file path
- Check file permissions
- Update the `possiblePaths` array in the script to include the correct path

### Data Format Issues

If data isn't being imported correctly:

- Run the script with the sample data first to verify it works
- Check the Excel column mappings by examining the log output
- Verify that date formats are correct

## 8. Verifying the Import

After importing, check that the data was correctly imported:

```sql
# Connect to MySQL
mysql -u root -p unhabitat

# Count the number of projects
SELECT COUNT(*) FROM projects;

# View a sample project with relationships
SELECT p.ProjectID, p.ProjectTitle, 
       GROUP_CONCAT(DISTINCT pc.CountryName) AS Countries, 
       GROUP_CONCAT(DISTINCT pt.ThemeName) AS Themes
FROM projects p
LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
GROUP BY p.ProjectID
LIMIT 5;
```

## 9. Next Steps

After successfully importing the data:

1. Start the Next.js application: `npm run dev`
2. Access the application at [`http://localhost:3000`](http://localhost:3000)
3. Verify the data appears correctly in the projects list and dashboard
