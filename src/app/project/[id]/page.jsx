"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const formatDate = (dateString) => {
  if (!dateString) return "Not specified";
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "Not specified";
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function ProjectDetail({ params }) {
  const router = useRouter();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchProjectDetail = async () => {
      try {
        const response = await fetch(`/api/projects/${params.id}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.status}`);
        }
        
        const data = await response.json();
        setProject(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching project detail:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchProjectDetail();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const response = await fetch(`/api/projects/${params.id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete project: ${response.status}`);
      }
      
      router.push('/');
    } catch (err) {
      console.error('Error deleting project:', err);
      alert(`Error deleting project: ${err.message}`);
    }
  };

  const calculateProgress = () => {
    if (!project || !project.TotalExpenditure || !project.PAGValue) return 0;
    return Math.min(100, Math.round((project.TotalExpenditure / project.PAGValue) * 100));
  };

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
          <p className="text-gray-600">Loading Project Data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h2 className="text-red-600 text-lg font-semibold mb-2">Error Loading Project</h2>
          <p className="text-red-700">{error}</p>
          <div className="mt-4">
            <Link href="/">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Return to Projects
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
          <h2 className="text-yellow-600 text-lg font-semibold mb-2">Project Not Found</h2>
          <p className="text-yellow-700">The requested project could not be found.</p>
          <div className="mt-4">
            <Link href="/">
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                Return to Projects
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = calculateProgress();

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
            <div>
              <div className="flex items-center mb-1 sm:mb-2">
                <Link href="/">
                  <button className="mr-2 inline-flex items-center text-gray-500 hover:text-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="text-sm sm:text-base">Back</span>
                  </button>
                </Link>
                <div className="h-5 border-l border-gray-300 mx-2"></div>
                <span className="text-sm text-gray-500">Project ID: {project.ProjectID}</span>
              </div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 leading-tight break-words">
                {project.ProjectTitle}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2 sm:gap-3">
              <Link href={`/project/${params.id}/edit`}>
                <button className="btn btn-primary w-full sm:w-auto">Edit Project</button>
              </Link>
              <button onClick={handleDelete} className="btn btn-danger w-full sm:w-auto">
                Delete Project
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Badge */}
      <div className="container mx-auto py-4 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex-1 mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">Approval Status</span>
            <div className="flex items-center mt-1">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                project.ApprovalStatus === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.ApprovalStatus}
              </span>
            </div>
          </div>
          <div className="flex-1 mb-4 sm:mb-0">
            <span className="text-sm text-gray-500">Financial Completion</span>
            <div className="mt-1">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-500">{progress}% Complete</span>
                <span className="text-xs text-gray-500">
                  {formatCurrency(project.TotalExpenditure)} of {formatCurrency(project.PAGValue)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex-1">
            <span className="text-sm text-gray-500">Lead Organization</span>
            <p className="font-medium mt-1">{project.LeadOrgUnit || 'Not specified'}</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6">
        {/* Tabs */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden mb-6">
          <div className="border-b border-gray-200 overflow-x-auto">
            <nav className="flex">
              <button
                className={`py-3 sm:py-4 px-4 sm:px-6 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('overview')}
              >
                Overview
              </button>
              <button
                className={`py-3 sm:py-4 px-4 sm:px-6 font-medium text-sm ${
                  activeTab === 'financial'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('financial')}
              >
                Financial Details
              </button>
              <button
                className={`py-3 sm:py-4 px-4 sm:px-6 font-medium text-sm ${
                  activeTab === 'countries'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('countries')}
              >
                Countries & Themes
              </button>
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Project Description</h3>
                      <p className="text-gray-800">{project.ProjectDescription || 'No description provided.'}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                      <div className="bg-blue-50 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-blue-700">Start Date</span>
                          <p className="font-medium text-blue-900">{formatDate(project.StartDate)}</p>
                        </div>
                        <div>
                          <span className="text-xs text-blue-700">End Date</span>
                          <p className="font-medium text-blue-900">{formatDate(project.EndDate)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Project Details</h3>
                      <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div className="sm:col-span-2">
                          <dt className="text-xs text-gray-500">Project Manager</dt>
                          <dd className="mt-1 text-gray-800">{project.ProjectManager || 'Not specified'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Focus Area</dt>
                          <dd className="mt-1 text-gray-800">{project.FocusArea || 'Not specified'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Project Status</dt>
                          <dd className="mt-1 text-gray-800">{project.ProjectStatus || 'Not specified'}</dd>
                        </div>
                        <div>
                          <dt className="text-xs text-gray-500">Target Group</dt>
                          <dd className="mt-1 text-gray-800">{project.TargetGroup || 'Not specified'}</dd>
                        </div>
                      </dl>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Project Outputs</h3>
                      <p className="text-gray-800">{project.ExpectedOutputs || 'No outputs specified.'}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Financial Tab */}
            {activeTab === 'financial' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Budget Overview</h3>
                    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6">
                      <div>
                        <dt className="text-xs text-gray-500">PAG Value</dt>
                        <dd className="mt-1 text-gray-800 font-medium">{formatCurrency(project.PAGValue)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Allotment</dt>
                        <dd className="mt-1 text-gray-800 font-medium">{formatCurrency(project.Allotment)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Total Expenditure</dt>
                        <dd className="mt-1 text-gray-800 font-medium">{formatCurrency(project.TotalExpenditure)}</dd>
                      </div>
                      <div>
                        <dt className="text-xs text-gray-500">Percentage</dt>
                        <dd className="mt-1 text-gray-800 font-medium">{progress}%</dd>
                      </div>
                    </dl>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Funding Information</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Donors</h4>
                        {project.donors && project.donors.length > 0 ? (
                          <ul className="list-disc list-inside text-gray-800 space-y-1">
                            {project.donors.map((donor, index) => (
                              <li key={index}>{donor}</li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-gray-500 italic">No donors specified</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs text-gray-500 mb-2">Budget Source</h4>
                        <p className="text-gray-800">{project.BudgetSource || 'Not specified'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Countries & Themes Tab */}
            {activeTab === 'countries' && (
              <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Countries</h3>
                    {project.countries && project.countries.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.countries.map((country, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            {country}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No countries specified</p>
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-4">Themes</h3>
                    {project.themes && project.themes.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {project.themes.map((theme, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                            {theme}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">No themes specified</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white shadow-sm rounded-lg p-4 sm:p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Information</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <dt className="text-xs text-gray-500">Created</dt>
              <dd className="mt-1 text-gray-800">{formatDate(project.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Last Updated</dt>
              <dd className="mt-1 text-gray-800">{formatDate(project.updatedAt)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Reference Code</dt>
              <dd className="mt-1 text-gray-800">{project.ReferenceCode || 'Not specified'}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
} 