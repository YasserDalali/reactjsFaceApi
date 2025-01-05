import React, { useState } from "react";
import AddEmployee from "../components/AddEmployee";
import EmployeesTable from "../components/EmployeesTable";

const EmployeePage = () => {





  return (
    <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
      
      <AddEmployee></AddEmployee>
      <hr /><br />
        <EmployeesTable></EmployeesTable>
    </div>
  );
};

export default EmployeePage;
