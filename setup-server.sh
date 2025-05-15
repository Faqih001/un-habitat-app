#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}  UN-Habitat App Server Setup${NC}"
echo -e "${BLUE}===================================${NC}"

# Install server dependencies
echo -e "\n${BLUE}Installing server dependencies...${NC}"
npm install --no-save $(node -e "console.log(Object.entries(require('./server-dependencies.json').dependencies).map(([pkg, ver]) => pkg + '@' + ver.replace('^', '')).join(' '))")

# Install dev dependencies
echo -e "\n${BLUE}Installing server dev dependencies...${NC}"
npm install --save-dev $(node -e "console.log(Object.entries(require('./server-dependencies.json').devDependencies).map(([pkg, ver]) => pkg + '@' + ver.replace('^', '')).join(' '))")

# Create directories if they don't exist
echo -e "\n${BLUE}Creating required directories...${NC}"
mkdir -p db
mkdir -p routes/api
mkdir -p public

# Setup database
echo -e "\n${BLUE}Setting up database...${NC}"
read -p "Do you want to set up the database? (y/n): " setup_db

if [[ $setup_db =~ ^[Yy]$ ]]; then
  echo "Running database setup script..."
  node setup-database.js
  
  read -p "Do you want to import sample data from Excel? (y/n): " import_data
  if [[ $import_data =~ ^[Yy]$ ]]; then
    echo "Running Excel import script..."
    node import-excel-to-mysql.js
  fi
else
  echo -e "${YELLOW}Skipping database setup. You'll need to set up the database manually.${NC}"
fi

echo -e "\n${GREEN}Setup complete! You can now start the application:${NC}"
echo -e "  ${YELLOW}npm run dev:full${NC}   - Start both backend and frontend servers"
echo -e "  ${YELLOW}npm run server${NC}     - Start backend server only"
echo -e "  ${YELLOW}npm run dev${NC}        - Start frontend server only"
echo -e "\n${BLUE}The application should be available at:${NC}"
echo -e "  ${GREEN}Frontend: http://localhost:5173${NC}"
echo -e "  ${GREEN}API: http://localhost:3001/api${NC}"
echo -e "\n${BLUE}===================================${NC}"
