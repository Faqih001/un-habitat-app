import mysql from 'mysql2/promise';

async function getConnection() {
  return await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'unhabitat'
  });
}

export async function GET(request, { params }) {
  const { id } = params;
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
      WHERE p.ProjectID = ?
      GROUP BY p.ProjectID
    `, [id]);
    await connection.end();
    const project = rows[0] ? {
      ...rows[0],
      countries: rows[0].countries ? rows[0].countries.split(',') : [],
      themes: rows[0].themes ? rows[0].themes.split(',') : [],
      donors: rows[0].donors ? rows[0].donors.split(',') : []
    } : null;
    return new Response(JSON.stringify(project), { status: project ? 200 : 404, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function PUT(request, { params }) {
  const { id } = params;
  const { ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC, countries, themes, donors } = await request.json();
  try {
    const connection = await getConnection();
    await connection.beginTransaction();
    await connection.execute(
      `UPDATE projects SET ProjectTitle = ?, PAASCode = ?, ApprovalStatus = ?, Fund = ?, PAGValue = ?, StartDate = ?, EndDate = ?, LeadOrgUnit = ?, TotalExpenditure = ?, TotalContribution = ?, TotalPSC = ? WHERE ProjectID = ?`,
      [ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC, id]
    );
    await connection.execute(`DELETE FROM project_countries WHERE ProjectID = ?`, [id]);
    await connection.execute(`DELETE FROM project_themes WHERE ProjectID = ?`, [id]);
    await connection.execute(`DELETE FROM project_donors WHERE ProjectID = ?`, [id]);
    for (const country of countries) {
      await connection.execute(`INSERT IGNORE INTO countries (CountryName) VALUES (?)`, [country]);
      await connection.execute(`INSERT INTO project_countries (ProjectID, CountryName) VALUES (?, ?)`, [id, country]);
    }
    for (const theme of themes) {
      await connection.execute(`INSERT IGNORE INTO themes (ThemeName) VALUES (?)`, [theme]);
      await connection.execute(`INSERT INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)`, [id, theme]);
    }
    for (const donor of donors) {
      await connection.execute(`INSERT IGNORE INTO donors (DonorName) VALUES (?)`, [donor]);
      await connection.execute(`INSERT INTO project_donors (ProjectID, DonorName) VALUES (?, ?)`, [id, donor]);
    }
    await connection.commit();
    await connection.end();
    return new Response(JSON.stringify({ ProjectID: id, ...await request.json() }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    const connection = await getConnection();
    await connection.beginTransaction();
    await connection.execute(`DELETE FROM project_countries WHERE ProjectID = ?`, [id]);
    await connection.execute(`DELETE FROM project_themes WHERE ProjectID = ?`, [id]);
    await connection.execute(`DELETE FROM project_donors WHERE ProjectID = ?`, [id]);
    await connection.execute(`DELETE FROM projects WHERE ProjectID = ?`, [id]);
    await connection.commit();
    await connection.end();
    return new Response(JSON.stringify({ message: 'Project deleted' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
} 