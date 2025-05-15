// routes/api/countries.js - Countries API routes
import express from 'express';
import { pool } from '../../db/index.js';

const router = express.Router();

// Get all countries
router.get('/', async (req, res) => {
  try {
    const [countries] = await pool.query(`
      SELECT c.CountryName, COUNT(pc.ProjectID) as ProjectCount
      FROM countries c
      LEFT JOIN project_countries pc ON c.CountryName = pc.CountryName
      GROUP BY c.CountryName
      ORDER BY c.CountryName
    `);
    
    res.json(countries);
  } catch (error) {
    console.error('Error getting countries:', error.message);
    res.status(500).json({ message: 'Error fetching countries', error: error.message });
  }
});

// Get projects for a specific country
router.get('/:name/projects', async (req, res) => {
  try {
    const { name } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      INNER JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      WHERE pc.CountryName = ?
      GROUP BY p.ProjectID
    `, [name]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects for country:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

export default router;
