import mysql from 'mysql2/promise';

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unhabitat'
  });
}

export async function POST(request) {
  const { ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC, countries, themes, donors } = await request.json();
  try {
    const connection = await getConnection();
    await connection.beginTransaction();
    await connection.execute(
      `INSERT INTO projects (ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC]
    );
    for (const country of countries) {
      await connection.execute(`INSERT IGNORE INTO countries (CountryName) VALUES (?)`, [country]);
      await connection.execute(`INSERT INTO project_countries (ProjectID, CountryName) VALUES (?, ?)`, [ProjectID, country]);
    }
    for (const theme of themes) {
      await connection.execute(`INSERT IGNORE INTO themes (ThemeName) VALUES (?)`, [theme]);
      await connection.execute(`INSERT INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)`, [ProjectID, theme]);
    }
    for (const donor of donors) {
      await connection.execute(`INSERT IGNORE INTO donors (DonorName) VALUES (?)`, [donor]);
      await connection.execute(`INSERT INTO project_donors (ProjectID, DonorName) VALUES (?, ?)`, [ProjectID, donor]);
    }
    await connection.commit();
    await connection.end();
    return new Response(JSON.stringify({ ProjectID, ...await request.json() }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 