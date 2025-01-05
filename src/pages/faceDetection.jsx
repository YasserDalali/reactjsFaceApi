import React, { useRef, useState, useEffect } from 'react';
import useFaceDetection from "../hooks/useFaceDetection";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

function FaceDetection() {
  const referenceImages = {
    Yasser_Dalali: ['/labels/Yasser_Dalali/1.jpg', '/labels/Yasser_Dalali/2.jpg'],
    Hamza_Idehmad: ['/labels/Hamza_Idehmad/1.jpg', '/labels/Hamza_Idehmad/2.jpg'],
    Reda_Aitlhssen: ['/labels/Reda_Aitlhssen/1.jpg'],
    Zakaria_Benjeddi: ['/labels/Zakaria_Benjeddi/1.jpg'],
  };

  // Keep track of attendance records with their screenshots
  const [attendanceWithScreenshots, setAttendanceWithScreenshots] = useState([]);
  
  const { videoRef, canvasRef, attendance, loading } = useFaceDetection(
    referenceImages,
    0.5,
    1,
    true
  );

  // Function to capture screenshot from video
  const captureScreenshot = () => {
    const video = videoRef.current;
    if (!video) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg');
  };

  // Update attendanceWithScreenshots when attendance changes
  useEffect(() => {
    if (attendance && attendance.length > attendanceWithScreenshots.length) {
      // Only capture screenshot for new attendance records
      const newRecord = attendance[attendance.length - 1];
      const screenshot = captureScreenshot();
      
      setAttendanceWithScreenshots(prev => [
        ...prev,
        {
          ...newRecord,
          screenshot
        }
      ]);
    }
  }, [attendance]);

  return (
    <div className="app bg-black">
      {loading && <LoadingSpinner />}
      <video
        ref={videoRef}
        className="rounded-3xl px-5"
        autoPlay
        style={{ width: "100vw", height: "100vh" }}
      />
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
        }}
      />
      <table className="absolute top-10 left-0 z-20 bg-white border rounded-lg border-gray-300 shadow-lg w-[90%]">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left font-medium text-gray-700">Attender</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Time</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Accuracy</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Status</th>
            <th className="px-4 py-2 text-left font-medium text-gray-700">Screenshot</th>
          </tr>
        </thead>
        <tbody>
          {attendanceWithScreenshots.map((record, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } hover:bg-gray-100`}
            >
              <td className="px-4 py-2 text-gray-800">{record.attender.replace("_", " ")}</td>
              <td className="px-4 py-2 text-gray-800">
                {new Date(record.timestamp).toLocaleTimeString()}
              </td>
              <td
                className={`px-4 py-2 font-semibold ${
                  record.distance.toFixed(2) < 0.38
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {record.distance.toFixed(2) < 0.4 ? "Accurate" : "Inaccurate"}
              </td>
              <td className="px-4 py-2 text-gray-800">
                {new Date(record.timestamp) > new Date().setHours(4, 30, 0, 0) ? "LATE" : "ON TIME"}
              </td>
              <td className="px-4 py-2">
                {record.screenshot && (
                  <img 
                    src={record.screenshot} 
                    alt={`Screenshot of ${record.attender}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default FaceDetection;