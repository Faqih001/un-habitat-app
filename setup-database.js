// setup-database.js - Script to set up the MySQL database
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configure __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

async function setupDatabase() {
  let connection;
  
  // MySQL-specific SQL statements for creating tables
  const sqlStatements = [
    `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'unhabitat'};`,
    `USE ${process.env.DB_NAME || 'unhabitat'};`,
    
    // Projects table
    `CREATE TABLE IF NOT EXISTS projects (
      ProjectID VARCHAR(50) PRIMARY KEY,
      ProjectTitle TEXT,
      PAASCode VARCHAR(50),
      ApprovalStatus VARCHAR(50),
      Fund VARCHAR(50),
      PAGValue DECIMAL(15,2),
      StartDate DATE,
      EndDate DATE,
      LeadOrgUnit VARCHAR(100),
      TotalExpenditure DECIMAL(15,2),
      TotalContribution DECIMAL(15,2),
      TotalPSC DECIMAL(15,2)
    );`,
    
    // Countries table
    `CREATE TABLE IF NOT EXISTS countries (
      CountryName VARCHAR(100) PRIMARY KEY
    );`,
    
    // Themes table
    `CREATE TABLE IF NOT EXISTS themes (
      ThemeName VARCHAR(100) PRIMARY KEY
    );`,
    
    // Donors table
    `CREATE TABLE IF NOT EXISTS donors (
      DonorName VARCHAR(200) PRIMARY KEY
    );`,
    
    // Junction tables
    `CREATE TABLE IF NOT EXISTS project_countries (
      ProjectID VARCHAR(50),
      CountryName VARCHAR(100),
      FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
      FOREIGN KEY (CountryName) REFERENCES countries(CountryName) ON DELETE CASCADE,
      PRIMARY KEY (ProjectID, CountryName)
    );`,
    
    `CREATE TABLE IF NOT EXISTS project_themes (
      ProjectID VARCHAR(50),
      ThemeName VARCHAR(100),
      FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
      FOREIGN KEY (ThemeName) REFERENCES themes(ThemeName) ON DELETE CASCADE,
      PRIMARY KEY (ProjectID, ThemeName)
    );`,
    
    `CREATE TABLE IF NOT EXISTS project_donors (
      ProjectID VARCHAR(50),
      DonorName VARCHAR(200),
      FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
      FOREIGN KEY (DonorName) REFERENCES donors(DonorName) ON DELETE CASCADE,
      PRIMARY KEY (ProjectID, DonorName)
    );`
  ];
  
  try {
    // First connect without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    console.log('Connected to MySQL server');
    
    // Execute each statement
    console.log('Executing SQL statements...');
    for (const statement of sqlStatements) {
      try {
        await connection.query(statement);
        console.log('Executed:', statement.substring(0, 50) + (statement.length > 50 ? '...' : ''));
      } catch (error) {
        console.error('Error executing statement:', statement);
        console.error('Error message:', error.message);
      }
    }
    
    console.log('Database setup completed successfully!');
    return true;
  } catch (error) {
    console.error('Database setup error:', error);
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// If this file is run directly, execute the setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

// Export the function for use in other scripts
export default setupDatabase;
