import React from 'react';
import { Link } from 'react-router-dom';
import { User, Clock, Camera, Home, Calendar, Settings } from 'lucide-react'; // Added Settings icon

const Sidebar = () => {
  return (
    <div className="h-100 min-h-screen bg-gray-800 text-white p-4 z-50">


      <div className='flex flex-col justify-between h-full'>

      <div className="space-y-6 ">
        {/* Dashboard Link */}
        <Link to="/" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <Home size={20} />
        </Link>

        {/* Leave Management Link */}
        <Link to="/leave-management" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <Calendar size={20} />
        </Link>

        {/* Employee Page Link */}
        <Link to="/employees" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <User width={20} height={20} />
        </Link>

        {/* Attendance Page Link */}
        <Link to="/attendance" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <Clock size={20} />
        </Link>

        {/* Face Detection Link */}
        <Link to="/facedetection" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <Camera size={20} />
        </Link>
      </div>

   

      {/* Settings Link at the bottom */}
      <div className="mt-auto">
        <Link to="/settings" className="flex items-center justify-center text-lg hover:bg-gray-700 p-2 rounded">
          <Settings size={20} />
        </Link>
      </div>

      </div>
    </div>
  );
};

export default Sidebar;
