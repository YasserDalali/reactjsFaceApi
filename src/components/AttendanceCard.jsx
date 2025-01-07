const AttendanceCard = ({ title, value, percentage, latenessHours }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col items-center justify-center min-h-[200px] border border-gray-100 dark:border-neutral-700">
      {/* Title */}
      <h3 className="text-xl font-semibold text-gray-800 dark:text-neutral-200 mb-4">
        {title}
      </h3>
      
      {/* Main Value */}
      <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-3">
        {value}
      </p>
      
      {/* Percentage */}
      {percentage && (
        <p className="text-lg text-gray-600 dark:text-neutral-400 flex items-center gap-2">
          <span className="font-medium">{percentage.toFixed(1)}%</span>
          <span className="text-sm">of total</span>
        </p>
      )}
      
      {/* Lateness Hours */}
      {latenessHours !== undefined && (
        <div className="mt-2 text-red-500 dark:text-red-400 flex flex-col items-center">
          <span className="text-lg font-medium">{latenessHours}</span>
          <span className="text-sm">hours late</span>
        </div>
      )}
    </div>
  );
};

export default AttendanceCard;