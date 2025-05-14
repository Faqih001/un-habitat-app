"use client";

import { motion } from 'framer-motion';

/**
 * Card component with multiple style variants and animation options
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Card content
 * @param {string} props.variant - Card style variant: 'default', 'glass', 'neu', 'outlined'
 * @param {boolean} props.hoverable - Whether the card should have hover effects
 * @param {boolean} props.animate - Whether the card should have animation
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler function
 */
const Card = ({ 
  children, 
  variant = 'default',
  hoverable = false,
  animate = false,
  className = '',
  onClick,
  ...props 
}) => {
  // Base card styles based on variant
  const variantClasses = {
    default: 'bg-white dark:bg-slate-800 shadow-lg',
    glass: 'bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-glass',
    neu: 'bg-gray-100 dark:bg-slate-800 shadow-neu-light dark:shadow-neu-dark',
    outlined: 'bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700'
  };
  
  // Hover effect styles
  const hoverClasses = hoverable ? 
    'transition-all duration-300 hover:shadow-xl hover:-translate-y-1' : '';
  
  // Animation variants for Framer Motion
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.4,
        ease: "easeOut"
      } 
    }
  };
  
  // Combine all classes
  const cardClasses = `rounded-xl overflow-hidden ${variantClasses[variant]} ${hoverClasses} ${className}`;
  
  // If animation is enabled, wrap with motion component
  if (animate) {
    return (
      <motion.div
        className={cardClasses}
        initial="hidden"
        animate="visible"
        variants={cardVariants}
        onClick={onClick}
        whileHover={hoverable ? { scale: 1.02 } : {}}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  
  // Otherwise, render as a regular div
  return (
    <div 
      className={cardClasses}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardBody = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`px-6 py-4 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardFooter = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`px-6 py-4 border-t border-gray-200 dark:border-gray-700 ${className}`} 
      {...props}
    >
      {children}
    </div>
  );
};

export default Card; 