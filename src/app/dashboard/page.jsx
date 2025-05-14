"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area,
  LineChart, Line, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import { 
  ChartBarIcon, 
  HomeIcon, 
  ChartPieIcon,
  GlobeAmericasIcon,
  CurrencyDollarIcon,
  UsersIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import EnhancedStatCard from '@/components/ui/EnhancedStatCard';
import { fadeIn, slideUp, staggerContainer, staggerItem, pageTransition, childrenReveal } from '@/lib/framer-motion';

// Format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [countries, setCountries] = useState([]);
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-slate-900 bg-opacity-90 dark:bg-opacity-90 backdrop-blur-sm z-50">
        <motion.div 
          className="bg-white/90 dark:bg-slate-800/90 p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-700/50 text-center max-w-md w-full"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.div 
            className="mb-6 relative flex justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, ease: "linear", repeat: Infinity }}
          >
            {/* Logo and loader */}
            <div className="relative">
              <svg className="h-16 w-16" viewBox="0 0 100 100">
                <circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-primary-100 dark:stroke-primary-900 fill-none" 
                  strokeWidth="8"
                />
                <motion.circle 
                  cx="50" cy="50" r="40" 
                  className="stroke-primary-600 dark:stroke-primary-400 fill-none" 
                  strokeWidth="8"
                  strokeLinecap="round"
                  initial={{ pathLength: 0.2, rotate: -90, opacity: 0.8 }}
                  animate={{ pathLength: 0.8, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
                  style={{ transformOrigin: 'center' }}
                />
              </svg>
              <motion.div 
                className="absolute inset-0 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, ease: "easeInOut", repeat: Infinity }}
              >
                <span className="text-primary-600 dark:text-primary-400 font-semibold">UN</span>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.h2 
            className="text-xl font-bold text-gray-800 dark:text-white mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Loading Dashboard
          </motion.h2>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            Preparing your project analytics...
          </motion.p>
          
          <motion.div 
            className="mt-4 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
            initial={{ width: "100%", opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <motion.div 
              className="h-full bg-primary-500 dark:bg-primary-600 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>
    );
  }

  // Preparing data for visualizations
  const countryData = countries.map(country => ({
    name: country,
    projects: projects.filter(p => p.countries.includes(country)).length,
    value: projects.filter(p => p.countries.includes(country)).reduce((total, p) => total + (p.PAGValue || 0), 0)
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  const orgUnitData = [...new Set(projects.map(p => p.LeadOrgUnit))].map(unit => ({
    name: unit || 'Unknown',
    projects: projects.filter(p => p.LeadOrgUnit === unit).length,
    value: projects.filter(p => p.LeadOrgUnit === unit).reduce((total, p) => total + (p.PAGValue || 0), 0)
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  const themeData = themes.map(theme => ({
    name: theme,
    projects: projects.filter(p => p.themes?.includes(theme)).length,
    value: projects.filter(p => p.themes?.includes(theme)).reduce((total, p) => total + (p.PAGValue || 0), 0)
  })).filter(d => d.projects > 0).sort((a, b) => b.projects - a.projects).slice(0, 10);

  const statusData = [
    { 
      name: 'Approved', 
      value: projects.filter(p => p.ApprovalStatus === 'Approved').length,
      pctValue: projects.filter(p => p.ApprovalStatus === 'Approved').length / projects.length * 100
    },
    { 
      name: 'Pending', 
      value: projects.filter(p => p.ApprovalStatus === 'Pending Approval').length,
      pctValue: projects.filter(p => p.ApprovalStatus === 'Pending Approval').length / projects.length * 100
    }
  ];

  // Stats
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((total, p) => total + (p.PAGValue || 0), 0);
  const totalExpenditure = projects.reduce((total, p) => total + (p.TotalExpenditure || 0), 0);
  const completionRate = totalExpenditure / totalBudget * 100;
  const totalCountries = [...new Set(projects.flatMap(p => p.countries || []))].length;
  const approvedProjects = projects.filter(p => p.ApprovalStatus === 'Approved').length;
  const approvalRate = (approvedProjects / totalProjects) * 100;

  // Calculate month-over-month growth (simulated for demo purposes)
  const growthRate = 8.4; // simulated 8.4% monthly growth

  // Colors
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#FF6B6B', '#6A0572', '#005AA7'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 shadow-md rounded border border-gray-200">
          <p className="font-medium text-gray-900">{label || payload[0].name}</p>
          <p className="text-blue-600">{`Projects: ${payload[0].value}`}</p>
          {payload[1] && <p className="text-green-600">{`Budget: ${formatCurrency(payload[1].value)}`}</p>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto py-4 sm:py-6 px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-0">
              <span className="text-blue-600">UN-Habitat</span> Dashboard
            </h1>
            <Link href="/">
              <button className="btn btn-secondary flex items-center w-full sm:w-auto justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Projects
              </button>
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* Key metrics */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <EnhancedStatCard
            title="Total Projects"
            value={totalProjects}
            description="Active projects in database"
            icon={<DocumentTextIcon className="h-5 w-5" />}
            trend="up"
            trendValue={`+${growthRate}%`}
            variant="glass"
          />
          
          <EnhancedStatCard
            title="Total Budget"
            value={formatCurrency(totalBudget)}
            description="Combined project budget"
            icon={<CurrencyDollarIcon className="h-5 w-5" />}
            trend="up"
            trendValue="+12.3%"
            variant="glass"
          />
          
          <EnhancedStatCard
            title="Countries Reached"
            value={totalCountries}
            description="Geographic coverage"
            icon={<GlobeAmericasIcon className="h-5 w-5" />}
            trend="neutral"
            variant="glass"
          />
          
          <EnhancedStatCard
            title="Approval Rate"
            value={`${Math.round(approvalRate)}%`}
            description={`${approvedProjects} of ${totalProjects} projects`}
            icon={<ChartPieIcon className="h-5 w-5" />}
            trend={approvalRate > 75 ? "up" : "neutral"}
            variant="glass"
          />
        </motion.div>

        {/* Featured insight */}
        <div className="factoid mb-6 sm:mb-8 animate-fade-in">
          <div className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Key Insight</h3>
              <p className="text-blue-700 text-sm sm:text-base">
                {countryData[0]?.name} leads with {countryData[0]?.projects} projects and a total budget of {formatCurrency(countryData[0]?.value)}, 
                representing {(countryData[0]?.projects / totalProjects * 100).toFixed(1)}% of all UN-Habitat initiatives.
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6 sm:mb-8 overflow-x-auto">
          <nav className="-mb-px flex space-x-4 sm:space-x-8 whitespace-nowrap py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('countries')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'countries'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              By Country
            </button>
            <button
              onClick={() => setActiveTab('orgUnits')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'orgUnits'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              By Lead Org Unit
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`py-2 sm:py-4 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                activeTab === 'themes'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              By Theme
            </button>
          </nav>
        </div>

        {/* Status Overview */}
        {activeTab === 'overview' && (
          <div className="animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-6 sm:mb-8">
              <motion.div 
                className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 rounded-xl shadow-lg p-6"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900 dark:text-white flex items-center">
                  <ChartPieIcon className="h-5 w-5 text-primary-500 mr-2" />
                  Project Status Distribution
                </h2>
                <div className="h-60 sm:h-80">
                  <motion.div
                    className="w-full h-full"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut", delay: 0.6 }}
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={window.innerWidth < 640 ? 60 : 80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, pctValue }) => `${name}: ${pctValue.toFixed(1)}%`}
                          animationBegin={300}
                          animationDuration={1200}
                          animationEasing="ease-out"
                        >
                          {statusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />} 
                          animationDuration={300}
                          animationEasing="ease-out"
                        />
                        <Legend 
                          wrapperStyle={{ 
                            fontSize: window.innerWidth < 640 ? '10px' : '12px',
                            paddingTop: '20px'
                          }} 
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </motion.div>
                </div>
              </motion.div>
              <div className="dashboard-card">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Top Countries by Project Count</h2>
                <div className="h-60 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={countryData.slice(0, window.innerWidth < 640 ? 3 : 5)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                      <YAxis tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                      <Bar dataKey="projects" fill="#8884d8" name="Projects" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="dashboard-card mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Top Themes by Budget Allocation</h2>
              <div className="h-60 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeData.slice(0, window.innerWidth < 640 ? 3 : 5)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                    <Bar yAxisId="left" dataKey="projects" fill="#8884d8" name="Projects" />
                    <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Budget Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Countries Tab */}
        {activeTab === 'countries' && (
          <div className="animate-fade-in">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Projects by Country (Top {window.innerWidth < 640 ? 5 : 10})</h2>
            <div className="dashboard-card mb-6 sm:mb-8">
              <div className="h-64 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData.slice(0, window.innerWidth < 640 ? 5 : 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                    <Bar yAxisId="left" dataKey="projects" fill="#8884d8" name="Project Count" />
                    <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Budget Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Org Units Tab */}
        {activeTab === 'orgUnits' && (
          <div className="animate-fade-in">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Projects by Lead Organization Unit (Top {window.innerWidth < 640 ? 5 : 10})</h2>
            <div className="dashboard-card mb-6 sm:mb-8">
              <div className="h-64 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orgUnitData.slice(0, window.innerWidth < 640 ? 5 : 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                    <Bar yAxisId="left" dataKey="projects" fill="#8884d8" name="Project Count" />
                    <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Budget Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* Themes Tab */}
        {activeTab === 'themes' && (
          <div className="animate-fade-in">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Projects by Theme (Top {window.innerWidth < 640 ? 5 : 10})</h2>
            <div className="dashboard-card mb-6 sm:mb-8">
              <div className="h-64 sm:h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={themeData.slice(0, window.innerWidth < 640 ? 5 : 10)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="left" orientation="left" stroke="#8884d8" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" tick={{ fontSize: window.innerWidth < 640 ? 10 : 12 }} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend wrapperStyle={{ fontSize: window.innerWidth < 640 ? '10px' : '12px' }} />
                    <Bar yAxisId="left" dataKey="projects" fill="#8884d8" name="Project Count" />
                    <Bar yAxisId="right" dataKey="value" fill="#82ca9d" name="Budget Value" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}