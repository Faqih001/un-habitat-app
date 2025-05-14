const fs = require('fs');
const path = require('path');

// Path to the Excel file specified by the user
const sourceExcelPath = '/home/amirul/Desktop/Interviews/UN-Habitat PLGS Information Technology Test/un_habitat_app/un-habitat-app/public/Application Development - Exam Data.xlsx';

// Destination paths
const projectRoot = __dirname;
const publicDir = path.join(projectRoot, 'public');
const targetPathInPublic = path.join(publicDir, 'Application Development - Exam Data.xlsx');
const targetPathInRoot = path.join(projectRoot, 'Application Development - Exam Data.xlsx');

// Main function
async function setupExcelFile() {
  try {
    console.log('Setting up Excel file for import...');
    
    // Check if source file exists
    if (!fs.existsSync(sourceExcelPath)) {
      console.error(`Source Excel file not found at: ${sourceExcelPath}`);
      console.log('Please update the sourceExcelPath in setup-excel-file.js to point to your Excel file.');
      return;
    }
    
    console.log(`Found source Excel file at: ${sourceExcelPath}`);
    
    // Create public directory if it doesn't exist
    if (!fs.existsSync(publicDir)) {
      console.log('Creating public directory...');
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Copy to public directory
    console.log(`Copying Excel file to public directory: ${targetPathInPublic}`);
    fs.copyFileSync(sourceExcelPath, targetPathInPublic);
    
    // Copy to project root
    console.log(`Copying Excel file to project root: ${targetPathInRoot}`);
    fs.copyFileSync(sourceExcelPath, targetPathInRoot);
    
    console.log('Excel file setup completed successfully!');
    console.log('\nYou can now run the data import scripts:');
    console.log('- One-step setup and import: node setup-and-import.js');
    console.log('- Manual setup: node setup-database.js && node import-excel-to-mysql.js');
  } catch (error) {
    console.error('Error setting up Excel file:', error);
  }
}

// Run the function
setupExcelFile(); 