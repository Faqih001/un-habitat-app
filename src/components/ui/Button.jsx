"use client";

import { forwardRef } from 'react';
import { motion } from 'framer-motion';

/**
 * Button component with multiple variants and animation options
 * 
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Button content
 * @param {string} props.variant - Button style variant: 'primary', 'secondary', 'accent', 'outline', 'ghost'
 * @param {string} props.size - Button size: 'xs', 'sm', 'md', 'lg'
 * @param {boolean} props.fullWidth - Whether the button should take full width
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {boolean} props.isLoading - Whether the button is in loading state
 * @param {boolean} props.animate - Whether to add animation effects
 * @param {Function} props.onClick - Click handler function
 * @param {string} props.type - Button type attribute
 */
const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
  disabled = false,
  isLoading = false,
  animate = false,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  // Variant styles
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white focus:ring-secondary-400',
    accent: 'bg-accent-500 hover:bg-accent-600 text-white focus:ring-accent-400',
    outline: 'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 focus:ring-gray-300 dark:focus:ring-gray-600',
    ghost: 'bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200'
  };
  
  // Size styles
  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base'
  };
  
  // Width styles
  const widthClasses = fullWidth ? 'w-full' : '';
  
  // Disabled styles
  const disabledClasses = disabled || isLoading ? 
    'opacity-70 cursor-not-allowed pointer-events-none' : '';
  
  // Base button classes
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClasses} ${disabledClasses} ${className}`;
  
  // Framer Motion tap animation
  const tapAnimation = animate ? {
    whileTap: { scale: 0.98 },
    whileHover: { scale: 1.02 }
  } : {};
  
  // Loading spinner
  const LoadingSpinner = () => (
    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
  
  if (animate) {
    return (
      <motion.button
        ref={ref}
        type={type}
        className={buttonClasses}
        onClick={onClick}
        disabled={disabled || isLoading}
        {...tapAnimation}
        {...props}
      >
        {isLoading && <LoadingSpinner />}
        {children}
      </motion.button>
    );
  }
  
  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <LoadingSpinner />}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button; 