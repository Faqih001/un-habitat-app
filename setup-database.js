const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

async function setupDatabase() {
  let connection;
  
  // Read the SQL script - use the MySQL-specific file
  const sqlFilePath = path.join(__dirname, 'mysql-init-db.sql');
  const sql = fs.readFileSync(sqlFilePath, 'utf8');
  
  // Split SQL into individual statements
  const statements = sql
    .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '') // Remove comments
    .split(';')
    .filter(statement => statement.trim().length > 0);
  
  try {
    // First connect without database selected
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });
    
    // Create database if it doesn't exist
    console.log('Creating database if it doesn\'t exist...');
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'unhabitat'}`);
    
    // Use the database
    console.log(`Using database ${process.env.DB_NAME || 'unhabitat'}...`);
    await connection.query(`USE ${process.env.DB_NAME || 'unhabitat'}`);
    
    // Execute each statement
    console.log('Executing SQL statements...');
    for (const statement of statements) {
      if (statement.trim().length > 0) {
        try {
          await connection.query(statement);
          console.log('Executed:', statement.substring(0, 50) + (statement.length > 50 ? '...' : ''));
        } catch (error) {
          console.error('Error executing statement:', statement);
          console.error('Error message:', error.message);
        }
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
if (require.main === module) {
  setupDatabase();
}

// Export the function for use in other scripts
module.exports = setupDatabase; 