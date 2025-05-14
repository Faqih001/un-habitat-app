"use client";

import { motion } from 'framer-motion';
import Card from './Card';

/**
 * StatCard component for displaying statistical information
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Card title
 * @param {string|number} props.value - Main stat value
 * @param {string} props.description - Optional description
 * @param {ReactNode} props.icon - Optional icon
 * @param {string} props.trend - Trend direction: 'up', 'down', 'neutral'
 * @param {string} props.trendValue - Value of the trend (e.g., "+12%")
 * @param {string} props.variant - Card style variant
 * @param {boolean} props.loading - Whether the card is in loading state
 * @param {string} props.className - Additional CSS classes
 */
const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  variant = 'default',
  loading = false,
  className = '',
  ...props
}) => {
  // Define trend styles
  const trendStyles = {
    up: 'text-green-500 dark:text-green-400',
    down: 'text-red-500 dark:text-red-400',
    neutral: 'text-gray-500 dark:text-gray-400'
  };
  
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };
  
  // Value animation variants
  const valueVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        delay: 0.2,
        type: "spring", 
        stiffness: 100 
      }
    }
  };

  // Render loading skeleton
  if (loading) {
    return (
      <Card variant={variant} className={`h-full ${className}`} {...props}>
        <div className="p-5 h-full">
          <div className="skeleton h-4 w-16 mb-4 rounded"></div>
          <div className="skeleton h-8 w-24 mb-2 rounded"></div>
          <div className="skeleton h-4 w-32 rounded"></div>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={cardVariants}
      className="h-full"
    >
      <Card variant={variant} className={`h-full ${className}`} {...props}>
        <div className="p-5 h-full">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                {title}
              </h3>
              <motion.div variants={valueVariants} className="font-display">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  {value}
                </span>
              </motion.div>
              
              {description && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {description}
                </p>
              )}
              
              {trend && trendValue && (
                <div className="mt-2 flex items-center">
                  <span className={`text-sm font-medium ${trendStyles[trend]}`}>
                    {trendValue}
                  </span>
                  {trend === 'up' && (
                    <svg className={`ml-1 w-3 h-3 ${trendStyles[trend]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                  {trend === 'down' && (
                    <svg className={`ml-1 w-3 h-3 ${trendStyles[trend]}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                </div>
              )}
            </div>
            
            {icon && (
              <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                {icon}
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default StatCard; 