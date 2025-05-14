"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MoonIcon, 
  SunIcon, 
  MagnifyingGlassIcon,
  SwatchIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import { useTheme } from './ThemeProvider';

const Navbar = () => {
  const { isDarkMode, toggleDarkMode, colorAccent, changeColorAccent } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isColorMenuOpen, setIsColorMenuOpen] = useState(false);
  const pathname = usePathname();

  // Monitor scroll position
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setIsColorMenuOpen(false);
  }, [pathname]);

  // Close color menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isColorMenuOpen && !e.target.closest('.color-menu-container')) {
        setIsColorMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isColorMenuOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
  };

  const navLinks = [
    { name: 'Projects', href: '/' },
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'About', href: '/about' }
  ];

  const colorOptions = [
    { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
    { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
    { name: 'Coral', value: 'coral', class: 'bg-rose-500' },
    { name: 'Amber', value: 'amber', class: 'bg-amber-500' }
  ];

  const navbarVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };

  const mobileMenuVariants = {
    closed: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
    open: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
  };
  
  const colorMenuVariants = {
    closed: { opacity: 0, scale: 0.95, y: 5, transition: { duration: 0.2 } },
    open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 22 } }
  };

  return (
    <motion.nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border-b border-gray-200/50 dark:border-slate-700/50' : 'bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm'}`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <motion.div 
              className="h-9 w-9 rounded-lg bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center shadow-md"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-white font-bold text-lg">UN</span>
            </motion.div>
            <div className="flex flex-col">
              <span className="font-semibold text-lg text-gray-900 dark:text-white">UN-Habitat</span>
              <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">Project Management</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {/* Navigation Links */}
            <div className="flex space-x-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative font-medium text-sm transition-colors duration-200 ${pathname === link.href ? 'text-primary-600 dark:text-primary-400' : 'text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white'}`}
                >
                  {link.name}
                  {pathname === link.href && (
                    <motion.div 
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary-500"
                      layoutId="navbar-indicator"
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-40 lg:w-64 py-1.5 pl-8 pr-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300"
              />
              <MagnifyingGlassIcon className="absolute left-2.5 top-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </form>

            {/* Theme Controls */}
            <div className="flex space-x-2">
              {/* Color Theme Selector */}
              <div className="relative color-menu-container">
                <button
                  onClick={() => setIsColorMenuOpen(!isColorMenuOpen)}
                  className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center"
                  aria-label="Change color theme"
                >
                  <SwatchIcon className="h-5 w-5" />
                  <ChevronDownIcon className={`h-3.5 w-3.5 ml-0.5 transition-transform ${isColorMenuOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {isColorMenuOpen && (
                    <motion.div
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg py-2 z-50 border border-gray-200 dark:border-gray-700"
                      initial="closed"
                      animate="open"
                      exit="closed"
                      variants={colorMenuVariants}
                    >
                      <div className="px-3 py-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-700 mb-1">
                        Color Theme
                      </div>
                      {colorOptions.map((option) => (
                        <button
                          key={option.value}
                          className={`flex items-center w-full px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700/50 ${colorAccent === option.value ? 'text-primary-600 dark:text-primary-400 font-medium' : 'text-gray-700 dark:text-gray-300'}`}
                          onClick={() => {
                            changeColorAccent(option.value);
                            setIsColorMenuOpen(false);
                          }}
                        >
                          <span className={`w-4 h-4 rounded-full mr-2.5 ${option.class}`}></span>
                          {option.name}
                          {colorAccent === option.value && (
                            <motion.span 
                              layoutId="selected-color-indicator"
                              className="ml-auto w-1 h-4 bg-primary-500 dark:bg-primary-400 rounded-full" 
                            />
                          )}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Dark Mode Toggle */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
                aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <SunIcon className="h-5 w-5" />
                ) : (
                  <MoonIcon className="h-5 w-5" />
                )}
              </motion.button>
            </div>
          </div>

          {/* Mobile Navigation Controls */}
          <div className="flex items-center md:hidden space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? (
                <SunIcon className="h-4 w-4" />
              ) : (
                <MoonIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          className="md:hidden bg-white dark:bg-slate-900 shadow-lg"
          initial="closed"
          animate="open"
          variants={mobileMenuVariants}
        >
          <div className="px-4 pt-2 pb-4 space-y-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 pl-9 pr-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
            </form>
            
            {/* Mobile Links */}
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`block py-2 px-3 rounded-lg text-sm font-medium ${
                    pathname === link.href
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar; 