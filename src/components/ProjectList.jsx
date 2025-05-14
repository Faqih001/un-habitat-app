"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  ChevronDoubleLeftIcon, 
  ChevronDoubleRightIcon,
  TableCellsIcon,
  Squares2X2Icon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { staggerContainer, staggerItem } from '@/lib/framer-motion';
import ProjectCard from './project/ProjectCard';

export default function ProjectList() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('ProjectID');
  const [sortDirection, setSortDirection] = useState('asc');
  const [viewMode, setViewMode] = useState('table'); // table or grid
  const projectsPerPage = 10;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects/all');
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }
        const data = await response.json();
        setProjects(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleSort = (field) => {
    const isAsc = sortField === field && sortDirection === 'asc';
    setSortDirection(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = 
      project.ProjectTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.ProjectID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.LeadOrgUnit?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'all' || 
      project.ApprovalStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (!a[sortField] && !b[sortField]) return 0;
    if (!a[sortField]) return 1;
    if (!b[sortField]) return -1;

    const valueA = typeof a[sortField] === 'string' ? a[sortField].toLowerCase() : a[sortField];
    const valueB = typeof b[sortField] === 'string' ? b[sortField].toLowerCase() : b[sortField];

    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = sortedProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(sortedProjects.length / projectsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "-";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading projects...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
        <strong className="font-bold">Error!</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
          Project Portfolio <span className="text-blue-600">Management</span>
        </h1>
        
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
          <Link href="/dashboard">
            <button className="btn btn-secondary w-full sm:w-auto text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 10a8 8 0 018-8v8h8a8 8 0 11-16 0z" />
                <path d="M12 2.252A8.014 8.014 0 0117.748 8H12V2.252z" />
              </svg>
              Dashboard
            </button>
          </Link>
          <Link href="/project/add">
            <button className="btn btn-primary w-full sm:w-auto text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Project
            </button>
          </Link>
        </div>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">Search Projects</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="form-input pl-10"
                placeholder="Search by title, ID, or lead organization..."
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          </div>
          <div className="w-full md:w-64">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
            <select
              id="status-filter"
              className="form-select"
              value={statusFilter}
              onChange={handleStatusFilterChange}
            >
              <option value="all">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending Approval">Pending Approval</option>
            </select>
          </div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          Showing {currentProjects.length} of {filteredProjects.length} projects
        </div>
      </div>

      {/* Project table */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="table-responsive">
          <table className="table">
            <thead className="table-header">
              <tr>
                <th 
                  className="table-header-cell cursor-pointer" 
                  onClick={() => handleSort('ProjectID')}
                >
                  <div className="flex items-center space-x-1">
                    <span>ID</span>
                    {sortField === 'ProjectID' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="table-header-cell cursor-pointer" 
                  onClick={() => handleSort('ProjectTitle')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Title</span>
                    {sortField === 'ProjectTitle' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="table-header-cell cursor-pointer hide-on-mobile" 
                  onClick={() => handleSort('LeadOrgUnit')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Organization</span>
                    {sortField === 'LeadOrgUnit' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="table-header-cell cursor-pointer hide-on-mobile" 
                  onClick={() => handleSort('StartDate')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Start Date</span>
                    {sortField === 'StartDate' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th 
                  className="table-header-cell hide-on-mobile" 
                  onClick={() => handleSort('PAGValue')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Budget</span>
                    {sortField === 'PAGValue' && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={sortDirection === 'asc' ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
                      </svg>
                    )}
                  </div>
                </th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {currentProjects.length > 0 ? (
                currentProjects.map((project) => (
                  <tr key={project._id} className="table-row">
                    <td className="table-cell font-medium">{project.ProjectID}</td>
                    <td className="table-cell">
                      <div className="max-w-xs sm:max-w-md truncate">{project.ProjectTitle}</div>
                    </td>
                    <td className="table-cell hide-on-mobile">{project.LeadOrgUnit || "-"}</td>
                    <td className="table-cell hide-on-mobile">{formatDate(project.StartDate)}</td>
                    <td className="table-cell hide-on-mobile">{formatCurrency(project.PAGValue)}</td>
                    <td className="table-cell">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        project.ApprovalStatus === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {project.ApprovalStatus}
                      </span>
                    </td>
                    <td className="table-cell">
                      <div className="flex space-x-2">
                        <Link href={`/project/${project._id}`}>
                          <button className="btn-icon bg-blue-50 text-blue-600 hover:bg-blue-100" title="View Project">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          </button>
                        </Link>
                        <Link href={`/project/${project._id}/edit`}>
                          <button className="btn-icon bg-green-50 text-green-600 hover:bg-green-100" title="Edit Project">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    {filteredProjects.length === 0 ? (
                      <div className="flex flex-col items-center py-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="text-gray-700 mb-1">No projects found</p>
                        <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria</p>
                      </div>
                    ) : (
                      "Loading projects..."
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center flex-wrap gap-4 bg-white p-4 rounded-lg shadow-sm">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{indexOfFirstProject + 1}</span> to{' '}
            <span className="font-medium">
              {indexOfLastProject > filteredProjects.length ? filteredProjects.length : indexOfLastProject}
            </span>{' '}
            of <span className="font-medium">{filteredProjects.length}</span> results
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`pagination-item ${
                currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'pagination-item-inactive'
              }`}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => {
                // Show first page, last page, current page, and pages around current page
                return (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                );
              })
              .map((page, i, filteredPages) => (
                <React.Fragment key={page}>
                  {i > 0 && filteredPages[i - 1] !== page - 1 && (
                    <span className="px-2 py-1 text-gray-500">...</span>
                  )}
                  <button
                    onClick={() => setCurrentPage(page)}
                    className={`pagination-item ${
                      currentPage === page ? 'pagination-item-active' : 'pagination-item-inactive'
                    }`}
                  >
                    {page}
                  </button>
                </React.Fragment>
              ))}
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`pagination-item ${
                currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'pagination-item-inactive'
              }`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 