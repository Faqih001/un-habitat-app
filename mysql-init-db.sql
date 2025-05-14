-- Creating database
CREATE DATABASE IF NOT EXISTS unhabitat;
USE unhabitat;

-- Creating tables for normalized data
CREATE TABLE IF NOT EXISTS projects (
  ProjectID VARCHAR(50) PRIMARY KEY,
  ProjectTitle TEXT,
  PAASCode VARCHAR(50),
  ApprovalStatus VARCHAR(50),
  Fund VARCHAR(50),
  PAGValue DECIMAL(15,2),
  StartDate DATE,
  EndDate DATE,
  LeadOrgUnit VARCHAR(100),
  TotalExpenditure DECIMAL(15,2),
  TotalContribution DECIMAL(15,2),
  TotalPSC DECIMAL(15,2)
);

CREATE TABLE IF NOT EXISTS countries (
  CountryName VARCHAR(100) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS themes (
  ThemeName VARCHAR(100) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS donors (
  DonorName VARCHAR(200) PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS project_countries (
  ProjectID VARCHAR(50),
  CountryName VARCHAR(100),
  FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
  FOREIGN KEY (CountryName) REFERENCES countries(CountryName) ON DELETE CASCADE,
  PRIMARY KEY (ProjectID, CountryName)
);

CREATE TABLE IF NOT EXISTS project_themes (
  ProjectID VARCHAR(50),
  ThemeName VARCHAR(100),
  FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
  FOREIGN KEY (ThemeName) REFERENCES themes(ThemeName) ON DELETE CASCADE,
  PRIMARY KEY (ProjectID, ThemeName)
);

CREATE TABLE IF NOT EXISTS project_donors (
  ProjectID VARCHAR(50),
  DonorName VARCHAR(200),
  FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
  FOREIGN KEY (DonorName) REFERENCES donors(DonorName) ON DELETE CASCADE,
  PRIMARY KEY (ProjectID, DonorName)
);

-- Inserting sample data (subset for brevity, full data in repository)
INSERT INTO projects (ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC) VALUES
('1000', 'Youth Empowerment for Urban Development', 'H139', 'Approved', 'FNO', 4218607.00, '2012-01-01', '2013-12-31', 'Urban Economy', 4439757.00, 4329257.00, 316548.00);

INSERT INTO countries (CountryName) VALUES ('GLOBAL'), ('Kenya'), ('Somalia'), ('Senegal'), ('Liberia');

INSERT INTO themes (ThemeName) VALUES ('Urban Economy'), ('Management'), ('Advocacy'), ('Urban Land, Legislation & Governance'), ('Risk Reduction and Rehabilitation');

INSERT INTO donors (DonorName) VALUES ('BASF Stiftung'), ('PM of Norway to the United Nations'), ('The Palestinian Ministry of Public Works and Housing');

INSERT INTO project_countries (ProjectID, CountryName) VALUES ('1000', 'GLOBAL');
INSERT INTO project_themes (ProjectID, ThemeName) VALUES ('1000', 'Urban Economy');
INSERT INTO project_donors (ProjectID, DonorName) VALUES 
('1000', 'BASF Stiftung'), 
('1000', 'PM of Norway to the United Nations'), 
('1000', 'The Palestinian Ministry of Public Works and Housing'); 