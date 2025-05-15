// test-db-connection.js - Test script for database connection
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function testConnection() {
  const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unhabitat',
  };

  console.log('Attempting to connect to database with config:', JSON.stringify({
    host: dbConfig.host,
    user: dbConfig.user,
    database: dbConfig.database
  }));

  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log('Connection established!');
    
    // Test a simple query
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM projects');
    console.log(`Projects in database: ${rows[0].count}`);
    
    await connection.end();
    console.log('Connection closed.');
  } catch (error) {
    console.error('Error connecting to database:', error.message);
  }
}

testConnection();
