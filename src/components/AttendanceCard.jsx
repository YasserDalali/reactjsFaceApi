const AttendanceCard = ({ title, value, percentage, latenessHours }) => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {percentage && <p className="text-lg mt-2">Percentage: {percentage}%</p>}
        {latenessHours !== undefined && <p className="text-lg mt-2">Total Lateness: {latenessHours} hrs</p>}
      </div>
    );
  };
  
  export default AttendanceCard;
  