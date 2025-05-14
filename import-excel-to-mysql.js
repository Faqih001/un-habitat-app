const XLSX = require('xlsx');
const mysql = require('mysql2/promise');
const path = require('path');
const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

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
    const excelEpoch = new Date(1899, 11, 30); // Excel's epoch (Dec 30, 1899)
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
      path.join(__dirname, 'public', 'Application Development - Exam Data.xlsx'),
      path.join(__dirname, 'Application Development - Exam Data.xlsx'),
      '/home/amirul/Desktop/Interviews/UN-Habitat PLGS Information Technology Test/un_habitat_app/un-habitat-app/public/Application Development - Exam Data.xlsx'
    ];

    let filePath;
    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        filePath = p;
        break;
      }
    }

    if (!filePath) {
      throw new Error(`Excel file not found in any of the possible paths: ${possiblePaths.join(', ')}`);
    }

    console.log(`Reading Excel file from: ${filePath}`);
    
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);

    console.log(`Found ${data.length} rows in Excel file`);
    
    // Log the first row to verify column names
    if (data.length > 0) {
      console.log('Excel column headers:', Object.keys(data[0]));
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
      // Map Excel columns to database fields (adjust column names as per your Excel file)
      const project = {
        ProjectID: row['ProjectID']?.toString() || '',
        ProjectTitle: row['Project Title'] || '',
        PAASCode: row['PAAS Code'] || '',
        ApprovalStatus: row['Approval Status'] || '',
        Fund: row['Fund'] || '',
        PAGValue: parseFloat(row['PAG Value']) || 0,
        StartDate: parseDate(row['Start Date']),
        EndDate: parseDate(row['End Date']),
        LeadOrgUnit: row['Lead Org Unit'] || '',
        TotalExpenditure: parseFloat(row['Total Expenditure']) || 0,
        TotalContribution: parseFloat(row['Total Contribution']) || 0,
        TotalPSC: parseFloat(row['Total PSC']) || 0,
        countries: splitMultiValue(row['Country(ies)']),
        themes: splitMultiValue(row['Theme(s)']),
        donors: splitMultiValue(row['Donor(s)'])
      };

      // Skip invalid rows
      if (!project.ProjectID || !project.ProjectTitle) {
        console.warn(`Skipping row with missing ProjectID or ProjectTitle: ${JSON.stringify(row)}`);
        continue;
      }

      console.log(`Processing project: ${project.ProjectID} - ${project.ProjectTitle}`);

      // Insert into projects table
      try {
        await connection.execute(
          `INSERT IGNORE INTO projects (ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            project.ProjectID,
            project.ProjectTitle,
            project.PAASCode,
            project.ApprovalStatus,
            project.Fund,
            project.PAGValue,
            project.StartDate,
            project.EndDate,
            project.LeadOrgUnit,
            project.TotalExpenditure,
            project.TotalContribution,
            project.TotalPSC
          ]
        );

        // Insert countries
        for (const country of project.countries) {
          await connection.execute(`INSERT IGNORE INTO countries (CountryName) VALUES (?)`, [country]);
          await connection.execute(`INSERT IGNORE INTO project_countries (ProjectID, CountryName) VALUES (?, ?)`, [project.ProjectID, country]);
        }

        // Insert themes
        for (const theme of project.themes) {
          await connection.execute(`INSERT IGNORE INTO themes (ThemeName) VALUES (?)`, [theme]);
          await connection.execute(`INSERT IGNORE INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)`, [project.ProjectID, theme]);
        }

        // Insert donors
        for (const donor of project.donors) {
          await connection.execute(`INSERT IGNORE INTO donors (DonorName) VALUES (?)`, [donor]);
          await connection.execute(`INSERT IGNORE INTO project_donors (ProjectID, DonorName) VALUES (?, ?)`, [project.ProjectID, donor]);
        }
      } catch (err) {
        console.error(`Error inserting project ${project.ProjectID}:`, err.message);
      }
    }

    // Commit transaction
    await connection.commit();
    console.log('Data imported successfully!');
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    if (connection) {
      try {
        await connection.rollback();
        console.log('Transaction rolled back');
      } catch (rollbackError) {
        console.error('Error rolling back transaction:', rollbackError);
      }
    }
    return false;
  } finally {
    if (connection) {
      try {
        await connection.end();
        console.log('Database connection closed');
      } catch (disconnectError) {
        console.error('Error closing database connection:', disconnectError);
      }
    }
  }
}

// If this file is run directly, execute the import
if (require.main === module) {
  importExcelToMySQL();
}

// Export the function for use in other scripts
module.exports = importExcelToMySQL; 