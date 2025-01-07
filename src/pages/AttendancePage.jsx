import React from "react";
import { useSelector } from "react-redux";
import { motion } from 'framer-motion';
import AnimatedComponent from '../components/AnimatedComponent';
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <AnimatedComponent>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Attendance Records
        </h1>
      </AnimatedComponent>
      
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnimatedComponent delay={0.1}>
          <AttendanceCard 
            title="Total Attendance" 
            value={totalAttendance}
            percentage={(totalAttendance / totalAttendance) * 100}
          />
        </AnimatedComponent>

        <AnimatedComponent delay={0.2}>
          <AttendanceCard 
            title="On Time" 
            value={onTimeCount}
            percentage={(onTimeCount / totalAttendance) * 100}
          />
        </AnimatedComponent>

        <AnimatedComponent delay={0.3}>
          <AttendanceCard 
            title="Late Arrivals" 
            value={totalAttendance - onTimeCount}
            latenessHours={totalLateHours.toFixed(1)}
          />
        </AnimatedComponent>
      </div>
      
      <PresenceTable attendanceData={attendanceData} />
    </motion.div>
  );
};

export default AttendancePage;
