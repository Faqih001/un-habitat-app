// routes/api/donors.js - Donors API routes
import express from 'express';
import { pool } from '../../db/index.js';

const router = express.Router();

// Get all donors
router.get('/', async (req, res) => {
  try {
    const [donors] = await pool.query(`
      SELECT d.DonorName, COUNT(pd.ProjectID) as ProjectCount
      FROM donors d
      LEFT JOIN project_donors pd ON d.DonorName = pd.DonorName
      GROUP BY d.DonorName
      ORDER BY d.DonorName
    `);
    
    res.json(donors);
  } catch (error) {
    console.error('Error getting donors:', error.message);
    res.status(500).json({ message: 'Error fetching donors', error: error.message });
  }
});

// Get projects for a specific donor
router.get('/:name/projects', async (req, res) => {
  try {
    const { name } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes
      FROM projects p
      INNER JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      WHERE pd.DonorName = ?
      GROUP BY p.ProjectID
    `, [name]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects for donor:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

export default router;
