import React from 'react';
import { useParams } from 'react-router-dom';
import { User, Coffee } from 'lucide-react';

const ProfilePage = () => {
  const { id } = useParams();
  
  // This would normally come from your data store
  const employeeData = {
    id: id,
    name: "John Doe",
    email: "john.doe@example.com",
    position: "Software Engineer",
    department: "Engineering",
    startDate: "2023-01-15",
    leaveBalance: 15,
    attendance: {
      present: 45,
      absent: 3,
      late: 2
    },
    leaves: [
      { type: "Vacation", status: "Approved", duration: "3 days", date: "2024-02-15" },
      { type: "Sick Leave", status: "Completed", duration: "1 day", date: "2024-01-10" }
    ],
    breaks: [
      { 
        date: "2024-03-18",
        breaks: [
          { startTime: "10:30", endTime: "10:45", duration: "15min", type: "Coffee Break" },
          { startTime: "13:00", endTime: "14:00", duration: "1hr", type: "Lunch Break" },
          { startTime: "15:30", endTime: "15:45", duration: "15min", type: "Coffee Break" }
        ]
      },
      { 
        date: "2024-03-17",
        breaks: [
          { startTime: "10:15", endTime: "10:30", duration: "15min", type: "Coffee Break" },
          { startTime: "13:00", endTime: "13:45", duration: "45min", type: "Lunch Break" }
        ]
      }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Profile Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          <div className="bg-gray-100 dark:bg-neutral-700 rounded-full p-4">
            <User size={64} className="text-gray-600 dark:text-neutral-300" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {employeeData.name}
            </h1>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600 dark:text-neutral-300">{employeeData.position}</p>
                <p className="text-gray-600 dark:text-neutral-300">{employeeData.department}</p>
              </div>
              <div>
                <p className="text-gray-600 dark:text-neutral-300">
                  Employee ID: {employeeData.id}
                </p>
                <p className="text-gray-600 dark:text-neutral-300">
                  {employeeData.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Leave Balance
          </h3>
          <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
            {employeeData.leaveBalance} days
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Attendance Rate
          </h3>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">
            {Math.round((employeeData.attendance.present / 
              (employeeData.attendance.present + employeeData.attendance.absent)) * 100)}%
          </p>
        </div>
        
        <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Late Arrivals
          </h3>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
            {employeeData.attendance.late}
          </p>
        </div>
      </div>

      {/* Recent Leaves */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Leaves
        </h3>
        <div className="divide-y divide-gray-200 dark:divide-neutral-700">
          {employeeData.leaves.map((leave, index) => (
            <div key={index} className="py-4 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-900 dark:text-white">{leave.type}</p>
                <p className="text-sm text-gray-600 dark:text-neutral-300">{leave.date}</p>
              </div>
              <div className="flex items-center">
                <span className={`px-3 py-1 rounded-full text-sm font-medium
                  ${leave.status === 'Approved' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 
                    'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'}`}>
                  {leave.status}
                </span>
                <span className="ml-4 text-sm text-gray-600 dark:text-neutral-300">
                  {leave.duration}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Break Schedule Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <Coffee className="text-gray-600 dark:text-neutral-300" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Break Schedule
          </h3>
        </div>

        <div className="space-y-6">
          {employeeData.breaks.map((day, dayIndex) => (
            <div key={dayIndex} className="border-b border-gray-200 dark:border-neutral-700 last:border-0 pb-4 last:pb-0">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">
                {new Date(day.date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-neutral-700"></div>
                
                {/* Break items */}
                <div className="space-y-4">
                  {day.breaks.map((breakItem, breakIndex) => (
                    <div key={breakIndex} className="flex items-start ml-6">
                      {/* Timeline dot */}
                      <div className="absolute left-0 w-4 h-4 bg-blue-500 rounded-full border-2 border-white dark:border-neutral-800 mt-1"></div>
                      
                      {/* Break content */}
                      <div className="flex-1 bg-gray-50 dark:bg-neutral-900 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {breakItem.type}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                              Duration: {breakItem.duration}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {breakItem.startTime}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-neutral-400">
                              {breakItem.endTime}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage; 