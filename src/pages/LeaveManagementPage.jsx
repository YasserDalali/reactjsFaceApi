import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import AnimatedComponent from '../components/AnimatedComponent';
import LeaveManagementTable from '../components/LeaveManagementTable';
import LeaveCalendar from '../components/LeaveCalendar';

// Mock data for the calendar
const mockAbsences = [
  {
    id: 1,
    employee: 'John Doe',
    leaveType: 'Vacation',
    startDate: '2025-01-15',
    endDate: '2025-01-20',
    status: 'Approved'
  },
  {
    id: 2,
    employee: 'Jane Smith',
    leaveType: 'Sick Leave',
    startDate: '2025-01-18',
    endDate: '2025-01-19',
    status: 'Approved'
  },
  {
    id: 3,
    employee: 'Mike Johnson',
    leaveType: 'Personal',
    startDate: '2025-01-25',
    endDate: '2025-01-26',
    status: 'Pending'
  },
  {
    id: 4,
    employee: 'Sarah Williams',
    leaveType: 'Vacation',
    startDate: '2025-01-01',
    endDate: '2025-01-10',
    status: 'Approved'
  },
  {
    id: 5,
    employee: 'David Brown',
    leaveType: 'Other',
    startDate: '2025-01-22',
    endDate: '2024-03-23',
    status: 'Approved'
  }
];

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <AnimatedComponent>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Leave Management
        </h1>
      </AnimatedComponent>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnimatedComponent delay={0.1}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Total Requests
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {leaveRequests.length}
            </p>
          </div>
        </AnimatedComponent>

        <AnimatedComponent delay={0.2}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Pending Requests
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {leaveRequests.filter(req => req.status === 'Pending').length}
            </p>
          </div>
        </AnimatedComponent>

        <AnimatedComponent delay={0.3}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Approved Leaves
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {leaveRequests.filter(req => req.status === 'Approved').length}
            </p>
          </div>
        </AnimatedComponent>
      </div>

      {/* Leave Management Table */}
      <LeaveManagementTable leaveData={leaveData} />

      {/* Calendar View */}
      <div className="mt-6">
        <LeaveCalendar absences={mockAbsences} />
      </div>
    </motion.div>
  );
};

const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

export default LeaveManagementPage; 