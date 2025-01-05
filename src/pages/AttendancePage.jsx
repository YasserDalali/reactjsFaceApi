import React from 'react';
import AttendanceCard from '../components/AttendanceCard';
import PresenceTable from '../components/PresenceTable';
import AbsenceTable from '../components/AbsenceTable';

const AttendancePage = () => {
  // Sample data
  const attendanceData = [
    {
      name: 'John Doe',
      time: '08:45 AM',
      late: 'No',
      accurateScan: 'Yes',
      status: 'present',
      faceImage: 'https://placeimg.com/80/80/people',
      screenshot: 'https://placeimg.com/640/360/tech',
    },
    {
      name: 'Jane Smith',
      time: '09:15 AM',
      late: 'Yes',
      accurateScan: 'No',
      status: 'absent',
      faceImage: 'https://placeimg.com/80/80/people',
      screenshot: 'https://placeimg.com/640/360/business',
    },
    {
      name: 'Alice Johnson',
      time: '08:50 AM',
      late: 'No',
      accurateScan: 'Yes',
      status: 'present',
      faceImage: 'https://placeimg.com/80/80/people',
      screenshot: 'https://placeimg.com/640/360/people',
    },
  ];

  // Filter present and absent employees
  const presentEmployees = attendanceData.filter(item => item.status === 'present');
  const absentEmployees = attendanceData.filter(item => item.status === 'absent');

  // Calculate stats
  const totalEmployees = attendanceData.length;
  const presentCount = presentEmployees.length;
  const presencePercentage = ((presentCount / totalEmployees) * 100).toFixed(2);
  const totalLatenessHours = absentEmployees.filter(item => item.late === 'Yes').length * 1; // Example lateness calculation

  return (
    <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Employee Management</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-6">
        <AttendanceCard title="Present" value={`${presentCount}/${totalEmployees}`} percentage={presencePercentage} latenessHours={totalLatenessHours} />
        <AttendanceCard title="Presence Percentage" value={`${presencePercentage}%`} />
        <AttendanceCard title="Total Lateness Hours" value={`${totalLatenessHours} hrs`} />
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Presence</h2>
        <PresenceTable data={presentEmployees} />

        <h2 className="text-2xl font-semibold mb-4 mt-6">Absence</h2>
        <AbsenceTable data={absentEmployees} />
      </div>
    </div>
  );
};

export default AttendancePage;
