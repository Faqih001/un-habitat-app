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
    const [rows] = await connection.execute(`
      SELECT p.*, 
             GROUP_CONCAT(pc.CountryName) AS countries,
             GROUP_CONCAT(pt.ThemeName) AS themes,
             GROUP_CONCAT(pd.DonorName) AS donors
      FROM projects p
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      GROUP BY p.ProjectID
    `);
    await connection.end();
    const projects = rows.map(row => ({
      ...row,
      countries: row.countries ? row.countries.split(',') : [],
      themes: row.themes ? row.themes.split(',') : [],
      donors: row.donors ? row.donors.split(',') : []
    }));
    return new Response(JSON.stringify(projects), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 