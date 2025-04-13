import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AnimatedComponent from '../components/AnimatedComponent';
import AttendanceForm from '../components/AttendanceForm';
import LeaveForm from '../components/LeaveForm';
import { useFetchEmployees } from '../hooks/useFetchEmployees';

const AttendancePage = () => {
  const [isAttendanceFormOpen, setIsAttendanceFormOpen] = useState(false);
  const [isLeaveFormOpen, setIsLeaveFormOpen] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { employees, loading: loadingEmployees } = useFetchEmployees();

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const result = await mcp_supabase_execute_sql({
        project_id: "zfkdqglvibuxgjexkall",
        query: `
          SELECT 
            a.*,
            e.name as employee_name
          FROM attendance a
          JOIN employees e ON a.employee_id = e.id
          ORDER BY a.checkdate DESC
          LIMIT 100;
        `
      });

      if (result?.data) {
        setAttendanceRecords(result.data);
      }
      setError(null);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading || loadingEmployees) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <AnimatedComponent>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Attendance Management
          </h1>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsLeaveFormOpen(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Plan Leave
            </button>
            <button
              onClick={() => setIsAttendanceFormOpen(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Record Attendance
            </button>
          </div>
        </div>
      </AnimatedComponent>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnimatedComponent delay={0.1}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Total Records
            </h3>
            <p className="text-3xl font-bold text-gray-800 dark:text-white">
              {attendanceRecords.length}
            </p>
          </div>
        </AnimatedComponent>

        <AnimatedComponent delay={0.2}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              On Time
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {attendanceRecords.filter(record => record.status === 'on_time').length}
            </p>
          </div>
        </AnimatedComponent>

        <AnimatedComponent delay={0.3}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
            <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
              Late
            </h3>
            <p className="text-3xl font-bold text-yellow-600">
              {attendanceRecords.filter(record => record.status === 'late').length}
            </p>
          </div>
        </AnimatedComponent>
      </div>

      {/* Forms */}
      <AttendanceForm
        isOpen={isAttendanceFormOpen}
        onClose={() => setIsAttendanceFormOpen(false)}
        employees={employees}
      />

      <LeaveForm
        isOpen={isLeaveFormOpen}
        onClose={() => setIsLeaveFormOpen(false)}
        employees={employees}
      />

      {/* Attendance Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-neutral-700">
            <thead className="bg-gray-50 dark:bg-neutral-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Check-in Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Lateness
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-neutral-800 divide-y divide-gray-200 dark:divide-neutral-700">
              {attendanceRecords.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {record.employee_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {formatDate(record.checkdate)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      record.status === 'on_time'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                    }`}>
                      {record.status === 'on_time' ? 'On Time' : 'Late'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {record.lateness || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AttendancePage;
