import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (referenceImages, accuracy = 0.6, interval = 1, bounding = true) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Store detection history as arrays of last N detections
  const detectionHistoryRef = useRef({});
  
  // Configuration for verification
  const REQUIRED_CONSECUTIVE_DETECTIONS = 3;  // Number of consecutive intervals needed

  useEffect(() => {
    loadModels();
    return () => {
      // Cleanup detection history on unmount
      detectionHistoryRef.current = {};
    };
  }, []);

  const loadModels = () => {
    startVideo();
    setLoading(true);

    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ])
      .then(() => {
        detectFace();
      })
      .catch((err) => {
        console.error("Error loading models", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const startVideo = () => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((currentStream) => {
        videoRef.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateDetectionHistory = (name, distance) => {
    // Initialize history for this person if it doesn't exist
    if (!detectionHistoryRef.current[name]) {
      detectionHistoryRef.current[name] = [];
    }

    // Add new detection
    detectionHistoryRef.current[name].push({
      distance: distance,
      detected: true
    });

    // Keep only the last N detections
    if (detectionHistoryRef.current[name].length > REQUIRED_CONSECUTIVE_DETECTIONS) {
      detectionHistoryRef.current[name].shift();
    }

    // Check if we have enough consecutive detections
    if (detectionHistoryRef.current[name].length === REQUIRED_CONSECUTIVE_DETECTIONS) {
      // Calculate average distance for consistency check
      const averageDistance = detectionHistoryRef.current[name]
        .reduce((sum, detection) => sum + detection.distance, 0) 
        / REQUIRED_CONSECUTIVE_DETECTIONS;

      // Verify if all detections are consistent (within 10% of average)
      const consistentDetections = detectionHistoryRef.current[name]
        .every(detection => 
          Math.abs(detection.distance - averageDistance) < (averageDistance * 0.1)
        );

      if (consistentDetections) {
        return true;
      }
    }

    return false;
  };

  const recordMissedDetection = (name) => {
    if (detectionHistoryRef.current[name]) {
      // Reset detection history if person is not detected
      detectionHistoryRef.current[name] = [];
    }
  };

  const detectFace = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      // Keep track of which names were detected in this interval
      const detectedNames = new Set();
  
      const labeledDetections = await Promise.all(
        detections.map(async (detection) => {
          let label = "Unknown";
          let verifiedMatch = false;
  
          for (const name in referenceImages) {
            const referenceImageDescriptor = await loadReferenceImage(referenceImages[name]);
            const distance = faceapi.euclideanDistance(referenceImageDescriptor, detection.descriptor);
  
            if (distance < accuracy) {
              detectedNames.add(name);
              // Update detection history and check for verification
              const isVerified = updateDetectionHistory(name, distance);
              
              if (isVerified) {
                label = name;
                verifiedMatch = true;
                const timestamp = new Date().toISOString();
  
                setAttendance((prevAttendance) => {
                  const alreadyPresent = prevAttendance.some(
                    (entry) => entry.attender === name
                  );
                
                  if (!alreadyPresent) {
                    return [
                      ...prevAttendance,
                      { 
                        attender: name, 
                        timestamp, 
                        distance, 
                        verified: true,
                        consecutiveDetections: REQUIRED_CONSECUTIVE_DETECTIONS 
                      },
                    ];
                  }
                
                  return prevAttendance;
                });
  
                break;
              }
            }
          }
  
          // If not verified, show verification progress
          const detectionCount = detectionHistoryRef.current[label]?.length || 0;
          const verifyingLabel = verifiedMatch ? 
            label : 
            `Verifying... (${detectionCount}/${REQUIRED_CONSECUTIVE_DETECTIONS})`;
  
          return { 
            detection, 
            label: verifyingLabel,
            verifiedMatch 
          };
        })
      );

      // Record missed detections for anyone not detected in this interval
      Object.keys(referenceImages).forEach(name => {
        if (!detectedNames.has(name)) {
          recordMissedDetection(name);
        }
      });
  
      if (bounding) drawDetections(labeledDetections);
    }, interval * 1000);
  };

  const loadReferenceImage = async (imagePaths) => {
    const img = await faceapi.fetchImage(imagePaths[0]);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detections ? detections.descriptor : null;
  };

  const drawDetections = (labeledDetections) => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      faceapi.matchDimensions(canvas, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
  
      labeledDetections.forEach(({ detection, label, verifiedMatch }) => {
        const box = detection.detection.box;
  
        // Use different colors for verified vs unverified detections
        const color = verifiedMatch ? "#00FF00" : "#FFA500";
  
        // Draw bounding box
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.strokeRect(box.x, box.y, box.width, box.height);
  
        // Draw label
        context.fillStyle = color;
        context.font = "16px Arial";
        context.fillText(label.replace("_", " "), box.x, box.y - 10);
      });
    }
  };

  return {
    videoRef,
    canvasRef,
    attendance,
    loading,
  };
};

export default useFaceDetection;