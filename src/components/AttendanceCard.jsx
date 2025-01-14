import React from 'react';

const AttendanceCard = ({ title, value, percentage, latenessHours, subtitle }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-lg p-6">
      <h3 className="text-gray-500 dark:text-neutral-400 text-sm font-medium">
        {title}
      </h3>
      <div className="mt-2 flex items-baseline">
        <p className="text-3xl font-bold text-gray-800 dark:text-white">
          {value}
        </p>
        {percentage !== undefined && (
          <p className="ml-2 text-sm text-gray-500 dark:text-neutral-400">
            ({percentage.toFixed(1)}%)
          </p>
        )}
      </div>
      {latenessHours && (
        <p className="text-sm text-yellow-600 dark:text-yellow-400 mt-1">
          Total: {latenessHours} hours late
        </p>
      )}
      {subtitle && (
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-2">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default AttendanceCard;