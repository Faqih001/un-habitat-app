"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowTopRightOnSquareIcon, 
  PencilSquareIcon, 
  TrashIcon,
  CalendarIcon, 
  MapPinIcon,
  CurrencyDollarIcon,
  ChevronRightIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';
import { staggerItem, glassCardHover } from '@/lib/framer-motion';

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
  const [isHovered, setIsHovered] = useState(false);
  
  const {
    ProjectID,
    ProjectTitle,
    ApprovalStatus,
    StartDate,
    EndDate,
    PAGValue,
    LeadOrgUnit,
    countries = [],
    themes = []
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

  // Format date to readable format
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };
  
  // Determine status color
  const statusColors = {
    'Approved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    'Pending Approval': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
    'Rejected': 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    'Completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  };
  
  const statusColor = statusColors[ApprovalStatus] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
  
  // Enhanced card animations
  const cardVariants = {
    ...glassCardHover,
    rest: { 
      y: 0, 
      opacity: 1, 
      transition: { duration: 0.3, ease: "easeOut" } 
    },
    hover: { 
      y: -8, 
      boxShadow: "0 15px 30px rgba(0,0,0,0.1)",
      transition: { duration: 0.3, ease: "easeInOut" } 
    }
  };
  
  // Content animation for staggered reveal
  const contentVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      className="h-full"
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="h-full rounded-xl overflow-hidden bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-gray-100 dark:border-slate-700/50 shadow-md transition-all duration-300 group-hover:shadow-xl">
        <div className="p-5 flex flex-col h-full">
          {/* Header with animated reveal */}
          <motion.div 
            className="flex justify-between items-start mb-3"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.span 
              className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusColor}`}
              variants={itemVariants}
            >
              {ApprovalStatus}
            </motion.span>
            <motion.span 
              className="text-sm text-gray-500 font-mono"
              variants={itemVariants}
            >
              {ProjectID}
            </motion.span>
          </motion.div>
          
          {/* Title with animation */}
          <motion.h3 
            className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2"
            variants={staggerItem}
          >
            {ProjectTitle}
          </motion.h3>
          
          {/* Details with icons */}
          <motion.div 
            className="space-y-3 mb-4 flex-grow"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
          >
            {LeadOrgUnit && (
              <motion.div 
                className="flex items-center text-sm"
                variants={itemVariants}
              >
                <BuildingOfficeIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {LeadOrgUnit}
                </span>
              </motion.div>
            )}
            
            {countries.length > 0 && (
              <motion.div 
                className="flex items-center text-sm"
                variants={itemVariants}
              >
                <MapPinIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300 truncate">
                  {countries.slice(0, 2).join(', ')}
                  {countries.length > 2 && ` +${countries.length - 2}`}
                </span>
              </motion.div>
            )}
            
            {StartDate && EndDate && (
              <motion.div 
                className="flex items-center text-sm"
                variants={itemVariants}
              >
                <CalendarIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-gray-600 dark:text-gray-300">
                  {formatDate(StartDate)} - {formatDate(EndDate)}
                </span>
              </motion.div>
            )}
            
            {PAGValue && (
              <motion.div 
                className="flex items-center"
                variants={itemVariants}
              >
                <CurrencyDollarIcon className="h-4 w-4 text-primary-500 mr-2 flex-shrink-0" />
                <span className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {formatBudget(PAGValue)}
                </span>
              </motion.div>
            )}
            
            {/* Themes as tags */}
            {themes.length > 0 && (
              <motion.div 
                className="flex flex-wrap gap-1.5 mt-3"
                variants={itemVariants}
              >
                {themes.slice(0, 2).map(theme => (
                  <span 
                    key={theme} 
                    className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                  >
                    {theme}
                  </span>
                ))}
                {themes.length > 2 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                    +{themes.length - 2}
                  </span>
                )}
              </motion.div>
            )}
          </motion.div>
          
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
