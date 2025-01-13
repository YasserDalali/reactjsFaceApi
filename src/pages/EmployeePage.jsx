import React from "react";
import { useSelector } from "react-redux";
import EmployeeTable from "../components/EmployeeTable";
import ModalButton from "../components/Modal";
import EmployeeForm from "../components/EmployeeForm";
import sb from '../database/supabase-client';

const EmployeePage = () => {
  // Get employees from Redux store

  const employees = useSelector((state) => state.employees);
  /* const employees = sb.from('employees').select('*'); */
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Management</h1>
      <ModalButton value="Add Employee" title="Add Employee">
          <EmployeeForm />
      </ModalButton>

      <div className="mt-3"></div>
      <EmployeeTable employees={employees} />
    </div>
  );
};

export default EmployeePage;
