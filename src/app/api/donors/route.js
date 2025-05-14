import mysql from 'mysql2/promise';

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unhabitat'
  });
}

export async function GET() {
  try {
    const connection = await getConnection();
    const [rows] = await connection.execute('SELECT DonorName FROM donors');
    await connection.end();
    return new Response(JSON.stringify(rows.map(row => row.DonorName)), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 