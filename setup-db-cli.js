#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const readline = require('readline');

// Create a readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Get command line arguments
const args = process.argv.slice(2);
let dbType = args[0] ? args[0].toLowerCase() : null;

// Main function
async function main() {
  console.log('UN-Habitat Database Setup Utility');
  console.log('================================\n');
  
  // If no database type is specified, prompt for it
  if (!dbType) {
    console.log('Which database type would you like to use?');
    console.log('1. MySQL (Recommended for Node.js scripts)');
    console.log('2. MS SQL Server');
    
    await new Promise((resolve) => {
      rl.question('Enter your choice (1/2): ', (answer) => {
        dbType = answer.trim() === '2' ? 'mssql' : 'mysql';
        resolve();
      });
    });
  }
  
  console.log(`\nSetting up database for ${dbType === 'mssql' ? 'MS SQL Server' : 'MySQL'}...\n`);
  
  // Update SQL file path based on database type
  const sqlFilePath = dbType === 'mssql' 
    ? path.join(__dirname, 'init-db.sql')  // MS SQL Server compatible file
    : path.join(__dirname, 'mysql-init-db.sql');  // MySQL specific file
  
  // Verify the SQL file exists
  if (!fs.existsSync(sqlFilePath)) {
    console.error(`Error: SQL file not found at ${sqlFilePath}`);
    rl.close();
    return;
  }
  
  if (dbType === 'mysql') {
    // Run the MySQL setup script
    const setupScript = path.join(__dirname, 'setup-database.js');
    if (!fs.existsSync(setupScript)) {
      console.error(`Error: Setup script not found at ${setupScript}`);
      rl.close();
      return;
    }
    
    console.log('Running MySQL setup script...');
    const child = spawn('node', [setupScript], { stdio: 'inherit' });
    
    await new Promise((resolve, reject) => {
      child.on('close', (code) => {
        if (code === 0) {
          console.log('\nMySQL database setup completed successfully!');
          resolve();
        } else {
          console.error(`\nMySQL database setup failed with code ${code}`);
          reject();
        }
      });
      
      child.on('error', (err) => {
        console.error('Failed to run MySQL setup script:', err);
        reject(err);
      });
    }).catch(() => {});
    
  } else {
    // For MS SQL Server, provide instructions
    console.log('MS SQL Server Setup Instructions:');
    console.log('-------------------------------');
    console.log('1. Open SQL Server Management Studio (SSMS)');
    console.log('2. Connect to your SQL Server instance');
    console.log(`3. Open the SQL file at: ${sqlFilePath}`);
    console.log('4. Execute the script to create the database and tables');
    console.log('\nNote: The script is already formatted for MS SQL Server compatibility.');
  }
  
  // Ask if user wants to import Excel data (only for MySQL)
  if (dbType === 'mysql') {
    await new Promise((resolve) => {
      rl.question('\nWould you like to import data from the Excel file? (y/n): ', async (answer) => {
        if (answer.trim().toLowerCase() === 'y') {
          const importScript = path.join(__dirname, 'import-excel-to-mysql.js');
          if (!fs.existsSync(importScript)) {
            console.error(`Error: Import script not found at ${importScript}`);
            resolve();
            return;
          }
          
          console.log('\nRunning Excel import script...');
          const importChild = spawn('node', [importScript], { stdio: 'inherit' });
          
          await new Promise((resolveImport) => {
            importChild.on('close', (code) => {
              if (code === 0) {
                console.log('\nExcel data import completed successfully!');
              } else {
                console.error(`\nExcel data import failed with code ${code}`);
              }
              resolveImport();
            });
            
            importChild.on('error', (err) => {
              console.error('Failed to run import script:', err);
              resolveImport();
            });
          });
        } else {
          console.log('Skipping Excel data import.');
        }
        resolve();
      });
    });
  }
  
  console.log('\nSetup process completed!');
  console.log('To run the application, use: npm run dev');
  
  rl.close();
}

// Run the main function
main().catch(err => {
  console.error('Error:', err);
  rl.close();
  process.exit(1);
}); 