import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

// API project interface (as returned by the backend)
export interface Project {
  ProjectID: string;
  ProjectTitle: string;
  PAASCode: string;
  ApprovalStatus: string;
  Fund: string;
  PAGValue: number;
  StartDate: string;
  EndDate: string;
  LeadOrgUnit: string;
  TotalExpenditure: number;
  TotalContribution: number;
  TotalPSC: number;
  Countries?: string;
  Themes?: string;
  Donors?: string;
  // Add array versions for convenience when needed
  CountriesArray?: string[];
  ThemesArray?: string[];
  DonorsArray?: string[];
}

// Use type alias to maintain the original Project interface without renaming fields
export type ProjectData = Project;

// Process a project to add array versions of grouped fields while keeping original field names
export function processProject(project: Project): ProjectData {
  // Ensure PAGValue is a number
  let pagValue = 0;
  
  // Use a type assertion since the API might actually return a string despite the type definition
  const pagValueFromApi = project.PAGValue as number | string | undefined;
  
  if (typeof pagValueFromApi === 'string') {
    // Handle string with commas
    pagValue = parseFloat(pagValueFromApi.replace(/,/g, ''));
  } else if (typeof pagValueFromApi === 'number') {
    pagValue = pagValueFromApi;
  }

  return {
    ...project,
    // Ensure PAGValue is a valid number
    PAGValue: isNaN(pagValue) ? 0 : pagValue,
    // Add array versions for convenience
    CountriesArray: project.Countries?.split('; ') || [],
    ThemesArray: project.Themes?.split('; ') || [],
    DonorsArray: project.Donors?.split('; ') || []
  };
}

export const api = {
  // Projects
  getAllProjects: async () => {
    const response = await axios.get(`${API_URL}/projects/all`);
    // Process projects while keeping original field names
    return Array.isArray(response.data) 
      ? response.data.map(processProject)
      : [];
  },
  
  getProjectsByCountry: async (country: string) => {
    const response = await axios.get(`${API_URL}/projects/country/${encodeURIComponent(country)}`);
    return Array.isArray(response.data) 
      ? response.data.map(processProject)
      : [];
  },
  
  getProjectsByStatus: async (status: string) => {
    const response = await axios.get(`${API_URL}/projects/status/${encodeURIComponent(status)}`);
    return Array.isArray(response.data) 
      ? response.data.map(processProject)
      : [];
  },

  getProjectById: async (id: string) => {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return processProject(response.data);
  },
  
  createProject: async (project: Omit<Project, 'ProjectID'>) => {
    const response = await axios.post(`${API_URL}/projects`, project);
    return response.data;
  },
  
  updateProject: async (id: string, project: Partial<Project>) => {
    const response = await axios.put(`${API_URL}/projects/${id}`, project);
    return response.data;
  },
  
  deleteProject: async (id: string) => {
    const response = await axios.delete(`${API_URL}/projects/${id}`);
    return response.data;
  },
  
  // Metadata for filters
  getCountries: async () => {
    const response = await axios.get(`${API_URL}/countries`);
    return response.data;
  },
  
  getOrgUnits: async () => {
    // Get unique org units from projects
    const response = await axios.get(`${API_URL}/projects/all`);
    // Check if response.data is an array directly or nested in data property
    const projects = Array.isArray(response.data) ? response.data : (response.data.data || []);
    const orgUnits = [...new Set(projects.map((p: Project) => p.LeadOrgUnit).filter(Boolean))];
    return orgUnits.map((name: string) => ({ name }));
  },
  
  getThemes: async () => {
    const response = await axios.get(`${API_URL}/themes`);
    return response.data;
  },
  
  getStatuses: async () => {
    // Get unique statuses from projects
    const response = await axios.get(`${API_URL}/projects/all`);
    // Check if response.data is an array directly or nested in data property
    const projects = Array.isArray(response.data) ? response.data : (response.data.data || []);
    const statuses = [...new Set(projects.map((p: Project) => p.ApprovalStatus).filter(Boolean))];
    return statuses.map((name: string) => ({ name }));
  },
  
  getDonors: async () => {
    const response = await axios.get(`${API_URL}/donors`);
    return response.data;
  },
  
  // Get projects by theme
  getProjectsByTheme: async (theme: string) => {
    const response = await axios.get(`${API_URL}/themes/${encodeURIComponent(theme)}/projects`);
    return Array.isArray(response.data) 
      ? response.data.map(processProject)
      : [];
  },
  
  // Get projects by donor
  getProjectsByDonor: async (donor: string) => {
    const response = await axios.get(`${API_URL}/donors/${encodeURIComponent(donor)}/projects`);
    return Array.isArray(response.data) 
      ? response.data.map(processProject)
      : [];
  }
};
