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
import AdminApp from './AdminApp';

const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="*" element={<LandingPage />} />
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/leave-management" element={<AdminApp><LeaveManagementPage /></AdminApp>} />
          <Route path="/admin/*" element={<AdminApp><DashboardPage /></AdminApp>} />
          <Route path="/admin/employees" element={<AdminApp><EmployeePage /></AdminApp>} />
          <Route path="/admin/employees/:id" element={<AdminApp><ProfilePage /></AdminApp>} />
          <Route path="/admin/attendance" element={<AdminApp><AttendancePage /></AdminApp>} />
          <Route path="/admin/facedetection" element={<AdminApp><FaceDetection /></AdminApp>} />
          <Route path="/admin/settings" element={<AdminApp><SettingsPage /></AdminApp>} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
