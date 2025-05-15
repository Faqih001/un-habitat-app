// routes/api/projects.js - Projects API routes
import express from 'express';
import { pool } from '../../db/index.js';

const router = express.Router();

// Get all projects (no pagination for the specific requirement)
router.get('/all', async (req, res) => {
  try {
    // If pagination parameters are provided, use paginated query
    if (req.query.page || req.query.limit) {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const offset = (page - 1) * limit;
      
      // Base query with pagination
      const [projects] = await pool.query(`
        SELECT 
          p.*,
          GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
          GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
          GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
        FROM projects p
        LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
        LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
        LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
        GROUP BY p.ProjectID
        LIMIT ? OFFSET ?
      `, [limit, offset]);
      
      // Count total projects for pagination
      const [count] = await pool.query('SELECT COUNT(*) as total FROM projects');
      
      return res.json({
        data: projects,
        pagination: {
          page,
          limit,
          totalItems: count[0].total,
          totalPages: Math.ceil(count[0].total / limit)
        }
      });
    } 
    
    // For the specified requirement, return all projects without pagination
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      GROUP BY p.ProjectID
    `);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get project details
    const [project] = await pool.query(`
      SELECT * FROM projects WHERE ProjectID = ?
    `, [id]);
    
    if (project.length === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    // Get related countries
    const [countries] = await pool.query(`
      SELECT CountryName FROM project_countries WHERE ProjectID = ?
    `, [id]);
    
    // Get related themes
    const [themes] = await pool.query(`
      SELECT ThemeName FROM project_themes WHERE ProjectID = ?
    `, [id]);
    
    // Get related donors
    const [donors] = await pool.query(`
      SELECT DonorName FROM project_donors WHERE ProjectID = ?
    `, [id]);
    
    // Combine all data
    const projectData = {
      ...project[0],
      countries: countries.map(c => c.CountryName),
      themes: themes.map(t => t.ThemeName),
      donors: donors.map(d => d.DonorName)
    };
    
    res.json(projectData);
  } catch (error) {
    console.error('Error getting project:', error.message);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
});

// Get projects by country (case insensitive search)
router.get('/country/:country', async (req, res) => {
  try {
    const { country } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      INNER JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      WHERE LOWER(pc.CountryName) = LOWER(?)
      GROUP BY p.ProjectID
    `, [country]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects by country:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Get projects by approval status (existing route with different name)
router.get('/status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      WHERE p.ApprovalStatus = ?
      GROUP BY p.ProjectID
    `, [status]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects by status:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Add new endpoint for "Approval Status" as specified in the requirements
router.get('/Approval-Status/:status', async (req, res) => {
  try {
    const { status } = req.params;
    
    const [projects] = await pool.query(`
      SELECT 
        p.*,
        GROUP_CONCAT(DISTINCT pc.CountryName SEPARATOR '; ') as Countries,
        GROUP_CONCAT(DISTINCT pt.ThemeName SEPARATOR '; ') as Themes,
        GROUP_CONCAT(DISTINCT pd.DonorName SEPARATOR '; ') as Donors
      FROM projects p
      LEFT JOIN project_countries pc ON p.ProjectID = pc.ProjectID
      LEFT JOIN project_themes pt ON p.ProjectID = pt.ProjectID
      LEFT JOIN project_donors pd ON p.ProjectID = pd.ProjectID
      WHERE LOWER(p.ApprovalStatus) = LOWER(?)
      GROUP BY p.ProjectID
    `, [status]);
    
    res.json(projects);
  } catch (error) {
    console.error('Error getting projects by approval status:', error.message);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
});

// Create new project
router.post('/', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const {
      ProjectID,
      ProjectTitle,
      PAASCode,
      ApprovalStatus,
      Fund,
      PAGValue,
      StartDate,
      EndDate,
      LeadOrgUnit,
      TotalExpenditure,
      TotalContribution,
      TotalPSC,
      countries,
      themes,
      donors
    } = req.body;
    
    // Validate required fields
    if (!ProjectTitle) {
      return res.status(400).json({ message: 'ProjectTitle is required' });
    }
    
    // Generate a unique ProjectID if not provided
    let actualProjectID = ProjectID;
    if (!actualProjectID) {
      // Get the maximum project ID number from the database to generate sequential ID
      const [maxResult] = await connection.query(`
        SELECT MAX(CAST(ProjectID AS UNSIGNED)) AS maxID FROM projects
        WHERE ProjectID REGEXP '^[0-9]+$'
      `);
      
      // Get the next number and use it as the project ID
      const nextID = (maxResult[0].maxID || 2620) + 1;
      actualProjectID = nextID.toString();
    }
    
    // Insert project
    await connection.query(`
      INSERT INTO projects (
        ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue,
        StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      actualProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue,
      StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC
    ]);
    
    // Insert countries
    if (countries && countries.length > 0) {
      for (const country of countries) {
        // Insert country if it doesn't exist
        await connection.query('INSERT IGNORE INTO countries (CountryName) VALUES (?)', [country]);
        // Link country to project
        await connection.query(
          'INSERT INTO project_countries (ProjectID, CountryName) VALUES (?, ?)',
          [actualProjectID, country]
        );
      }
    }
    
    // Insert themes
    if (themes && themes.length > 0) {
      for (const theme of themes) {
        // Insert theme if it doesn't exist
        await connection.query('INSERT IGNORE INTO themes (ThemeName) VALUES (?)', [theme]);
        // Link theme to project
        await connection.query(
          'INSERT INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)',
          [actualProjectID, theme]
        );
      }
    }
    
    // Insert donors
    if (donors && donors.length > 0) {
      for (const donor of donors) {
        // Insert donor if it doesn't exist
        await connection.query('INSERT IGNORE INTO donors (DonorName) VALUES (?)', [donor]);
        // Link donor to project
        await connection.query(
          'INSERT INTO project_donors (ProjectID, DonorName) VALUES (?, ?)',
          [actualProjectID, donor]
        );
      }
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Project created successfully', ProjectID: actualProjectID });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating project:', error.message);
    res.status(500).json({ message: 'Error creating project', error: error.message });
  } finally {
    connection.release();
  }
});

