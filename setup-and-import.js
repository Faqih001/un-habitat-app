// setup-and-import.js - Combined script to set up DB and import data
import setupDatabase from './setup-database.js';
import importExcelToMySQL from './import-excel-to-mysql.js';

async function run() {
  console.log('=== STEP 1: Setting up the database ===');
  const setupSuccess = await setupDatabase();
  
  if (setupSuccess) {
    console.log('\n=== STEP 2: Importing data from Excel ===');
    const importSuccess = await importExcelToMySQL();
    
    if (importSuccess) {
      console.log('\n=== SUCCESS: Database setup and data import completed successfully ===');
    } else {
      console.error('\n=== ERROR: Data import failed ===');
    }
  } else {
    console.error('\n=== ERROR: Database setup failed ===');
  }
}

run();
