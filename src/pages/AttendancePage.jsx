import React from "react";
import { useFetchAttendance } from '../hooks/useFetchAttendance';
import { motion } from 'framer-motion';
import AnimatedComponent from '../components/AnimatedComponent';
import PresenceTable from "./../components/PresenceTable";
import AttendanceCard from "./../components/AttendanceCard";

const AttendancePage = () => {
  const { attendance, loading, error } = useFetchAttendance();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 dark:border-white"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg text-red-800 dark:text-red-200">
          <h3 className="text-lg font-semibold">Error Loading Attendance</h3>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toLocaleDateString('en-GB'); // Returns YYYY-MM-DD

  // Calculate statistics from today's attendance data
  const totalAttendance = 0;
  const onTimeCount = 0;
  const lateCount = 0;

  // Calculate total late hours for today


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <AnimatedComponent>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
          Today's Attendance
        </h1>
      </AnimatedComponent>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <AnimatedComponent delay={0.1}>
          <AttendanceCard
            title="Present Today"
            value={0}
            percentage={0}
            subtitle={`out of 0 employees`}
          />
        </AnimatedComponent>

        <AnimatedComponent delay={0.2}>
          <AttendanceCard
            title="On Time Today"
            value={0}
            percentage={0}
            subtitle={`0% of present employees`}
          />
        </AnimatedComponent>

        <AnimatedComponent delay={0.3}>
          <AttendanceCard
            title="Late Today"
            value={0}
            /* latenessHours={0} */
            subtitle={`Total late hours: 0`}
          />
        </AnimatedComponent>
      </div>

      {/* Show all attendance records in the table */}
      <AnimatedComponent delay={0.4}>
        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-4">
          All Attendance Records
        </h2>
        <PresenceTable attendanceData={attendance} />
      </AnimatedComponent>
    </motion.div>
  );
};

export default AttendancePage;
