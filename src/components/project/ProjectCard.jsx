"use client";

import { motion } from 'framer-motion';
import { ArrowTopRightOnSquareIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';
import { glassCardHover } from '@/lib/framer-motion';

/**
 * ProjectCard component for displaying project information in a card format
 * Used for grid view in the project list
 * 
 * @param {Object} props - Component props
 * @param {Object} props.project - Project data object
 * @param {Function} props.onEdit - Edit handler function
 * @param {Function} props.onDelete - Delete handler function  
 * @param {Function} props.onView - View handler function
 */
const ProjectCard = ({ project, onView, onEdit, onDelete }) => {
  const {
    ProjectID,
    ProjectTitle,
    ApprovalStatus,
    StartDate,
    EndDate,
    PAGValue,
    LeadOrgUnit,
    countries = []
  } = project;

  // Format budget to readable format
  const formatBudget = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      notation: 'compact',
      maximumFractionDigits: 1
    }).format(value || 0);
  };
  
  // Determine status color
  const statusColors = {
    'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Pending Approval': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
  
  const statusColor = statusColors[ApprovalStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';

  return (
    <motion.div
      className="h-full"
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={glassCardHover}
    >
      <div className="h-full rounded-xl overflow-hidden bg-white dark:bg-slate-800/90 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 shadow-lg">
        <div className="p-5 flex flex-col h-full">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}>
              {ApprovalStatus}
            </span>
            <span className="text-sm text-gray-500 font-mono">{ProjectID}</span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
            {ProjectTitle}
          </h3>
          
          {/* Details */}
          <div className="space-y-2 mb-3 flex-grow">
            {LeadOrgUnit && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Lead: </span>{LeadOrgUnit}
              </p>
            )}
            
            {countries.length > 0 && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Countries: </span>
                <span className="line-clamp-1">{countries.slice(0, 3).join(', ')}{countries.length > 3 ? ` +${countries.length - 3} more` : ''}</span>
              </p>
            )}
            
            {StartDate && EndDate && (
              <p className="text-sm text-gray-600 dark:text-gray-300">
                <span className="font-medium">Duration: </span>
                {new Date(StartDate).toLocaleDateString()} - {new Date(EndDate).toLocaleDateString()}
              </p>
            )}
            
            {PAGValue && (
              <p className="text-lg font-bold mt-2 text-primary-600 dark:text-primary-400">
                {formatBudget(PAGValue)}
              </p>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-slate-700/50">
            <motion.button
              onClick={() => onView(project)}
              className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-400 flex items-center text-sm font-medium"
              whileHover={{ x: 2 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              View Details
              <ArrowTopRightOnSquareIcon className="w-4 h-4 ml-1" />
            </motion.button>
            
            <div className="flex space-x-2">
              <motion.button
                onClick={() => onEdit(project)}
                className="p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-primary-50 dark:text-gray-400 dark:hover:text-primary-400 dark:hover:bg-primary-900/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <PencilSquareIcon className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                onClick={() => onDelete(project.ProjectID)}
                className="p-1.5 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 dark:text-gray-400 dark:hover:text-red-400 dark:hover:bg-red-900/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <TrashIcon className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;
