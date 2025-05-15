
import React from 'react';
import { format } from 'date-fns';
import { ProjectData } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProjectDetailsProps {
  project: ProjectData;
  onClose: () => void;
  onEdit: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose, onEdit }) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-un-blue text-white">
        <CardTitle className="text-2xl">{project.ProjectTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Country</h3>
              <p className="text-lg">{project.Countries}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Lead Organization Unit</h3>
              <p className="text-lg">{project.LeadOrgUnit}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Theme</h3>
              <p className="text-lg">{project.Themes}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Approval Status</h3>
              <p>
                <span 
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    project.ApprovalStatus === 'Approved' 
                      ? 'bg-green-100 text-green-800' 
                      : project.ApprovalStatus === 'Pending' 
                      ? 'bg-yellow-100 text-yellow-800' 
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {project.ApprovalStatus}
                </span>
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Start Date</h3>
              <p className="text-lg">{formatDate(project.StartDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">End Date</h3>
              <p className="text-lg">{formatDate(project.EndDate)}</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Budget</h3>
              <p className="text-lg">${project.PAGValue?.toLocaleString() || '0'} USD</p>
            </div>
            
            <div>
              <h3 className="text-sm font-medium text-gray-500">Project ID</h3>
              <p className="text-lg">{project.ProjectID}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-2">Fund</h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {project.Fund || 'No fund information provided.'}
          </p>
        </div>
        
        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button onClick={onEdit}>
            Edit Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
