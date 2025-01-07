import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Navbar = () => {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  // Get current page title based on route
  const getPageTitle = (pathname) => {
    const path = pathname.split('/')[1];
    if (!path) return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  useEffect(() => {
    // Check for system preference first
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('darkMode');
    
    // Use saved preference if exists, otherwise use system preference
    const isDarkMode = savedTheme !== null ? savedTheme === 'true' : systemPrefersDark;
    
    setDarkMode(isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <nav className="fixed top-0 right-0 left-16 h-16 bg-white dark:bg-neutral-800 border-b border-gray-200 dark:border-neutral-700 z-40 transition-colors duration-200">
      <div className="h-full px-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white transition-colors duration-200">
          {getPageTitle(location.pathname)}
        </h1>
        
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-700 transition-all duration-200 text-gray-600 dark:text-gray-300"
          aria-label="Toggle dark mode"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 transition-transform duration-200 hover:rotate-12" />
          ) : (
            <Moon className="h-5 w-5 transition-transform duration-200 hover:-rotate-12" />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar; 