// Update project
router.put('/:id', async (req, res) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();
    
    const { id } = req.params;
    const {
      ProjectTitle,
      PAASCode,
      ApprovalStatus,
      Fund,
      PAGValue,
      StartDate,
      EndDate,
      LeadOrgUnit,
      TotalExpenditure,
      TotalContribution,
      TotalPSC,
      countries,
      themes,
      donors
    } = req.body;
    
    // Update project
    await connection.query(`
      UPDATE projects SET
        ProjectTitle = IFNULL(?, ProjectTitle),
        PAASCode = IFNULL(?, PAASCode),
        ApprovalStatus = IFNULL(?, ApprovalStatus),
        Fund = IFNULL(?, Fund),
        PAGValue = IFNULL(?, PAGValue),
        StartDate = IFNULL(?, StartDate),
        EndDate = IFNULL(?, EndDate),
        LeadOrgUnit = IFNULL(?, LeadOrgUnit),
        TotalExpenditure = IFNULL(?, TotalExpenditure),
        TotalContribution = IFNULL(?, TotalContribution),
        TotalPSC = IFNULL(?, TotalPSC)
      WHERE ProjectID = ?
    `, [
      ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue,
      StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC,
      id
    ]);
    
    // Update countries if provided
    if (countries) {
      // Delete existing relationships
      await connection.query('DELETE FROM project_countries WHERE ProjectID = ?', [id]);
      
      // Insert new countries
      for (const country of countries) {
        // Insert country if it doesn't exist
        await connection.query('INSERT IGNORE INTO countries (CountryName) VALUES (?)', [country]);
        // Link country to project
        await connection.query(
          'INSERT INTO project_countries (ProjectID, CountryName) VALUES (?, ?)',
          [id, country]
        );
      }
    }
    
    // Update themes if provided
    if (themes) {
      // Delete existing relationships
      await connection.query('DELETE FROM project_themes WHERE ProjectID = ?', [id]);
      
      // Insert new themes
      for (const theme of themes) {
        // Insert theme if it doesn't exist
        await connection.query('INSERT IGNORE INTO themes (ThemeName) VALUES (?)', [theme]);
        // Link theme to project
        await connection.query(
          'INSERT INTO project_themes (ProjectID, ThemeName) VALUES (?, ?)',
          [id, theme]
        );
      }
    }
    
    // Update donors if provided
    if (donors) {
      // Delete existing relationships
      await connection.query('DELETE FROM project_donors WHERE ProjectID = ?', [id]);
      
      // Insert new donors
      for (const donor of donors) {
        // Insert donor if it doesn't exist
        await connection.query('INSERT IGNORE INTO donors (DonorName) VALUES (?)', [donor]);
        // Link donor to project
        await connection.query(
          'INSERT INTO project_donors (ProjectID, DonorName) VALUES (?, ?)',
          [id, donor]
        );
      }
    }
    
    await connection.commit();
    res.json({ message: 'Project updated successfully', ProjectID: id });
  } catch (error) {
    await connection.rollback();
    console.error('Error updating project:', error.message);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  } finally {
    connection.release();
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Delete the project (cascade will handle related records)
    const [result] = await pool.query('DELETE FROM projects WHERE ProjectID = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    res.json({ message: 'Project deleted successfully', ProjectID: id });
  } catch (error) {
    console.error('Error deleting project:', error.message);
    res.status(500).json({ message: 'Error deleting project', error: error.message });
  }
});

export default router;
