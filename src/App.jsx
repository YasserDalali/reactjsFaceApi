import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage';
import EmployeePage from './pages/EmployeePage';
import FaceDetection from './pages/faceDetection';
import Sidebar from './components/SideBar';

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar /> {/* Use Sidebar component */}

        {/* Main content */}
        <div className="flex-1 p-6">
          <Routes>
            <Route path="*" element={<></>} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/facedetection" element={<FaceDetection />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
