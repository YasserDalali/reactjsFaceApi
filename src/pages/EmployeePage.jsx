import React from 'react';
import { useFetchEmployees } from '../hooks/useFetchEmployees';
import EmployeeTable from '../components/EmployeeTable';

const EmployeePage = () => {
  const { employees, loading, error } = useFetchEmployees();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
          <h3 className="text-lg font-semibold">Error Loading Employees</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Employees
      </h1>
      <EmployeeTable employees={employees} />
    </div>
  );
};

export default EmployeePage;
