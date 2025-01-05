import React, { useState } from 'react'

export default function AddEmployee() {

    const [newEmployee, setNewEmployee] = useState({ name: "", position: "", department: "" });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee({ ...newEmployee, [name]: value });
      };
    
      const handleAddEmployee = () => {
        if (newEmployee.name && newEmployee.position && newEmployee.department) {
          setEmployees([...employees, newEmployee]);
          setNewEmployee({ name: "", position: "", department: "" });
        }
      };

  return (
          <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Add New Employee</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                type="text"
                name="name"
                value={newEmployee.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Position</label>
              <input
                type="text"
                name="position"
                value={newEmployee.position}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Department</label>
              <input
                type="text"
                name="department"
                value={newEmployee.department}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md"
              />
            </div>
            <button
              onClick={handleAddEmployee}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Add Employee
            </button>
          </div>
        </div>
  )
}
