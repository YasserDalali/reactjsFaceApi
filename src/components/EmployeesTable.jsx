import React, { useState } from 'react'

export default function EmployeesTable() {
    const [employees, setEmployees] = useState([]);

  return (

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left">Name</th>
            <th className="px-6 py-3 text-left">Position</th>
            <th className="px-6 py-3 text-left">Department</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((employee, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-3">{employee.name}</td>
                <td className="px-6 py-3">{employee.position}</td>
                <td className="px-6 py-3">{employee.department}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center py-3">No employees yet</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>

  )
}
