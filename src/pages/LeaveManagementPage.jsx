import React from 'react';
import { useSelector } from 'react-redux';
import LeaveManagementTable from '../components/LeaveManagementTable';

const LeaveManagementPage = () => {
  const leaveRequests = useSelector((state) => state.leaveRequests);
  const employees = useSelector((state) => state.employees);

  // Combine leave requests with employee data
  const leaveData = leaveRequests.map(request => {
    const employee = employees.find(emp => emp.id === request.employeeId);
    return {
      id: request.requestId,
      employee: employee?.name || 'Unknown',
      leaveType: request.type,
      startDate: request.startDate,
      endDate: request.endDate,
      duration: calculateDuration(request.startDate, request.endDate),
      status: request.status,
    };
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
        Leave Management
      </h1>
      <LeaveManagementTable leaveData={leaveData} />
    </div>
  );
};

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default LeaveManagementPage; 