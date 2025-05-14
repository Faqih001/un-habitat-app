"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../custom.css';

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, countriesRes, themesRes] = await Promise.all([
          fetch('/api/projects/all'),
          fetch('/api/countries'),
          fetch('/api/themes')
        ]);
        const projectsData = await projectsRes.json();
        const countriesData = await countriesRes.json();
        const themesData = await themesRes.json();
        setProjects(projectsData);
        setCountries(countriesData);
        setThemes(themesData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="text-center p-4">Loading...</div>;

  // Preparing data for visualizations
  const countryData = countries.map(country => ({
    name: country,
    projects: projects.filter(p => p.countries.includes(country)).length
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  const orgUnitData = [...new Set(projects.map(p => p.LeadOrgUnit))].map(unit => ({
    name: unit || 'Unknown',
    projects: projects.filter(p => p.LeadOrgUnit === unit).length
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  const themeData = themes.map(theme => ({
    name: theme,
    projects: projects.filter(p => p.themes.includes(theme)).length
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  // Interesting fact
  const topCountry = countryData[0]?.name || 'N/A';
  const topCountryProjects = countryData[0]?.projects || 0;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Project Dashboard</h1>
      <p className="mb-4"><strong>Interesting Fact:</strong> {topCountry} has the most projects with {topCountryProjects} initiatives, indicating significant UN-Habitat activity in this region.</p>
      
      <h2 className="text-xl font-semibold mb-2">Projects by Country (Top 10)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={countryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="projects" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mb-2 mt-8">Projects by Lead Org Unit (Top 10)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={orgUnitData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="projects" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>

      <h2 className="text-xl font-semibold mb-2 mt-8">Projects by Theme (Top 10)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={themeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" fontSize={12} />
          <YAxis fontSize={12} />
          <Tooltip />
          <Legend />
          <Bar dataKey="projects" fill="#ffc107" />
        </BarChart>
      </ResponsiveContainer>

      <a href="/" className="bg-gray-500 text-white px-4 py-2 rounded mt-4 inline-block">Back to List</a>
    </div>
  );
} 