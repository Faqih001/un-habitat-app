
import React, { useState } from 'react';
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ProjectData } from '@/services/api';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

interface ProjectTableProps {
  projects: ProjectData[];
  onView: (project: ProjectData) => void;
  onEdit: (project: ProjectData) => void;
  onDelete: (project: ProjectData) => void;
  isLoading: boolean;
}

const ProjectTable: React.FC<ProjectTableProps> = ({ 
  projects, 
  onView, 
  onEdit, 
  onDelete, 
  isLoading 
}) => {
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pageSizeOptions = [5, 10, 20, 50, 100];
  const totalPages = Math.ceil(projects.length / pageSize);
  const paginatedProjects = projects.slice((page - 1) * pageSize, page * pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (value: string) => {
    const newSize = parseInt(value, 10);
    setPageSize(newSize);
    setPage(1); // Reset to first page on page size change
  };

  const confirmDelete = (project: ProjectData) => {
    if (window.confirm(`Are you sure you want to delete "${project.ProjectTitle}"?`)) {
      onDelete(project);
      toast({
        title: "Project deleted",
        description: `${project.ProjectTitle} has been removed.`,
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid date';
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-12 text-center">
        <div className="animate-pulse">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <div className="text-lg font-semibold">Projects ({projects.length})</div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Show</span>
            <Select
              value={pageSize.toString()}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                {pageSizeOptions.map(size => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-gray-600">entries</span>
          </div>
        </div>
        
        <div className="border rounded-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead className="w-[300px]">Title</TableHead>
                <TableHead>Country</TableHead>
                <TableHead>Lead Org Unit</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[120px]">Budget</TableHead>
                <TableHead className="text-right w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((project) => (
                <TableRow key={project.ProjectID}>
                  <TableCell className="font-medium">{project.ProjectID}</TableCell>
                  <TableCell>{project.ProjectTitle}</TableCell>
                  <TableCell>{project.Countries?.split('; ')[0] || ''}</TableCell>
                  <TableCell>{project.LeadOrgUnit}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-block px-2 py-1 rounded text-xs ${
                        project.ApprovalStatus === 'Approved' 
                          ? 'bg-green-100 text-green-800' 
                          : project.ApprovalStatus === 'Pending' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {project.ApprovalStatus}
                    </span>
                  </TableCell>
                  <TableCell>
                    ${project.PAGValue?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(project)}
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(project)}
                        title="Edit project"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(project)}
                        title="Delete project"
                      >
                        <Trash2 className="h-4 w-4 text-red-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {paginatedProjects.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="h-24 text-center">
                    No projects found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Pagination controls */}
        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-gray-600">
            Showing {Math.min((page - 1) * pageSize + 1, projects.length)} to{" "}
            {Math.min(page * pageSize, projects.length)} of {projects.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <div className="text-sm">
              Page {page} of {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              disabled={page >= totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTable;
