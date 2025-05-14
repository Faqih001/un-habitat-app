"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

/**
 * Enhanced StatCard component for displaying statistical information with animations
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main stat value
 * @param {string} props.description - Optional description
 * @param {ReactNode} props.icon - Optional icon
 * @param {string} props.trend - Trend direction: 'up', 'down', 'neutral'
 * @param {string} props.trendValue - Value of the trend (e.g., "+12%")
 * @param {string} props.variant - Card style variant: 'default', 'glass', 'gradient'
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.className - Additional CSS classes
 */
const StatCard = ({
  title,
  value,
  description,
  icon,
  trend = 'neutral',
  trendValue,
  variant = 'default',
  loading = false,
  onClick,
  className = '',
  ...props
}) => {
  // Define state for hover to animate elements
  const [isHovered, setIsHovered] = useState(false);
  
  // Define trend styles
  const trendStyles = {
    up: 'text-green-500 dark:text-green-400',
    down: 'text-red-500 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };
  
  // Define variant styles
  const variantStyles = {
    default: 'bg-white dark:bg-slate-800 shadow-md hover:shadow-lg',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-slate-700/50',
    gradient: 'bg-gradient-to-br from-primary-500 to-primary-700 text-white shadow-lg'
  };
  
  // Card animation variants
  const cardVariants = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    hover: { y: -5, transition: { duration: 0.2 } },
    tap: { y: 0, scale: 0.98, transition: { duration: 0.1 } }
  };
  
  // Value counter animation
  const counterAnimation = {
    initial: { opacity: 0, y: 10 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4, 
        delay: 0.2,
        type: "spring",
        stiffness: 100
      }
    }
  };
  
  // Get card style based on variant
  const cardStyle = variantStyles[variant] || variantStyles.default;
  
  // Get trend icon based on direction
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />;
      case 'down':
        return <ArrowDownIcon className="h-4 w-4" aria-hidden="true" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`rounded-xl overflow-hidden transition-all duration-300 ${cardStyle} ${className}`}
      initial="initial"
      animate="animate"
      whileHover="hover"
      whileTap="tap"
      variants={cardVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      {...props}
    >
      <div className="p-6">
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className={`text-sm font-medium ${variant === 'gradient' ? 'text-white/90' : 'text-gray-600 dark:text-gray-300'}`}>
            {title}
          </h3>
          
          {icon && (
            <div className={`rounded-full p-2 ${
              variant === 'gradient' 
                ? 'bg-white/10 text-white' 
                : 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
            }`}>
              {icon}
            </div>
          )}
        </div>
        
        {/* Main value with animation */}
        <div className="flex items-end mb-2">
          {loading ? (
            <div className="h-8 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ) : (
            <motion.div 
              className={`text-2xl sm:text-3xl font-bold ${variant === 'gradient' ? 'text-white' : 'text-gray-900 dark:text-white'}`}
              variants={counterAnimation}
            >
              {value}
            </motion.div>
          )}
        </div>
        
        {/* Description and trend indicator */}
        <div className="flex items-center justify-between">
          {description && (
            <p className={`text-sm ${variant === 'gradient' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
              {description}
            </p>
          )}
          
          {trendValue && (
            <div className={`flex items-center space-x-1 text-sm font-medium ${variant === 'gradient' ? 'text-white' : trendStyles[trend]}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>
        
        {/* Action indicator that appears on hover */}
        {onClick && (
          <motion.div 
            className="mt-4 flex items-center text-sm font-medium"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className={variant === 'gradient' ? 'text-white/90' : 'text-primary-600 dark:text-primary-400'}>
              View Details
            </span>
            <ChevronRightIcon className={`ml-1 h-4 w-4 ${variant === 'gradient' ? 'text-white/90' : 'text-primary-600 dark:text-primary-400'}`} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default StatCard;
