# UN-Habitat Web Developer Intern Assessment (Next.js & MySQL)

This repository contains the solution for the UN-Habitat Web Developer Intern Practical Assessment, built with Next.js and MySQL.

## Project Structure

- `app/page.jsx`: Main page with project list, CRUD operations, and project view.
- `app/dashboard/page.jsx`: Dashboard with visualizations using Recharts.
- `app/api/*`: API routes for projects, countries, themes, and donors.
- `init-db.sql`: MS SQL Server compatible script to initialize the database with normalized tables and sample data.
- `mysql-init-db.sql`: MySQL specific script to initialize the database with normalized tables and sample data.
- `setup-db-cli.js`: Interactive CLI tool to set up either MySQL or MS SQL Server databases.
- `setup-and-import.js`: Combined script to set up database and import Excel data.
- `import-excel-to-mysql.js`: Script to import data from Excel into MySQL.
- `setup-database.js`: Script to create database tables from SQL script.
- `setup-excel-file.js`: Script to prepare the Excel file for import.

## Setup Instructions

### Prerequisites

- Node.js (v16 or later)
- MySQL (v8 or later) and/or MS SQL Server
- Git

### Clone the Repository

```bash
git clone https://github.com/yourusername/unhabitat-assessment-nextjs.git
cd unhabitat-assessment-nextjs
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unhabitat
```

### Set Up the Database and Import Data

You have several options to set up the database and import the Excel data:

#### Using the interactive CLI tool (recommended)

```bash
# Run the interactive database setup CLI
npm run db-setup

# This will guide you through:
# - Choosing between MySQL and MS SQL Server
# - Setting up the database structure
# - Optionally importing Excel data (for MySQL)
```

#### Using npm scripts

```bash
# Prepare the Excel file for import
npm run setup-excel

# One-step setup and import
npm run setup-all

# Or step-by-step:
npm run setup-db     # Set up database structure
npm run import-excel # Import Excel data
```

#### Using Node.js directly

```bash
# One-step setup and import
node setup-and-import.js

# Or step-by-step:
node setup-database.js
node import-excel-to-mysql.js
```

#### Using raw SQL

```bash
mysql -u root -p unhabitat < init-db.sql
```

For more detailed instructions, see:

- `IMPORT_GUIDE.md` - Brief guide for Excel data import
- `EXCEL_IMPORT_SETUP.md` - Comprehensive guide for setting up the Excel import process

### Run the Application

```bash
npm run dev
```

Access the application at [`http://localhost:3000`](http://localhost:3000).

## Accessing the Application

- **Project List**: View, add, edit, or delete projects with pagination ([`http://localhost:3000`](http://localhost:3000)).
- **Dashboard**: Visualize projects by country, lead org unit, and themes ([`http://localhost:3000/dashboard`](http://localhost:3000/dashboard)).
- **API Endpoints**:
  - GET `/api/projects/all`: List all projects.
  - GET `/api/projects/country/[country]`: Filter by country (e.g., `/api/projects/country/Kenya`).
  - GET `/api/projects/approvalStatus/[status]`: Filter by approval status (e.g., `/api/projects/approvalStatus/Approved`).
  - POST `/api/projects`: Create a new project.
  - PUT `/api/projects/[id]`: Update a project.
  - DELETE `/api/projects/[id]`: Delete a project.

## Notes

- **Data Normalization**: The Excel data is normalized into seven tables to handle many-to-many relationships (projects, countries, themes, donors, project_countries, project_themes, project_donors).
- **CRUD Interface**: Implemented for the projects table with a user-friendly interface.
- **Pagination**: Supports 5, 10, 20, 50, or all rows per page with a clear pager.
- **API**: Provides JSON endpoints as specified, with filtering capabilities.
- **Dashboard**: Displays bar charts for top 10 countries, lead org units, and themes, with an interesting fact about the country with the most projects.
- **Data Import**: The application includes scripts to import data from the provided Excel file.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [`http://localhost:3000`](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
