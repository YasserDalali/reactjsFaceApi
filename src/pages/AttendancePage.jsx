import React from "react";
import { useSelector } from "react-redux";
import PresenceTable from "./../components/PresenceTable";
import AttendanceCard from "./../components/AttendanceCard";

const AttendancePage = () => {
  // Fetching attendance data from the Redux store
  const attendanceData = useSelector((state) => state.attendance);

  // Calculate statistics from attendanceData
  const totalAttendance = attendanceData.length;
  const onTimeCount = attendanceData.filter(record => !record.lateness).length;
  const totalLateHours = attendanceData.reduce((total, record) => {
    return total + (record.lateness ? parseFloat(record.lateness) : 0);
  }, 0);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-neutral-200 mb-6">
        Attendance Records
      </h1>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AttendanceCard 
          title="Total Attendance" 
          value={totalAttendance}
          percentage={(totalAttendance / totalAttendance) * 100}
        />
        <AttendanceCard 
          title="On Time" 
          value={onTimeCount}
          percentage={(onTimeCount / totalAttendance) * 100}
        />
        <AttendanceCard 
          title="Late Arrivals" 
          value={totalAttendance - onTimeCount}
          latenessHours={totalLateHours.toFixed(1)}
        />
      </div>
      
      <PresenceTable attendanceData={attendanceData} />
    </div>
  );
};

export default AttendancePage;
