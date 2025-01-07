import React from 'react';
import LeaveManagementTable from '../components/LeaveManagementTable';

const LeaveManagementPage = () => {
  // Sample data - replace with your actual data source
  const leaveData = [
    {
      employee: 'John Doe',
      leaveType: 'Sick Leave',
      startDate: '2024-03-01',
      endDate: '2024-03-03',
      duration: 3,
      status: 'Pending',
    },
    {
      employee: 'Jane Smith',
      leaveType: 'Vacation',
      startDate: '2024-03-15',
      endDate: '2024-03-22',
      duration: 8,
      status: 'Approved',
    },
    {
      employee: 'Mike Johnson',
      leaveType: 'Personal',
      startDate: '2024-03-10',
      endDate: '2024-03-10',
      duration: 1,
      status: 'Rejected',
    },
    // Add more sample data as needed
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
        Leave Management
      </h1>
      <LeaveManagementTable leaveData={leaveData} />
    </div>
  );
};

export default LeaveManagementPage; 