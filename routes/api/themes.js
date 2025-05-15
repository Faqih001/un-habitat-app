// routes/api/themes.js - Themes API routes
import express from 'express';
import { pool } from '../../db/index.js';

const router = express.Router();

// Get all themes
router.get('/', async (req, res) => {
  try {
    const [themes] = await pool.query(`
      SELECT t.ThemeName, COUNT(pt.ProjectID) as ProjectCount
      FROM themes t
      LEFT JOIN project_themes pt ON t.ThemeName = pt.ThemeName
      GROUP BY t.ThemeName
      ORDER BY t.ThemeName
    `);
    
    res.json(themes);
  } catch (error) {
    console.error('Error getting themes:', error.message);
    res.status(500).json({ message: 'Error fetching themes', error: error.message });
  }
});

// Get projects for a specific theme
router.get('/:name/projects', async (req, res) => {
  try {
    const { name } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      INNER JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      WHERE pt.ThemeName = ?
      GROUP BY p.ProjectID
    `, [name]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects for theme:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

export default router;
