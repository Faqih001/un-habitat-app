// import-excel-to-mysql.js - Script to import Excel data to MySQL
import XLSX from 'xlsx';
import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Configure __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: '.env.local' });

// Database connection configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'unhabitat'
};

// Helper function to parse dates
const parseDate = (date) => {
  if (!date) return null;
  // Handle Excel date formats (e.g., "1-Jan-11" or numeric serial dates)
  if (typeof date === 'number') {
    const excelEpoch = new Date(1899, 11, 30);
    return new Date(excelEpoch.getTime() + date * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  }
  const parsed = new Date(date);
  return isNaN(parsed) ? null : parsed.toISOString().split('T')[0];
};

// Helper function to clean and split multi-valued fields
const splitMultiValue = (value, delimiter = ';') => {
  if (!value) return [];
  return value.split(delimiter).map(item => item.trim()).filter(item => item);
};

async function importExcelToMySQL() {
  let connection;
  try {
    // Try different paths for the Excel file
    const possiblePaths = [
      path.join(__dirname, 'public', 'Application Development - Exam Data.xlsx')
    ];

    let filePath;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      throw new Error('Excel file not found in any of the expected locations');
    }

    console.log(`Reading Excel file from: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${data.length} rows in Excel file`);
    
    // Log the first row to verify column names
    if (data.length > 0) {
      console.log('First row column names:', Object.keys(data[0]));
    }

    // Connect to MySQL
    console.log('Connecting to MySQL database with config:', JSON.stringify({
      host: dbConfig.host,
      user: dbConfig.user,
      database: dbConfig.database
    }));
    
    connection = await mysql.createConnection(dbConfig);
    await connection.beginTransaction();

    console.log('Importing data into MySQL...');

    // Process each row
    for (const row of data) {
      // Skip rows without ProjectID
      if (!row.ProjectID) {
        console.warn('Skipping row without ProjectID:', row);
        continue;
      }

      try {
        // Insert project data
        const projectData = {
          ProjectID: row.ProjectID,
          ProjectTitle: row["Project Title"] || null,
          PAASCode: row["PAAS Code"] || null,
          ApprovalStatus: row["Approval Status"] || null,
          Fund: row.Fund || null,
          PAGValue: row["PAG Value"] || null,
          StartDate: parseDate(row["Start Date"]) || null,
          EndDate: parseDate(row["End Date"]) || null,
          LeadOrgUnit: row["Lead Org Unit"] || null,
          TotalExpenditure: row["Total Expenditure"] || null,
          TotalContribution: row["Total Contribution"] || null,
          TotalPSC: row["Total PSC"] || null
        };

        // Insert project
        await connection.query(
          'INSERT INTO projects SET ? ON DUPLICATE KEY UPDATE ?',
          [projectData, projectData]
        );
        
        // Process countries
        if (row["Country(ies)"]) {
          const countries = splitMultiValue(row["Country(ies)"]);
          for (const country of countries) {
            // Insert country if it doesn't exist
            await connection.query(
              'INSERT IGNORE INTO countries (CountryName) VALUES (?)',
              [country]
            );
            
            // Insert project-country relationship
            await connection.query(
              'INSERT IGNORE INTO project_countries (ProjectID, CountryName) VALUES (?, ?)',
              [row.ProjectID, country]
            );
          }
        }
        
        // Process themes
        if (row["Theme(s)"]) {
          const themes = splitMultiValue(row["Theme(s)"]);
          for (const theme of themes) {
            // Insert theme if it doesn't exist
            await connection.query(
              'INSERT IGNORE INTO themes (ThemeName) VALUES (?)',
              [theme]
            );
            
            // Insert project-theme relationship
            await connection.query(
              'INSERT IGNORE INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)',
              [row.ProjectID, theme]
            );
          }
        }
        
        // Process donors
        if (row["Donor(s)"]) {
          const donors = splitMultiValue(row["Donor(s)"]);
          for (const donor of donors) {
            // Insert donor if it doesn't exist
            await connection.query(
              'INSERT IGNORE INTO donors (DonorName) VALUES (?)',
              [donor]
            );
            
            // Insert project-donor relationship
            await connection.query(
              'INSERT IGNORE INTO project_donors (ProjectID, DonorName) VALUES (?, ?)',
              [row.ProjectID, donor]
            );
          }
        }
        
        console.log(`Imported project: ${row.ProjectID} - ${row["Project Title"]?.substring(0, 30)}...`);
      } catch (error) {
        console.error(`Error importing project ${row.ProjectID}:`, error.message);
      }
    }

    // Commit transaction
    await connection.commit();
    console.log('Data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error during import:', error);
    if (connection) {
      await connection.rollback();
      console.log('Transaction rolled back due to error');
    }
    return false;
  } finally {
    if (connection) {
      await connection.end();
      console.log('Database connection closed');
    }
  }
}

// If this file is run directly, execute the import
if (import.meta.url === `file://${process.argv[1]}`) {
  importExcelToMySQL();
}

// Export the function for use in other scripts
export default importExcelToMySQL;
