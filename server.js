// server.js - Main Express server file
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { dirname } from 'path';

// Configure __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Import routes (using dynamic imports)
import projectRoutes from './routes/api/projects.js';
import countryRoutes from './routes/api/countries.js';
import themeRoutes from './routes/api/themes.js';
import donorRoutes from './routes/api/donors.js';

// Initialize express
const app = express();

// Middleware
app.use(helmet({ contentSecurityPolicy: false })); // Security headers
app.use(cors()); // Enable CORS for all origins
app.use(morgan('dev')); // HTTP request logger
app.use(express.json()); // Parse JSON bodies

// Define base API routes
app.use('/api/projects', projectRoutes);
app.use('/api/countries', countryRoutes);
app.use('/api/themes', themeRoutes);
app.use('/api/donors', donorRoutes);

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('dist'));
  
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

// Define port
const PORT = process.env.PORT || 3001;

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;
