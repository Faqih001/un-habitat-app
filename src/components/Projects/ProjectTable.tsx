
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
        
        <div className="border rounded-md overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[50px] hidden sm:table-cell">ID</TableHead>
                <TableHead className="min-w-[200px]">Title</TableHead>
                <TableHead className="hidden md:table-cell">Country</TableHead>
                <TableHead className="hidden lg:table-cell">Lead Org Unit</TableHead>
                <TableHead className="min-w-[90px]">Status</TableHead>
                <TableHead className="w-[100px] hidden sm:table-cell">Budget</TableHead>
                <TableHead className="text-right w-[100px] sm:w-[140px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((project) => (
                <TableRow key={project.ProjectID}>
                  <TableCell className="font-medium hidden sm:table-cell">{project.ProjectID}</TableCell>
                  <TableCell>
                    <div className="max-w-[200px] sm:max-w-[300px] truncate" title={project.ProjectTitle}>
                      {project.ProjectTitle}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{project.Countries?.split('; ')[0] || ''}</TableCell>
                  <TableCell className="hidden lg:table-cell">{project.LeadOrgUnit}</TableCell>
                  <TableCell>
                    <span 
                      className={`inline-block px-1 sm:px-2 py-0.5 sm:py-1 rounded text-xs ${
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
                  <TableCell className="hidden sm:table-cell">
                    ${project.PAGValue?.toLocaleString() || '0'}
                  </TableCell>
                  <TableCell className="text-right py-1">
                    <div className="flex justify-end space-x-0 sm:space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onView(project)}
                        title="View details"
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onEdit(project)}
                        title="Edit project"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
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
        <div className="flex flex-col sm:flex-row justify-between items-center mt-4 gap-3">
          <div className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
            Showing {Math.min((page - 1) * pageSize + 1, projects.length)} to{" "}
            {Math.min(page * pageSize, projects.length)} of {projects.length} entries
          </div>
          <div className="flex items-center space-x-1 sm:space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-8 px-2 sm:px-3"
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Prev
            </Button>
            <div className="text-xs sm:text-sm px-1">
              {page} / {totalPages || 1}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="text-xs sm:text-sm h-8 px-2 sm:px-3"
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
