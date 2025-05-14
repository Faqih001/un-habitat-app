-- Creating database (MySQL syntax)
-- Uncomment the line below when using MySQL
-- CREATE DATABASE IF NOT EXISTS unhabitat;
-- USE unhabitat;

-- For MS SQL Server, use:
-- IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'unhabitat')
-- BEGIN
--     CREATE DATABASE unhabitat;
-- END
-- GO
-- USE unhabitat;
-- GO

-- Creating tables for normalized data
IF OBJECT_ID('projects', 'U') IS NULL
BEGIN
  CREATE TABLE projects (
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
END;

IF OBJECT_ID('countries', 'U') IS NULL
BEGIN
  CREATE TABLE countries (
    CountryName VARCHAR(100) PRIMARY KEY
  );
END;

IF OBJECT_ID('themes', 'U') IS NULL
BEGIN
  CREATE TABLE themes (
    ThemeName VARCHAR(100) PRIMARY KEY
  );
END;

IF OBJECT_ID('donors', 'U') IS NULL
BEGIN
  CREATE TABLE donors (
    DonorName VARCHAR(200) PRIMARY KEY
  );
END;

IF OBJECT_ID('project_countries', 'U') IS NULL
BEGIN
  CREATE TABLE project_countries (
    ProjectID VARCHAR(50),
    CountryName VARCHAR(100),
    CONSTRAINT FK_ProjectCountry_Project FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
    CONSTRAINT FK_ProjectCountry_Country FOREIGN KEY (CountryName) REFERENCES countries(CountryName) ON DELETE CASCADE,
    CONSTRAINT PK_ProjectCountry PRIMARY KEY (ProjectID, CountryName)
  );
END;

IF OBJECT_ID('project_themes', 'U') IS NULL
BEGIN
  CREATE TABLE project_themes (
    ProjectID VARCHAR(50),
    ThemeName VARCHAR(100),
    CONSTRAINT FK_ProjectTheme_Project FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
    CONSTRAINT FK_ProjectTheme_Theme FOREIGN KEY (ThemeName) REFERENCES themes(ThemeName) ON DELETE CASCADE,
    CONSTRAINT PK_ProjectTheme PRIMARY KEY (ProjectID, ThemeName)
  );
END;

IF OBJECT_ID('project_donors', 'U') IS NULL
BEGIN
  CREATE TABLE project_donors (
    ProjectID VARCHAR(50),
    DonorName VARCHAR(200),
    CONSTRAINT FK_ProjectDonor_Project FOREIGN KEY (ProjectID) REFERENCES projects(ProjectID) ON DELETE CASCADE,
    CONSTRAINT FK_ProjectDonor_Donor FOREIGN KEY (DonorName) REFERENCES donors(DonorName) ON DELETE CASCADE,
    CONSTRAINT PK_ProjectDonor PRIMARY KEY (ProjectID, DonorName)
  );
END;

-- Inserting sample data (subset for brevity, full data in repository)
-- Use IF NOT EXISTS checks before inserting
IF NOT EXISTS (SELECT 1 FROM projects WHERE ProjectID = '1000')
BEGIN
  INSERT INTO projects (ProjectID, ProjectTitle, PAASCode, ApprovalStatus, Fund, PAGValue, StartDate, EndDate, LeadOrgUnit, TotalExpenditure, TotalContribution, TotalPSC) 
  VALUES ('1000', 'Youth Empowerment for Urban Development', 'H139', 'Approved', 'FNO', 4218607.00, '2012-01-01', '2013-12-31', 'Urban Economy', 4439757.00, 4329257.00, 316548.00);
END;

-- Insert countries
IF NOT EXISTS (SELECT 1 FROM countries WHERE CountryName = 'GLOBAL')
BEGIN
  INSERT INTO countries (CountryName) VALUES ('GLOBAL');
END;
IF NOT EXISTS (SELECT 1 FROM countries WHERE CountryName = 'Kenya')
BEGIN
  INSERT INTO countries (CountryName) VALUES ('Kenya');
END;
IF NOT EXISTS (SELECT 1 FROM countries WHERE CountryName = 'Somalia')
BEGIN
  INSERT INTO countries (CountryName) VALUES ('Somalia');
END;
IF NOT EXISTS (SELECT 1 FROM countries WHERE CountryName = 'Senegal')
BEGIN
  INSERT INTO countries (CountryName) VALUES ('Senegal');
END;
IF NOT EXISTS (SELECT 1 FROM countries WHERE CountryName = 'Liberia')
BEGIN
  INSERT INTO countries (CountryName) VALUES ('Liberia');
END;

-- Insert themes
IF NOT EXISTS (SELECT 1 FROM themes WHERE ThemeName = 'Urban Economy')
BEGIN
  INSERT INTO themes (ThemeName) VALUES ('Urban Economy');
END;
IF NOT EXISTS (SELECT 1 FROM themes WHERE ThemeName = 'Management')
BEGIN
  INSERT INTO themes (ThemeName) VALUES ('Management');
END;
IF NOT EXISTS (SELECT 1 FROM themes WHERE ThemeName = 'Advocacy')
BEGIN
  INSERT INTO themes (ThemeName) VALUES ('Advocacy');
END;
IF NOT EXISTS (SELECT 1 FROM themes WHERE ThemeName = 'Urban Land, Legislation & Governance')
BEGIN
  INSERT INTO themes (ThemeName) VALUES ('Urban Land, Legislation & Governance');
END;
IF NOT EXISTS (SELECT 1 FROM themes WHERE ThemeName = 'Risk Reduction and Rehabilitation')
BEGIN
  INSERT INTO themes (ThemeName) VALUES ('Risk Reduction and Rehabilitation');
END;

-- Insert donors
IF NOT EXISTS (SELECT 1 FROM donors WHERE DonorName = 'BASF Stiftung')
BEGIN
  INSERT INTO donors (DonorName) VALUES ('BASF Stiftung');
END;
IF NOT EXISTS (SELECT 1 FROM donors WHERE DonorName = 'PM of Norway to the United Nations')
BEGIN
  INSERT INTO donors (DonorName) VALUES ('PM of Norway to the United Nations');
END;
IF NOT EXISTS (SELECT 1 FROM donors WHERE DonorName = 'The Palestinian Ministry of Public Works and Housing')
BEGIN
  INSERT INTO donors (DonorName) VALUES ('The Palestinian Ministry of Public Works and Housing');
END;

-- Insert relationships
IF NOT EXISTS (SELECT 1 FROM project_countries WHERE ProjectID = '1000' AND CountryName = 'GLOBAL')
BEGIN
  INSERT INTO project_countries (ProjectID, CountryName) VALUES ('1000', 'GLOBAL');
END;
IF NOT EXISTS (SELECT 1 FROM project_themes WHERE ProjectID = '1000' AND ThemeName = 'Urban Economy')
BEGIN
  INSERT INTO project_themes (ProjectID, ThemeName) VALUES ('1000', 'Urban Economy');
END;
IF NOT EXISTS (SELECT 1 FROM project_donors WHERE ProjectID = '1000' AND DonorName = 'BASF Stiftung')
BEGIN
  INSERT INTO project_donors (ProjectID, DonorName) VALUES ('1000', 'BASF Stiftung');
END;
IF NOT EXISTS (SELECT 1 FROM project_donors WHERE ProjectID = '1000' AND DonorName = 'PM of Norway to the United Nations')
BEGIN 
  INSERT INTO project_donors (ProjectID, DonorName) VALUES ('1000', 'PM of Norway to the United Nations');
END;
IF NOT EXISTS (SELECT 1 FROM project_donors WHERE ProjectID = '1000' AND DonorName = 'The Palestinian Ministry of Public Works and Housing')
BEGIN
  INSERT INTO project_donors (ProjectID, DonorName) VALUES ('1000', 'The Palestinian Ministry of Public Works and Housing');
END; 