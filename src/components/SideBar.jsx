import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User, Clock, Camera, Home, Calendar, Settings, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/', icon: Home, label: 'Dashboard' },
    { path: '/admin/leave-management', icon: Calendar, label: 'Leave Management' },
    { path: '/admin/employees', icon: User, label: 'Employees' },
    { path: '/admin/attendance', icon: Clock, label: 'Attendance' },
    { path: '/admin/facedetection', icon: Camera, label: 'Face Detection' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
  ];

  const isActive = (path) => location.pathname === path;

  const menuItemVariants = {
    hover: {
      scale: 1.1,
      transition: {
        duration: 0.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <aside className="fixed  h-screen w-16 flex flex-col bg-white dark:bg-neutral-800 border-r border-gray-200 dark:border-neutral-700 z-50">
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-neutral-700">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-xl">F</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4">
        <div className="px-2 space-y-2">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.path}
              variants={menuItemVariants}
              whileHover="hover"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1,
                ease: [0.4, 0, 0.2, 1]
              }}
            >
              <Link
                to={item.path}
                className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-lg
                  transition-colors duration-200 ease-in-out group
                  ${isActive(item.path)
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
                  }`}
              >
                <item.icon size={20} />
                
                {/* Tooltip */}
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs
                  rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 whitespace-nowrap z-50">
                  {item.label}
                  {/* Triangle */}
                  <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent
                    border-r-gray-900"></div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </nav>

      {/* Settings */}
      <div className="p-2 border-t border-gray-200 dark:border-neutral-700">
        <Link
          to="/settings"
          className={`relative flex items-center justify-center h-10 w-10 mx-auto rounded-lg
            transition-all duration-200 ease-in-out group
            ${isActive('/settings')
              ? 'bg-blue-500 text-white'
              : 'text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-700'
            }`}
        >
          <Settings 
            size={20} 
            className={`transition-transform duration-200 group-hover:scale-110
              ${isActive('/admin/settings') ? 'transform scale-110' : ''}`}
          />
          
          {/* Settings Tooltip */}
          <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs
            rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible
            transition-all duration-200 whitespace-nowrap z-50">
            Settings
            <div className="absolute top-1/2 -left-1 -mt-1 border-4 border-transparent
              border-r-gray-900"></div>
          </div>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
