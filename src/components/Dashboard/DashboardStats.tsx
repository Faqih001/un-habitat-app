import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectData } from '@/services/api';

interface DashboardStatsProps {
  projects: ProjectData[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ projects }) => {
  // Calculate statistics
  const totalProjects = projects.length;
  const totalCountries = new Set(projects.flatMap(p => p.CountriesArray || [])).size;
  
  // Ensure PAGValue is properly converted to a number
  const totalBudget = projects.reduce((sum, project) => {
    let pagValue = 0;
    
    // Use type assertion since the API might return string despite the type definition
    const pagValueFromApi = project.PAGValue as number | string | undefined;
    
    if (typeof pagValueFromApi === 'string') {
      // Handle string with commas
      pagValue = parseFloat(pagValueFromApi.replace(/,/g, ''));
    } else if (typeof pagValueFromApi === 'number') {
      pagValue = pagValueFromApi;
    }
    
    return sum + (isNaN(pagValue) ? 0 : pagValue);
  }, 0);
  
  // Count by status
  const statusCounts = projects.reduce((acc, project) => {
    const status = project.ApprovalStatus || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    
    // Also count "Pending Approval" as "Pending" for the dashboard stats
    if (status === 'Pending Approval') {
      acc['Pending'] = (acc['Pending'] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 sm:pt-2">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">{totalProjects}</div>
          <p className="text-xs text-muted-foreground">
            Across {totalCountries} countries
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Total Budget
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 sm:pt-2">
          <div className="text-xl sm:text-2xl font-bold truncate" title={`$${totalBudget.toLocaleString()}`}>
            ${!isNaN(totalBudget) ? (totalBudget / 1000000).toFixed(2) : 0}M
          </div>
          <p className="text-xs text-muted-foreground">
            USD (in millions)
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Approved Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 sm:pt-2">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {statusCounts['Approved'] || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalProjects ? Math.round((statusCounts['Approved'] || 0) / totalProjects * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
      
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between pb-1 sm:pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">
            Pending Projects
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-1 sm:pt-2">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">
            {statusCounts['Pending'] || 0}
          </div>
          <p className="text-xs text-muted-foreground">
            {totalProjects ? Math.round((statusCounts['Pending'] || 0) / totalProjects * 100) : 0}% of total
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
