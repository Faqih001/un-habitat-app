import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, ProjectData } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import ProjectTable from '@/components/Projects/ProjectTable';
import ProjectForm from '@/components/Projects/ProjectForm';
import ProjectDetails from '@/components/Projects/ProjectDetails';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { 
  Select, 
  SelectContent, 
  SelectItem,  
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

// Define a type for the form data
interface ProjectFormData {
  ProjectTitle: string;
  CountryName: string;
  LeadOrgUnit: string;
  ThemeName: string;
  ApprovalStatus: string;
  StartDate: string;
  EndDate: string;
  PAGValue: number;
  Fund?: string;
}
type Project = ProjectData;

const Projects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State for dialogs and current project
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  
  // State for filters
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  
  // Fetch data
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getAllProjects
  });
  
  const { data: countries = [] } = useQuery({
    queryKey: ['countries'],
    queryFn: api.getCountries
  });
  
  const { data: orgUnits = [] } = useQuery({
    queryKey: ['orgUnits'],
    queryFn: api.getOrgUnits
  });
  
  const { data: themes = [] } = useQuery({
    queryKey: ['themes'],
    queryFn: api.getThemes
  });
  
  const { data: statuses = [] } = useQuery({
    queryKey: ['statuses'],
    queryFn: api.getStatuses
  });
  
  // Mutations
  const createProject = useMutation({
    mutationFn: api.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: "Success", description: "Project created successfully" });
      setIsFormOpen(false);
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({ 
        title: "Error", 
        description: "Failed to create project. Please try again.", 
        variant: "destructive" 
      });
    },
  });
  
  const updateProject = useMutation({
    mutationFn: ({ id, project }: { id: string; project: Partial<ProjectData> }) => 
      api.updateProject(id, project),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: "Success", description: "Project updated successfully" });
      setIsFormOpen(false);
    },
  });
  
  const deleteProject = useMutation({
    mutationFn: api.deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: "Success", description: "Project deleted successfully" });
    },
  });
  
  // Handlers
  const handleCreateProject = (formData: ProjectFormData) => {
    // Convert form data to ApiProject format
    const projectData = {
      ProjectTitle: formData.ProjectTitle,
      PAASCode: "",  // Default value, could be added to form later
      ApprovalStatus: formData.ApprovalStatus,
      Fund: formData.Fund || "",
      PAGValue: formData.PAGValue || 0,
      StartDate: formData.StartDate,
      EndDate: formData.EndDate,
      LeadOrgUnit: formData.LeadOrgUnit,
      // For consistency with the API endpoint which expects arrays
      countries: formData.CountryName ? [formData.CountryName] : [],
      themes: formData.ThemeName ? [formData.ThemeName] : [],
      // Also include the original string fields for compatibility
      Countries: formData.CountryName,
      Themes: formData.ThemeName,
      // Set empty defaults for additional fields
      TotalExpenditure: 0,
      TotalContribution: 0,
      TotalPSC: 0,
    };
    createProject.mutate(projectData as Omit<Project, 'ProjectID'>);
  };
  
  const handleUpdateProject = (formData: ProjectFormData) => {
    if (currentProject) {
      // Convert form data to ApiProject format
      const projectData = {
        ProjectTitle: formData.ProjectTitle,
        ApprovalStatus: formData.ApprovalStatus,
        StartDate: formData.StartDate,
        EndDate: formData.EndDate,
        LeadOrgUnit: formData.LeadOrgUnit,
        PAGValue: formData.PAGValue,
        Countries: formData.CountryName,
        Themes: formData.ThemeName,
        Fund: formData.Fund,
        // Add other fields as needed, only those that changed
      };
      updateProject.mutate({ id: currentProject.ProjectID, project: projectData });
    }
  };
  
  const handleDeleteProject = (project: Project) => {
    deleteProject.mutate(project.ProjectID);
  };
  
  const handleViewProject = (project: Project) => {
    setCurrentProject(project);
    setIsViewOpen(true);
  };
  
  const handleEditProject = (project: Project) => {
    setCurrentProject(project);
    setIsFormOpen(true);
  };
  
  const handleNewProject = () => {
    setCurrentProject(null);
    setIsFormOpen(true);
  };
  
  // Filter projects
  const filteredProjects = projects.filter((project) => {
    const matchesCountry = countryFilter === "all" || 
      (project.Countries && project.Countries.includes(countryFilter));
    const matchesStatus = statusFilter === "all" || project.ApprovalStatus === statusFilter;
    const matchesSearch = !searchQuery || 
      project.ProjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) || 
      project.ProjectID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.Fund && project.Fund.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCountry && matchesStatus && matchesSearch;
  });

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-3xl font-bold">Projects</h1>
          <Button 
            onClick={handleNewProject}
            className="bg-un-blue hover:bg-un-blue-dark"
          >
            Add New Project
          </Button>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="text-sm font-medium mb-1 block">Search</label>
              <Input
                id="search"
                placeholder="Search by ID or Title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div>
              <label htmlFor="country-filter" className="text-sm font-medium mb-1 block">Filter by Country</label>
              <ErrorBoundary>
                <Select
                  value={countryFilter}
                  onValueChange={setCountryFilter}
                >
                  <SelectTrigger id="country-filter">
                    <SelectValue placeholder="All Countries" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {Array.isArray(countries) && countries.map((country: {CountryName: string}) => (
                      <SelectItem key={country.CountryName} value={country.CountryName}>
                        {country.CountryName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ErrorBoundary>
            </div>
            
            <div>
              <label htmlFor="status-filter" className="text-sm font-medium mb-1 block">Filter by Status</label>
              <ErrorBoundary>
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {Array.isArray(statuses) && statuses.map((status: string | {name: string}) => (
                      <SelectItem key={typeof status === 'string' ? status : status.name} 
                                 value={typeof status === 'string' ? status : status.name}>
                        {typeof status === 'string' ? status : status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </ErrorBoundary>
            </div>
          </div>
        </div>
        
        <ProjectTable
          projects={filteredProjects}
          onView={handleViewProject}
          onEdit={handleEditProject}
          onDelete={handleDeleteProject}
          isLoading={isLoadingProjects}
        />
        
        {/* Project Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="sm:max-w-[700px]">
            <ProjectForm
              project={currentProject ? {
                ProjectTitle: currentProject.ProjectTitle,
                ApprovalStatus: currentProject.ApprovalStatus,
                LeadOrgUnit: currentProject.LeadOrgUnit,
                StartDate: currentProject.StartDate,
                EndDate: currentProject.EndDate,
                PAGValue: currentProject.PAGValue,
                CountryName: currentProject.Countries?.split('; ')[0] || '',
                ThemeName: currentProject.Themes?.split('; ')[0] || '',
                Fund: currentProject.Fund || '',
              } : undefined}
              onSubmit={currentProject ? handleUpdateProject : handleCreateProject}
              onCancel={() => setIsFormOpen(false)}
              countries={Array.isArray(countries) ? countries.map((country: {CountryName: string}) => country.CountryName) : []}
              orgUnits={Array.isArray(orgUnits) ? orgUnits.map((unit: string | {name: string}) => typeof unit === 'string' ? unit : unit.name) : []}
              themes={Array.isArray(themes) ? themes.map((theme: {ThemeName: string}) => theme.ThemeName) : []}
              statuses={Array.isArray(statuses) ? statuses.map((status: string | {name: string}) => typeof status === 'string' ? status : status.name) : []}
            />
          </DialogContent>
        </Dialog>
        
        {/* Project Details Dialog */}
        <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
          <DialogContent className="sm:max-w-[700px]">
            {currentProject && (
              <ProjectDetails
                project={currentProject}
                onClose={() => setIsViewOpen(false)}
                onEdit={() => {
                  setIsViewOpen(false);
                  setIsFormOpen(true);
                }}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default Projects;
