"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  ArrowTopRightOnSquareIcon, 
  ChartBarIcon, 
  PlusIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import ProjectCard from '@/components/project/ProjectCard';
import { fadeIn, slideUp, staggerContainer, staggerItem } from '@/lib/framer-motion';
import './custom.css';

// Helper function to parse dates
const parseDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed) ? null : parsed.toISOString().split('T')[0];
};

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Main App component
export default function Home() {
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [themes, setThemes] = useState([]);
  const [donors, setDonors] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [view, setView] = useState('list'); // list, add, edit, view, dashboard
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, countriesRes, themesRes, donorsRes] = await Promise.all([
          fetch('/api/projects/all'),
          fetch('/api/countries'),
          fetch('/api/themes'),
          fetch('/api/donors')
        ]);
        const projectsData = await projectsRes.json();
        const countriesData = await countriesRes.json();
        const themesData = await themesRes.json();
        const donorsData = await donorsRes.json();
        setProjects(projectsData);
        setCountries(countriesData);
        setThemes(themesData);
        setDonors(donorsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle CRUD operations
  const addProject = async (project) => {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project)
      });
      const newProject = await response.json();
      setProjects([...projects, newProject]);
      setView('list');
    } catch (error) {
      console.error('Error adding project:', error);
    }
  };

  const updateProject = async (id, updatedProject) => {
    try {
      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject)
      });
      const updated = await response.json();
      setProjects(projects.map(p => p.ProjectID === id ? updated : p));
      setView('list');
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.ProjectID !== id));
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Confirmation Dialog Component
  const ConfirmDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full animate-fade-in">
        <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
        <p className="mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button 
            onClick={() => setIsConfirmDialogOpen(false)} 
            className="btn btn-secondary"
          >
            Cancel
          </button>
          <button 
            onClick={() => deleteProject(projectToDelete)} 
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
  
  // Filter projects based on search query and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = searchQuery === '' || 
                         project.ProjectTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.ProjectID.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === '' || project.ApprovalStatus === filterStatus;
    
    const matchesCountry = filterCountry === '' || 
                          (project.countries && project.countries.includes(filterCountry));
    
    return matchesSearch && matchesStatus && matchesCountry;
  });

  // Pagination logic
  const indexOfLastProject = currentPage * rowsPerPage;
  const indexOfFirstProject = indexOfLastProject - rowsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(filteredProjects.length / rowsPerPage);

  // Project List component
  const ProjectList = () => (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          <span className="text-blue-600">UN-Habitat</span> Projects
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button onClick={() => setView('add')} className="btn btn-primary flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Project
          </button>
          <Link href="/dashboard" className="w-full sm:w-auto">
            <button className="btn btn-success flex items-center justify-center w-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Dashboard
            </button>
          </Link>
        </div>
      </div>
      
      <div className="card mb-6 md:mb-8">
        <h2 className="text-xl font-semibold mb-4">Search & Filter</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <input 
              type="text" 
              placeholder="Search by title or ID..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
              className="form-control"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Status</label>
            <select 
              value={filterStatus} 
              onChange={(e) => {
                setFilterStatus(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="form-control"
            >
              <option value="">All Statuses</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Country</label>
            <select 
              value={filterCountry} 
              onChange={(e) => {
                setFilterCountry(e.target.value);
                setCurrentPage(1); // Reset to first page on filter change
              }}
              className="form-control"
            >
              <option value="">All Countries</option>
              {countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
        <div className="text-sm text-gray-600 order-2 sm:order-1">
          Showing {filteredProjects.length > 0 ? indexOfFirstProject + 1 : 0} to {Math.min(indexOfLastProject, filteredProjects.length)} of {filteredProjects.length} projects
        </div>
        <div className="flex items-center self-end sm:self-auto order-1 sm:order-2">
          <label className="mr-2 text-sm whitespace-nowrap">Rows per page:</label>
          <select 
            value={rowsPerPage} 
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }} 
            className="form-control w-auto"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={filteredProjects.length}>All</option>
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="card text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-xl font-medium text-gray-700 mb-2">No projects found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 mb-4">
          <div className="inline-block min-w-full align-middle">
            <div className="overflow-hidden shadow-md rounded-lg">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="hidden md:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">PAG Value</th>
                    <th className="hidden sm:table-cell px-4 py-3 text-left text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Country(ies)</th>
                    <th className="px-4 py-3 text-right text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProjects.map(project => (
                    <tr key={project.ProjectID} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">{project.ProjectID}</td>
                      <td className="px-4 py-3 text-xs sm:text-sm text-gray-700 max-w-[200px] sm:max-w-xs truncate">{project.ProjectTitle}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm">
                        <span className={`badge ${project.ApprovalStatus === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                          {project.ApprovalStatus}
                        </span>
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-gray-700">{formatCurrency(project.PAGValue)}</td>
                      <td className="hidden sm:table-cell px-4 py-3 text-xs sm:text-sm text-gray-700">
                        <div className="flex flex-wrap gap-1">
                          {project.countries?.slice(0, 2).map(country => (
                            <span key={country} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              {country}
                            </span>
                          ))}
                          {project.countries?.length > 2 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                              +{project.countries.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs sm:text-sm text-right">
                        <div className="flex space-x-1 sm:space-x-2 justify-end">
                          <button 
                            onClick={() => { setSelectedProject(project); setView('view'); }} 
                            className="p-1 sm:p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                            title="View details"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => { setSelectedProject(project); setView('edit'); }} 
                            className="p-1 sm:p-1.5 bg-yellow-50 text-yellow-600 rounded hover:bg-yellow-100 transition-colors"
                            title="Edit project"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => { setProjectToDelete(project.ProjectID); setIsConfirmDialogOpen(true); }} 
                            className="p-1 sm:p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                            title="Delete project"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="pagination mt-6">
        <div className="pagination-info">
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            className="pagination-btn flex items-center" 
            disabled={currentPage === 1}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="hidden sm:inline">Previous</span>
          </button>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            className="pagination-btn flex items-center" 
            disabled={currentPage === totalPages}
          >
            <span className="hidden sm:inline">Next</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );

  // Project Form component for Add/Edit
  const ProjectForm = ({ mode }) => {
    const [formData, setFormData] = useState(mode === 'edit' && selectedProject ? { ...selectedProject } : {
      ProjectID: '',
      ProjectTitle: '',
      PAASCode: '',
      ApprovalStatus: '',
      Fund: '',
      PAGValue: '',
      StartDate: '',
      EndDate: '',
      LeadOrgUnit: '',
      TotalExpenditure: '',
      TotalContribution: '',
      TotalPSC: '',
      countries: [],
      themes: [],
      donors: []
    });
    
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = () => {
      const newErrors = {};
      if (!formData.ProjectID) newErrors.ProjectID = 'Project ID is required';
      if (!formData.ProjectTitle) newErrors.ProjectTitle = 'Project title is required';
      if (!formData.ApprovalStatus) newErrors.ApprovalStatus = 'Approval status is required';
      
      // Validate dates
      if (formData.StartDate && formData.EndDate) {
        const start = new Date(formData.StartDate);
        const end = new Date(formData.EndDate);
        if (start > end) {
          newErrors.EndDate = 'End date must be after start date';
        }
      }
      
      // Validate numeric fields
      if (formData.PAGValue && isNaN(Number(formData.PAGValue))) {
        newErrors.PAGValue = 'PAG Value must be a number';
      }
      if (formData.TotalExpenditure && isNaN(Number(formData.TotalExpenditure))) {
        newErrors.TotalExpenditure = 'Total Expenditure must be a number';
      }
      if (formData.TotalContribution && isNaN(Number(formData.TotalContribution))) {
        newErrors.TotalContribution = 'Total Contribution must be a number';
      }
      if (formData.TotalPSC && isNaN(Number(formData.TotalPSC))) {
        newErrors.TotalPSC = 'Total PSC must be a number';
      }
      
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      setIsSubmitting(true);
      
      try {
        const project = {
          ...formData,
          PAGValue: Number(formData.PAGValue) || 0,
          TotalExpenditure: Number(formData.TotalExpenditure) || 0,
          TotalContribution: Number(formData.TotalContribution) || 0,
          TotalPSC: Number(formData.TotalPSC) || 0,
          StartDate: parseDate(formData.StartDate),
          EndDate: parseDate(formData.EndDate)
        };
        
        if (mode === 'add') {
          await addProject(project);
        } else {
          await updateProject(formData.ProjectID, project);
        }
      } catch (error) {
        console.error('Error saving project:', error);
        setErrors({ submit: 'Failed to save project. Please try again.' });
      } finally {
        setIsSubmitting(false);
      }
    };

    return (
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 animate-fade-in">
        <div className="mb-6 flex items-center">
          <button 
            onClick={() => setView('list')} 
            className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="hidden sm:inline">Back to List</span>
          </button>
          <h1 className="text-xl sm:text-3xl font-bold text-gray-800">{mode === 'add' ? 'Add New Project' : 'Edit Project'}</h1>
        </div>
        
        {errors.submit && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="card">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h2 className="text-xl font-semibold mb-4">Project Details</h2>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project ID*</label>
                <input 
                  type="text" 
                  placeholder="Project ID" 
                  value={formData.ProjectID} 
                  onChange={(e) => setFormData({ ...formData, ProjectID: e.target.value })} 
                  className={`form-control ${errors.ProjectID ? 'border-red-500' : ''}`}
                  disabled={mode === 'edit'}
                />
                {errors.ProjectID && <p className="mt-1 text-sm text-red-600">{errors.ProjectID}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Project Title*</label>
                <input 
                  type="text" 
                  placeholder="Project Title" 
                  value={formData.ProjectTitle} 
                  onChange={(e) => setFormData({ ...formData, ProjectTitle: e.target.value })} 
                  className={`form-control ${errors.ProjectTitle ? 'border-red-500' : ''}`}
                />
                {errors.ProjectTitle && <p className="mt-1 text-sm text-red-600">{errors.ProjectTitle}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">PAAS Code</label>
                <input 
                  type="text" 
                  placeholder="PAAS Code" 
                  value={formData.PAASCode} 
                  onChange={(e) => setFormData({ ...formData, PAASCode: e.target.value })} 
                  className="form-control"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Approval Status*</label>
                <select 
                  value={formData.ApprovalStatus} 
                  onChange={(e) => setFormData({ ...formData, ApprovalStatus: e.target.value })} 
                  className={`form-control ${errors.ApprovalStatus ? 'border-red-500' : ''}`}
                >
                  <option value="">Select Approval Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Pending Approval">Pending Approval</option>
                </select>
                {errors.ApprovalStatus && <p className="mt-1 text-sm text-red-600">{errors.ApprovalStatus}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Fund</label>
                <input 
                  type="text" 
                  placeholder="Fund" 
                  value={formData.Fund} 
                  onChange={(e) => setFormData({ ...formData, Fund: e.target.value })} 
                  className="form-control"
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Lead Organization Unit</label>
                <input 
                  type="text" 
                  placeholder="Lead Org Unit" 
                  value={formData.LeadOrgUnit} 
                  onChange={(e) => setFormData({ ...formData, LeadOrgUnit: e.target.value })} 
                  className="form-control"
                />
              </div>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4">Timeline & Financial Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input 
                    type="date" 
                    value={formData.StartDate} 
                    onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })} 
                    className="form-control"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input 
                    type="date" 
                    value={formData.EndDate} 
                    onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })} 
                    className={`form-control ${errors.EndDate ? 'border-red-500' : ''}`}
                  />
                  {errors.EndDate && <p className="mt-1 text-sm text-red-600">{errors.EndDate}</p>}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">PAG Value</label>
                <input 
                  type="number" 
                  placeholder="PAG Value" 
                  value={formData.PAGValue} 
                  onChange={(e) => setFormData({ ...formData, PAGValue: e.target.value })} 
                  className={`form-control ${errors.PAGValue ? 'border-red-500' : ''}`}
                />
                {errors.PAGValue && <p className="mt-1 text-sm text-red-600">{errors.PAGValue}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Expenditure</label>
                <input 
                  type="number" 
                  placeholder="Total Expenditure" 
                  value={formData.TotalExpenditure} 
                  onChange={(e) => setFormData({ ...formData, TotalExpenditure: e.target.value })} 
                  className={`form-control ${errors.TotalExpenditure ? 'border-red-500' : ''}`}
                />
                {errors.TotalExpenditure && <p className="mt-1 text-sm text-red-600">{errors.TotalExpenditure}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total Contribution</label>
                <input 
                  type="number" 
                  placeholder="Total Contribution" 
                  value={formData.TotalContribution} 
                  onChange={(e) => setFormData({ ...formData, TotalContribution: e.target.value })} 
                  className={`form-control ${errors.TotalContribution ? 'border-red-500' : ''}`}
                />
                {errors.TotalContribution && <p className="mt-1 text-sm text-red-600">{errors.TotalContribution}</p>}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total PSC</label>
                <input 
                  type="number" 
                  placeholder="Total PSC" 
                  value={formData.TotalPSC} 
                  onChange={(e) => setFormData({ ...formData, TotalPSC: e.target.value })} 
                  className={`form-control ${errors.TotalPSC ? 'border-red-500' : ''}`}
                />
                {errors.TotalPSC && <p className="mt-1 text-sm text-red-600">{errors.TotalPSC}</p>}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Countries</h3>
              <p className="text-sm text-gray-500 mb-2">Select one or more countries</p>
              <select 
                multiple 
                value={formData.countries || []} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  countries: Array.from(e.target.selectedOptions, option => option.value) 
                })} 
                className="form-control h-48"
              >
                {countries.map(country => (
                  <option key={country} value={country}>{country}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Themes</h3>
              <p className="text-sm text-gray-500 mb-2">Select one or more themes</p>
              <select 
                multiple 
                value={formData.themes || []} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  themes: Array.from(e.target.selectedOptions, option => option.value) 
                })} 
                className="form-control h-48"
              >
                {themes.map(theme => (
                  <option key={theme} value={theme}>{theme}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Donors</h3>
              <p className="text-sm text-gray-500 mb-2">Select one or more donors</p>
              <select 
                multiple 
                value={formData.donors || []} 
                onChange={(e) => setFormData({ 
                  ...formData, 
                  donors: Array.from(e.target.selectedOptions, option => option.value) 
                })} 
                className="form-control h-48"
              >
                {donors.map(donor => (
                  <option key={donor} value={donor}>{donor}</option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl (or Cmd) to select multiple</p>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <button 
              type="submit" 
              className="btn btn-primary flex items-center justify-center w-full sm:w-auto" 
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Project
                </>
              )}
            </button>
            <button 
              type="button" 
              onClick={() => setView('list')} 
              className="btn btn-secondary flex items-center justify-center w-full sm:w-auto"
              disabled={isSubmitting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Project View component
  const ProjectView = () => (
    <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 animate-fade-in">
      <div className="mb-6 flex items-center">
        <button 
          onClick={() => setView('list')} 
          className="flex items-center text-gray-600 hover:text-gray-900 mr-4"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="hidden sm:inline">Back to List</span>
        </button>
        <h1 className="text-xl sm:text-3xl font-bold text-gray-800">Project Details</h1>
      </div>
      
      {selectedProject && (
        <div className="card">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2">
              <div className="mb-6">
                <h2 className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">{selectedProject.ProjectTitle}</h2>
                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500">
                  <span className="mr-0 sm:mr-2">ID: {selectedProject.ProjectID}</span>
                  <span className="hidden sm:inline mx-2">•</span>
                  <span className="ml-0 sm:ml-2">PAAS Code: {selectedProject.PAASCode}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Project Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Approval Status</p>
                      <p className="font-medium">
                        <span className={`badge ${selectedProject.ApprovalStatus === 'Approved' ? 'badge-approved' : 'badge-pending'}`}>
                          {selectedProject.ApprovalStatus}
                        </span>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Fund</p>
                      <p className="font-medium">{selectedProject.Fund || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Lead Organization Unit</p>
                      <p className="font-medium">{selectedProject.LeadOrgUnit || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Timeline</p>
                      <p className="font-medium">
                        {selectedProject.StartDate ? new Date(selectedProject.StartDate).toLocaleDateString() : 'N/A'} 
                        {' '} to {' '}
                        {selectedProject.EndDate ? new Date(selectedProject.EndDate).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-4">Financial Information</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">PAG Value</p>
                      <p className="font-medium text-xl text-blue-600">{formatCurrency(selectedProject.PAGValue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Expenditure</p>
                      <p className="font-medium">{formatCurrency(selectedProject.TotalExpenditure)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Contribution</p>
                      <p className="font-medium">{formatCurrency(selectedProject.TotalContribution)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total PSC</p>
                      <p className="font-medium">{formatCurrency(selectedProject.TotalPSC)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Countries</h3>
                {selectedProject.countries?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.countries.map(country => (
                      <span key={country} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                        {country}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No countries specified</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg mb-6">
                <h3 className="text-lg font-semibold mb-4">Themes</h3>
                {selectedProject.themes?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.themes.map(theme => (
                      <span key={theme} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {theme}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No themes specified</p>
                )}
              </div>
              
              <div className="bg-gray-50 p-5 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Donors</h3>
                {selectedProject.donors?.length ? (
                  <div className="space-y-2">
                    {selectedProject.donors.map(donor => (
                      <div key={donor} className="p-3 bg-white rounded shadow-sm">
                        {donor}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No donors specified</p>
                )}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:space-x-4">
            <button 
              onClick={() => { setView('edit'); }} 
              className="btn btn-primary flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edit Project
            </button>
            <button 
              onClick={() => { setProjectToDelete(selectedProject.ProjectID); setIsConfirmDialogOpen(true); }} 
              className="btn btn-danger flex items-center justify-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Project
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center animate-fade-in">
          <div className="mb-4">
            <svg className="animate-spin h-10 w-10 text-blue-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <p className="text-gray-600">Loading UN-Habitat Projects...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {isConfirmDialogOpen && <ConfirmDialog />}
      {view === 'list' && <ProjectList />}
      {(view === 'add' || view === 'edit') && <ProjectForm mode={view} />}
      {view === 'view' && <ProjectView />}
    </main>
  );
}