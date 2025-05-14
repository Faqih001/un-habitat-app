"use client";

import { motion } from 'framer-motion';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

/**
 * Hero section component for the UN-Habitat project page
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Hero title
 * @param {string} props.subtitle - Hero subtitle
 * @param {Function} props.onScrollDown - Function to call when scroll down button is clicked
 */
const ProjectHero = ({ 
  title = "UN-Habitat Projects",
  subtitle = "Project Management and Visualization Platform", 
  onScrollDown 
}) => {
  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 dark:from-slate-900 dark:to-primary-900 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Decorative geometric shapes */}
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-primary-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        />
        <motion.div
          className="absolute bottom-10 -left-20 w-80 h-80 rounded-full bg-secondary-500/20"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        />
        
        {/* Subtle dot pattern overlay */}
        <div className="absolute inset-0 bg-dot-pattern opacity-10" />
      </div>
      
      {/* Hero content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl tracking-tight mb-4">
              {title}
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-8">
              {subtitle}
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
              <motion.button
                className="px-6 py-3 bg-white text-primary-700 font-medium rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Get Started
              </motion.button>
              <motion.button
                className="px-6 py-3 bg-primary-600/30 backdrop-blur-sm text-white border border-primary-400/30 font-medium rounded-xl shadow-md hover:bg-primary-600/40 transition-colors duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
          
          {/* Scroll down indicator */}
          {onScrollDown && (
            <motion.div 
              className="mt-8 sm:mt-12 flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
            >
              <motion.button
                onClick={onScrollDown}
                className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300"
                whileHover={{ y: 5 }}
              >
                <span className="text-sm mb-2">Scroll Down</span>
                <ChevronDownIcon className="h-6 w-6 animate-bounce" />
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectHero;
