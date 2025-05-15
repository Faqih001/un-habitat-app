# UN-Habitat Project Management Dashboard

![UN-Habitat Logo](https://unhabitat.org/sites/default/files/2020/06/un-habitat-logo-oct2019.png)

A full-stack application for managing and visualizing UN-Habitat projects, built with React, Vite, TypeScript, Express, and MySQL. This comprehensive dashboard provides tools for project management, data visualization, and analysis of UN-Habitat initiatives around the world.

## Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Running the Application](#running-the-application)
- [Data Management](#data-management)
- [API Documentation](#api-documentation)
- [Project Highlights](#project-highlights)
- [Future Enhancements](#future-enhancements)

## Features

- **Interactive Dashboard**
  - Visual analytics with charts and graphs for project distribution
  - Statistics by country, theme, and organizational unit
  - Summary metrics for project counts, budgets, and statuses
  
- **Comprehensive Project Management**
  - Full CRUD operations (Create, Read, Update, Delete)
  - Filtering by approval status, country, and search terms
  - Detailed project views with all associated information
  
- **Data Visualization**
  - Bar charts for geographic and organizational distribution
  - Pie charts for thematic analysis
  - Interactive legends and tooltips for enhanced data exploration
  
- **Robust Backend System**
  - RESTful API architecture
  - Relational database design with proper normalization
  - Automatic data import from Excel sources
  
- **Responsive UI**
  - Mobile-friendly interface using modern design principles
  - Consistent styling across all components
  - Accessible UI elements following best practices

## Technology Stack

### Frontend
- **React 18+**: Modern component-based UI library
- **TypeScript**: Type-safe JavaScript superset
- **Vite**: Next-generation frontend tooling
- **Recharts**: Composable charting library for React
- **TanStack Query**: Data fetching and caching library
- **Shadcn UI**: Beautifully designed components built with Radix UI
- **Tailwind CSS**: Utility-first CSS framework

### Backend
- **Node.js**: JavaScript runtime
- **Express**: Web framework for Node.js
- **MySQL**: Relational database
- **mysql2**: Modern MySQL client for Node.js
- **XLSX**: Library for parsing Excel files

### Development Tools
- **ESLint**: Code linting
- **Concurrently**: Run multiple commands concurrently
- **Nodemon**: Monitor for changes and restart server

## Project Structure

```
un-habitat-app/
├── db/                        # Database connection module
├── public/                    # Public assets and Excel data file
├── routes/                    # Backend API routes
│   └── api/                   # API endpoints
│       ├── countries.js
│       ├── donors.js
│       ├── projects.js
│       └── themes.js
├── src/                       # Frontend source code
│   ├── components/            # React components
│   │   ├── Dashboard/         # Dashboard-related components
│   │   ├── Layout/            # Layout components
│   │   ├── Projects/          # Project management components
│   │   └── ui/                # UI components (Shadcn)
│   ├── hooks/                 # Custom React hooks
│   ├── lib/                   # Utility functions
│   ├── pages/                 # Page components
│   └── services/              # API service layer
├── .env.local                 # Environment variables
├── import-excel-to-mysql.js   # Data import script
├── package.json               # Project dependencies
├── server.js                  # Express server entry point
├── setup-database.js          # Database setup script
├── setup-server.sh            # Server setup shell script
├── start-app.sh               # Application startup script
└── unhabitat.sql              # Database dump file
```

## Prerequisites

- Node.js (v16+)
- MySQL (v8+)
- npm or yarn
- bash shell (for setup scripts)

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/un-habitat-app.git
cd un-habitat-app
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root with your MySQL credentials:

```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=unhabitat
```

### 3. Install Frontend Dependencies

```bash
npm install
```

### 4. Setup Backend

Run the server setup script to install backend dependencies:

```bash
./setup-server.sh
```

Follow the prompts to:

- Install server dependencies
- Set up the database schema
- Import data from Excel

Alternatively, you can restore the database from the provided SQL dump:

```bash
mysql -u root -p < unhabitat.sql
```

## Running the Application

### Development Mode (Frontend + Backend)

```bash
npm run dev:full
```

### Run Frontend Only

```bash
npm run dev
```

### Run Backend Only

```bash
npm run server
```

### Access the Application

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **API**: [http://localhost:3001/api](http://localhost:3001/api)

## Data Management

### Importing Data from Excel

To import data from Excel:

1. Place the Excel file at `public/Application Development - Exam Data.xlsx`
2. Run the import script:

```bash
npm run import-data
```

### Database Setup

To set up the database schema without importing data:

```bash
npm run setup-db
```

To do both steps in one command:

```bash
npm run setup-and-import
```

### Creating a Database Dump

To create a MySQL dump of the database:

```bash
mysqldump -h localhost -u root -p unhabitat > unhabitat.sql
```

## API Documentation

### Projects

- `GET /api/projects/all` - Get all projects (optionally paginated)
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/country/:country` - Get projects by country
- `GET /api/projects/status/:status` - Get projects by approval status
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Countries, Themes, Donors

- `GET /api/countries` - Get all countries
- `GET /api/countries/:name/projects` - Get projects for a country
- `GET /api/themes` - Get all themes
- `GET /api/themes/:name/projects` - Get projects for a theme
- `GET /api/donors` - Get all donors
- `GET /api/donors/:name/projects` - Get projects for a donor

## Project Highlights

### Database Design

The application uses a carefully designed relational database schema that supports many-to-many relationships:

- Projects can be associated with multiple countries, themes, and donors
- Normalized structure ensures data integrity and minimizes redundancy

### Data Visualization

The dashboard features dynamic charts built with Recharts:

- Bar charts showing project distribution by country
- Pie charts displaying thematic analysis
- Horizontal bar charts for organizational units

### Form Validation

All project management forms implement:

- Field validation using Zod schema
- Error reporting with user-friendly messages
- Data type enforcement

### API Architecture

The backend follows RESTful principles:

- Resource-based endpoints
- HTTP verbs for CRUD operations
- JSON responses with appropriate status codes

## Future Enhancements

- User authentication and authorization
- Advanced filtering and sorting options
- Export functionality to multiple formats
- Dark/light theme toggle
- Unit and integration tests
- Deployment pipeline

---

Developed by [Your Name] as a demonstration of full-stack development skills, data visualization, and project management capabilities.
