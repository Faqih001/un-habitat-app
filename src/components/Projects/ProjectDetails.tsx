
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
      <CardHeader className="bg-un-blue text-white py-3 sm:py-4">
        <CardTitle className="text-lg sm:text-xl md:text-2xl break-words">{project.ProjectTitle}</CardTitle>
      </CardHeader>
      <CardContent className="pt-4 sm:pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Country</h3>
              <p className="text-sm sm:text-base md:text-lg break-words">{project.Countries}</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Lead Organization Unit</h3>
              <p className="text-sm sm:text-base md:text-lg break-words">{project.LeadOrgUnit}</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Theme</h3>
              <p className="text-sm sm:text-base md:text-lg break-words">{project.Themes}</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Approval Status</h3>
              <p>
                <span 
                  className={`inline-block px-2 py-1 rounded text-xs sm:text-sm ${
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
          
          <div className="space-y-3 sm:space-y-4">
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Start Date</h3>
              <p className="text-sm sm:text-base md:text-lg">{formatDate(project.StartDate)}</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">End Date</h3>
              <p className="text-sm sm:text-base md:text-lg">{formatDate(project.EndDate)}</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Budget</h3>
              <p className="text-sm sm:text-base md:text-lg">${project.PAGValue?.toLocaleString() || '0'} USD</p>
            </div>
            
            <div>
              <h3 className="text-xs sm:text-sm font-medium text-gray-500">Project ID</h3>
              <p className="text-sm sm:text-base md:text-lg">{project.ProjectID}</p>
            </div>
          </div>
        </div>
        
        <Separator className="my-4 sm:my-6" />
        
        <div>
          <h3 className="text-xs sm:text-sm font-medium text-gray-500 mb-2">Fund</h3>
          <p className="text-xs sm:text-sm text-gray-700 whitespace-pre-wrap break-words">
            {project.Fund || 'No fund information provided.'}
          </p>
        </div>
        
        <div className="flex justify-end space-x-3 sm:space-x-4 mt-6 sm:mt-8">
          <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-10" onClick={onClose}>
            Close
          </Button>
          <Button size="sm" className="text-xs sm:text-sm h-8 sm:h-10" onClick={onEdit}>
            Edit Project
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectDetails;
