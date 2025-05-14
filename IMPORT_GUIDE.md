# Excel Data Import Guide for UN-Habitat App

This guide explains how to import data from the provided Excel file into the MySQL database for the UN-Habitat application.

## Prerequisites

- Node.js (v16 or later)
- MySQL (v8 or later)
- The Excel file (`Application Development - Exam Data.xlsx`)

## Setup Steps

### 1. Configure Environment Variables

Make sure the `.env.local` file in the project root has the correct MySQL credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unhabitat
```

### 2. Prepare the Excel File

Place the `Application Development - Exam Data.xlsx` file in one of these locations:

- In the project's `public` directory
- In the project root directory
- At the absolute path mentioned in the script

### 3. Set Up the Database

Run the database setup script to create the database and tables:

```bash
node setup-database.js
```

This script will:

- Create the `unhabitat` database if it doesn't exist
- Create all required tables (projects, countries, themes, donors and junction tables)
- Insert sample data for testing

### 4. Import Excel Data

Run the Excel import script:

```bash
node import-excel-to-mysql.js
```

This script will:

- Read the Excel file and parse its contents
- Process each row, normalizing the data
- Insert data into the appropriate tables (projects, countries, themes, donors and junction tables)
- Log the progress and any errors that occur

## Troubleshooting

### Excel File Not Found

If you get an error that the Excel file is not found, make sure it's placed in one of the locations specified in the script or update the `possiblePaths` array in the script to include the correct location.

### Database Connection Issues

If you encounter database connection issues:

- Check that MySQL is running
- Verify that the credentials in the `.env.local` file are correct
- Ensure that the MySQL user has appropriate permissions

### Data Format Issues

If some data is not imported correctly:

- The script will log warnings for rows with missing required fields (ProjectID, ProjectTitle)
- Check the Excel column headers by examining the console output
- Adjust the column mappings in the script if they don't match your Excel file

## Data Validation

After importing, you can validate the data by querying the database:

```sql
USE unhabitat;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM project_countries;
SELECT COUNT(*) FROM project_themes;
SELECT COUNT(*) FROM project_donors;
```

You can also check for specific projects:

```sql
SELECT p.*, 
       GROUP_CONCAT(pc.CountryName) AS countries,
       GROUP_CONCAT(pt.ThemeName) AS themes,
       GROUP_CONCAT(pd.DonorName) AS donors
FROM projects p
LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
GROUP BY p.ProjectID
LIMIT 5;
```
