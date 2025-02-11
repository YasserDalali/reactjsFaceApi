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
import SettingsPage from './pages/SettingsPage';
import { Provider } from 'react-redux';
import store from './context/store';
import LandingPage from './pages/landingPage/LandingPage';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
       
            <Routes>
              <Route path="*" element={<LandingPage />} />
              <Route path="/" element={<LandingPage />} />
              <Route path="/admin/leave-management" element={<LeaveManagementPage />} />
              <Route path="/admin/employees" element={<EmployeePage />} />
              <Route path="/admin/employees/:id" element={<ProfilePage />} />
              <Route path="/admin/attendance" element={<AttendancePage />} />
              <Route path="/admin/facedetection" element={<FaceDetection />} />
              <Route path="/admin/settings" element={<SettingsPage />} />
            </Routes>
      </Router>
    </Provider>
  );
};

export default App;
