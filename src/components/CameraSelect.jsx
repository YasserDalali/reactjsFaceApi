import React, { useState, useEffect } from 'react';

const CameraSelect = ({ onDeviceSelect }) => {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const getDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (error) {
        console.error('Error getting devices:', error);
      }
    };

    getDevices();
  }, []);

  return (
    <select 
      onChange={(e) => onDeviceSelect(e.target.value)}
      className="p-2 border rounded"
    >
      {devices.map((device, index) => (
        <option key={device.deviceId} value={device.deviceId}>
          {device.label || `Camera ${index + 1}`}
        </option>
      ))}
    </select>
  );
};

export default CameraSelect; 