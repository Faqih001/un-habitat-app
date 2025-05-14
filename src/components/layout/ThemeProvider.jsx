"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Create a context for theme state with additional properties
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
  colorAccent: 'blue',
  changeColorAccent: () => {},
  isTransitioning: false
});

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

/**
 * Enhanced theme provider component to manage application dark/light mode and color accents
 */
const ThemeProvider = ({ children }) => {
  // Check if dark mode should be enabled by default (from local storage or system preference)
  const [isDarkMode, setIsDarkMode] = useState(false);
  // Add state for transitioning between themes to add animations
  const [isTransitioning, setIsTransitioning] = useState(false);
  // Add state for color accent theme
  const [colorAccent, setColorAccent] = useState('blue'); // 'blue', 'teal', 'coral', 'amber'
  
  useEffect(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem('theme');
    const storedAccent = localStorage.getItem('colorAccent');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && userPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    
    // Set color accent if stored
    if (storedAccent && ['blue', 'teal', 'coral', 'amber'].includes(storedAccent)) {
      setColorAccent(storedAccent);
      document.documentElement.classList.add(`accent-${storedAccent}`);
    } else {
      document.documentElement.classList.add('accent-blue'); // Default
    }
    
    // Add transition after initial load to prevent flash
    setTimeout(() => {
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-300');
    }, 100);
  }, []);
  
  // Toggle dark/light mode with smooth transition
  const toggleDarkMode = () => {
    setIsTransitioning(true);
    
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      
      // Update localStorage
      localStorage.setItem('theme', newMode ? 'dark' : 'light');
      
      // Update document class
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Reset transition state after animation completes
      setTimeout(() => setIsTransitioning(false), 300);
      
      return newMode;
    });
  };
  
  // Change color accent theme
  const changeColorAccent = (accent) => {
    if (['blue', 'teal', 'coral', 'amber'].includes(accent)) {
      // Remove all accent classes
      document.documentElement.classList.remove('accent-blue', 'accent-teal', 'accent-coral', 'accent-amber');
      // Add new accent class
      document.documentElement.classList.add(`accent-${accent}`);
      // Update state and localStorage
      setColorAccent(accent);
      localStorage.setItem('colorAccent', accent);
    }
  };
  
  // Provide theme context to children with enhanced properties
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
        colorAccent,
        changeColorAccent,
        isTransitioning
      }}
    >
      <div className={`${isTransitioning ? 'theme-transition' : ''}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );

export default ThemeProvider; 