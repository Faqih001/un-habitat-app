#!/bin/bash

# Colors for better output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}===================================${NC}"
echo -e "${BLUE}  Starting UN-Habitat Application  ${NC}"
echo -e "${BLUE}===================================${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
  echo -e "${YELLOW}Warning: .env.local file not found.${NC}"
  echo -e "Creating default .env.local file with:"
  echo -e "  DB_HOST=localhost"
  echo -e "  DB_USER=root"
  echo -e "  DB_PASSWORD=test"
  echo -e "  DB_NAME=unhabitat"
  
  echo "DB_HOST=localhost" > .env.local
  echo "DB_USER=root" >> .env.local
  echo "DB_PASSWORD=test" >> .env.local
  echo "DB_NAME=unhabitat" >> .env.local
  
  echo -e "${YELLOW}Please update .env.local with your actual database credentials if needed.${NC}"
fi

# Check if Excel file exists
if [ ! -f public/Application\ Development\ -\ Exam\ Data.xlsx ]; then
  echo -e "${YELLOW}Warning: Excel file not found in public directory.${NC}"
  echo -e "Make sure to place the Excel file at: public/Application Development - Exam Data.xlsx"
else
  echo -e "${GREEN}Excel file found at: public/Application Development - Exam Data.xlsx${NC}"
fi

# Start the application
echo -e "\n${BLUE}Starting the application...${NC}"
echo -e "  Frontend: http://localhost:5173"
echo -e "  Backend API: http://localhost:3001/api\n"

npm run dev:full
