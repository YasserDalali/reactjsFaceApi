const AbsenceTable = ({ data }) => {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left">Name</th>
              <th className="px-6 py-3 text-left">Time of Attendance</th>
              <th className="px-6 py-3 text-left">Late</th>
              <th className="px-6 py-3 text-left">Accurate Scan</th>
              <th className="px-6 py-3 text-left">Screenshot</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-b">
                <td className="px-6 py-3 flex items-center">
                  <img src={item.faceImage} alt={item.name} className="w-8 h-8 rounded-full object-cover mr-4" />
                  {item.name}
                </td>
                <td className="px-6 py-3">{item.time}</td>
                <td className="px-6 py-3">{item.late}</td>
                <td className="px-6 py-3">{item.accurateScan}</td>
                <td className="px-6 py-3">
                  <img src={item.screenshot} alt={item.name} className="w-32 h-20 object-cover rounded-lg" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default AbsenceTable;
  