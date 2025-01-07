import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AttendancePage from './pages/AttendancePage';
import EmployeePage from './pages/EmployeePage';
import FaceDetection from './pages/faceDetection';
import Sidebar from './components/SideBar';
import LeaveManagementPage from './pages/LeaveManagementPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import Navbar from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar /> {/* Use Sidebar component */}
        <Navbar />
        {/* Main content */}
        <main className="flex-1 p-6 ms-16 mt-16">
          <Routes>
            <Route path="*" element={<DashboardPage />} />
            <Route path="leave-management" element={<LeaveManagementPage />} />
            <Route path="/employees" element={<EmployeePage />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/facedetection" element={<FaceDetection />} />
            <Route path="/profile/:id" element={<ProfilePage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
