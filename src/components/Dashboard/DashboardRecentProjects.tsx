import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ProjectData } from '@/services/api';

interface DashboardRecentProjectsProps {
  projects: ProjectData[];
}

const DashboardRecentProjects: React.FC<DashboardRecentProjectsProps> = ({ projects }) => {
  // Sort projects by StartDate (most recent first)
  const recentProjects = [...projects]
    .sort((a, b) => {
      const dateA = a.StartDate ? new Date(a.StartDate) : new Date(0);
      const dateB = b.StartDate ? new Date(b.StartDate) : new Date(0);
      return dateB.getTime() - dateA.getTime();
    })
    .slice(0, 5); // Take only the 5 most recent

  return (
    <Card className="mt-4 sm:mt-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-base sm:text-lg">Recently Started Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">Project Title</th>
                <th className="text-left py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap hidden sm:table-cell">Country</th>
                <th className="text-left py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">Status</th>
                <th className="text-left py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap hidden md:table-cell">Start Date</th>
                <th className="text-right py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">Budget</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <tr key={project.ProjectID} className="border-b">
                    <td className="py-2 sm:py-3 px-1 sm:px-2 max-w-[200px]">
                      <div className="truncate" title={project.ProjectTitle}>
                        {project.ProjectTitle}
                      </div>
                    </td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap hidden sm:table-cell">
                      {project.Countries?.split('; ')[0] || ''}
                    </td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap">
                      <span 
                        className={`inline-block px-1 sm:px-2 py-0.5 rounded text-xs ${
                          project.ApprovalStatus === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : project.ApprovalStatus === 'Pending' || project.ApprovalStatus === 'Pending Approval'
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {project.ApprovalStatus}
                      </span>
                    </td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 whitespace-nowrap hidden md:table-cell">{project.StartDate ? new Date(project.StartDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-2 sm:py-3 px-1 sm:px-2 text-right whitespace-nowrap">${typeof project.PAGValue === 'number' ? project.PAGValue.toLocaleString() : '0'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-gray-500">
                    No recent projects found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardRecentProjects;
