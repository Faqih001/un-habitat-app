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
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Recently Started Projects</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2">Project Title</th>
                <th className="text-left py-3 px-2">Country</th>
                <th className="text-left py-3 px-2">Status</th>
                <th className="text-left py-3 px-2">Start Date</th>
                <th className="text-right py-3 px-2">Budget</th>
              </tr>
            </thead>
            <tbody>
              {recentProjects.length > 0 ? (
                recentProjects.map((project) => (
                  <tr key={project.ProjectID} className="border-b">
                    <td className="py-3 px-2">
                      {project.ProjectTitle}
                    </td>
                    <td className="py-3 px-2">{project.Countries?.split('; ')[0] || ''}</td>
                    <td className="py-3 px-2">
                      <span 
                        className={`inline-block px-2 py-0.5 rounded text-xs ${
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
                    <td className="py-3 px-2">{project.StartDate ? new Date(project.StartDate).toLocaleDateString() : 'N/A'}</td>
                    <td className="py-3 px-2 text-right">${typeof project.PAGValue === 'number' ? project.PAGValue.toLocaleString() : '0'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-gray-500">
                    No projects found
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
