
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api, ProjectData } from '@/services/api';
import MainLayout from '@/components/Layout/MainLayout';
import DashboardStats from '@/components/Dashboard/DashboardStats';
import ChartContainer from '@/components/Dashboard/ChartContainer';
import DashboardRecentProjects from '@/components/Dashboard/DashboardRecentProjects';

const Dashboard = () => {
  const { data: projects = [], isLoading: isLoadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: api.getAllProjects,
  });

  return (
    <MainLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        </div>
        
        {isLoadingProjects ? (
          <div className="text-center py-8 sm:py-12">
            <div className="animate-pulse">Loading dashboard data...</div>
          </div>
        ) : (
          <>
            <DashboardStats projects={projects} />
            <ChartContainer projects={projects} />
            
            <DashboardRecentProjects projects={projects} />
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Dashboard;
