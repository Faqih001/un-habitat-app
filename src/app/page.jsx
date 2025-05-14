"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
// Tailwind is already imported in globals.css

// Helper function to parse dates
const parseDate = (date) => {
  if (!date) return null;
  const parsed = new Date(date);
  return isNaN(parsed) ? null : parsed.toISOString().split('T')[0];
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
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const deleteProject = async (id) => {
    try {
      await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      setProjects(projects.filter(p => p.ProjectID !== id));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  // Pagination logic
  const indexOfLastProject = currentPage * rowsPerPage;
  const indexOfFirstProject = indexOfLastProject - rowsPerPage;
  const currentProjects = projects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(projects.length / rowsPerPage);

  // Project List component
  const ProjectList = () => (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">UN-Habitat Projects</h1>
      <div className="mb-4">
        <button onClick={() => setView('add')} className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Add Project</button>
        <Link href="/dashboard">
          <button className="bg-green-500 text-white px-4 py-2 rounded">View Dashboard</button>
        </Link>
      </div>
      <div className="mb-4">
        <label>Rows per page: </label>
        <select value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))} className="border p-1">
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
          <option value={projects.length}>All</option>
        </select>
      </div>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Project ID</th>
            <th className="border p-2">Title</th>
            <th className="border p-2">Approval Status</th>
            <th className="border p-2">Country(ies)</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentProjects.map(project => (
            <tr key={project.ProjectID}>
              <td className="border p-2">{project.ProjectID}</td>
              <td className="border p-2">{project.ProjectTitle}</td>
              <td className="border p-2">{project.ApprovalStatus}</td>
              <td className="border p-2">{project.countries?.join(', ')}</td>
              <td className="border p-2">
                <button onClick={() => { setSelectedProject(project); setView('view'); }} className="text-blue-500 mr-2">View</button>
                <button onClick={() => { setSelectedProject(project); setView('edit'); }} className="text-yellow-500 mr-2">Edit</button>
                <button onClick={() => deleteProject(project.ProjectID)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} className="ml-2 px-2 py-1 bg-gray-300 rounded" disabled={currentPage === 1}>Previous</button>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} className="ml-2 px-2 py-1 bg-gray-300 rounded" disabled={currentPage === totalPages}>Next</button>
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

    const handleSubmit = async (e) => {
      e.preventDefault();
      const project = {
        ...formData,
        PAGValue: Number(formData.PAGValue),
        TotalExpenditure: Number(formData.TotalExpenditure),
        TotalContribution: Number(formData.TotalContribution),
        TotalPSC: Number(formData.TotalPSC),
        StartDate: parseDate(formData.StartDate),
        EndDate: parseDate(formData.EndDate)
      };
      if (mode === 'add') {
        await addProject(project);
      } else {
        await updateProject(formData.ProjectID, project);
      }
      setView('list');
    };

    return (
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">{mode === 'add' ? 'Add Project' : 'Edit Project'}</h1>
        <div className="space-y-4">
          <input type="text" placeholder="Project ID" value={formData.ProjectID} onChange={(e) => setFormData({ ...formData, ProjectID: e.target.value })} className="border p-2 w-full" disabled={mode === 'edit'} />
          <input type="text" placeholder="Project Title" value={formData.ProjectTitle} onChange={(e) => setFormData({ ...formData, ProjectTitle: e.target.value })} className="border p-2 w-full" />
          <input type="text" placeholder="PAAS Code" value={formData.PAASCode} onChange={(e) => setFormData({ ...formData, PAASCode: e.target.value })} className="border p-2 w-full" />
          <select value={formData.ApprovalStatus} onChange={(e) => setFormData({ ...formData, ApprovalStatus: e.target.value })} className="border p-2 w-full">
            <option value="">Select Approval Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending Approval">Pending Approval</option>
          </select>
          <input type="text" placeholder="Fund" value={formData.Fund} onChange={(e) => setFormData({ ...formData, Fund: e.target.value })} className="border p-2 w-full" />
          <input type="number" placeholder="PAG Value" value={formData.PAGValue} onChange={(e) => setFormData({ ...formData, PAGValue: e.target.value })} className="border p-2 w-full" />
          <input type="text" placeholder="Start Date (e.g., 2012-01-01)" value={formData.StartDate} onChange={(e) => setFormData({ ...formData, StartDate: e.target.value })} className="border p-2 w-full" />
          <input type="text" placeholder="End Date (e.g., 2013-12-31)" value={formData.EndDate} onChange={(e) => setFormData({ ...formData, EndDate: e.target.value })} className="border p-2 w-full" />
          <input type="text" placeholder="Lead Org Unit" value={formData.LeadOrgUnit} onChange={(e) => setFormData({ ...formData, LeadOrgUnit: e.target.value })} className="border p-2 w-full" />
          <input type="number" placeholder="Total Expenditure" value={formData.TotalExpenditure} onChange={(e) => setFormData({ ...formData, TotalExpenditure: e.target.value })} className="border p-2 w-full" />
          <input type="number" placeholder="Total Contribution" value={formData.TotalContribution} onChange={(e) => setFormData({ ...formData, TotalContribution: e.target.value })} className="border p-2 w-full" />
          <input type="number" placeholder="Total PSC" value={formData.TotalPSC} onChange={(e) => setFormData({ ...formData, TotalPSC: e.target.value })} className="border p-2 w-full" />
          <select multiple value={formData.countries} onChange={(e) => setFormData({ ...formData, countries: Array.from(e.target.selectedOptions, option => option.value) })} className="border p-2 w-full">
            {countries.map(country => <option key={country} value={country}>{country}</option>)}
          </select>
          <select multiple value={formData.themes} onChange={(e) => setFormData({ ...formData, themes: Array.from(e.target.selectedOptions, option => option.value) })} className="border p-2 w-full">
            {themes.map(theme => <option key={theme} value={theme}>{theme}</option>)}
          </select>
          <select multiple value={formData.donors} onChange={(e) => setFormData({ ...formData, donors: Array.from(e.target.selectedOptions, option => option.value) })} className="border p-2 w-full">
            {donors.map(donor => <option key={donor} value={donor}>{donor}</option>)}
          </select>
          <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
          <button onClick={() => setView('list')} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Cancel</button>
        </div>
      </div>
    );
  };

  // Project View component
  const ProjectView = () => (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Details</h1>
      {selectedProject && (
        <div className="border p-4">
          <p><strong>Project ID:</strong> {selectedProject.ProjectID}</p>
          <p><strong>Title:</strong> {selectedProject.ProjectTitle}</p>
          <p><strong>PAAS Code:</strong> {selectedProject.PAASCode}</p>
          <p><strong>Approval Status:</strong> {selectedProject.ApprovalStatus}</p>
          <p><strong>Fund:</strong> {selectedProject.Fund}</p>
          <p><strong>PAG Value:</strong> {selectedProject.PAGValue}</p>
          <p><strong>Start Date:</strong> {selectedProject.StartDate}</p>
          <p><strong>End Date:</strong> {selectedProject.EndDate}</p>
          <p><strong>Lead Org Unit:</strong> {selectedProject.LeadOrgUnit}</p>
          <p><strong>Countries:</strong> {selectedProject.countries?.join(', ')}</p>
          <p><strong>Themes:</strong> {selectedProject.themes?.join(', ')}</p>
          <p><strong>Donors:</strong> {selectedProject.donors?.join(', ')}</p>
          <p><strong>Total Expenditure:</strong> {selectedProject.TotalExpenditure}</p>
          <p><strong>Total Contribution:</strong> {selectedProject.TotalContribution}</p>
          <p><strong>Total PSC:</strong> {selectedProject.TotalPSC}</p>
          <button onClick={() => setView('list')} className="bg-gray-500 text-white px-4 py-2 rounded mt-4">Back to List</button>
        </div>
      )}
    </div>
  );

  if (loading) return <div className="text-center p-4">Loading...</div>;

  return (
    <div>
      {view === 'list' && <ProjectList />}
      {view === 'add' && <ProjectForm mode="add" />}
      {view === 'edit' && <ProjectForm mode="edit" />}
      {view === 'view' && <ProjectView />}
    </div>
  );
} 