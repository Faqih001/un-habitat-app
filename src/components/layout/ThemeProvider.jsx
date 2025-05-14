"use client";

import { createContext, useContext, useEffect, useState } from 'react';

// Create a context for theme state
const ThemeContext = createContext({
  isDarkMode: false,
  toggleDarkMode: () => {},
});

// Hook for using the theme context
export const useTheme = () => useContext(ThemeContext);

/**
 * Theme provider component to manage application dark/light mode
 */
const ThemeProvider = ({ children }) => {
  // Check if dark mode should be enabled by default (from local storage or system preference)
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    // Check local storage first
    const storedTheme = localStorage.getItem('theme');
    const userPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (storedTheme === 'dark' || (!storedTheme && userPrefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    
    // Add transition after initial load to prevent flash
    setTimeout(() => {
      document.documentElement.classList.add('transition-colors');
      document.documentElement.classList.add('duration-300');
    }, 100);
  }, []);
  
  // Toggle dark/light mode
  const toggleDarkMode = () => {
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
      
      return newMode;
    });
  };
  
  // Provide theme context to children
  return (
    <ThemeContext.Provider
      value={{
        isDarkMode,
        toggleDarkMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider; 