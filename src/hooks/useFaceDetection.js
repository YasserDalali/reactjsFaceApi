import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (referenceImages, accuracy = 0.6, interval = 1, bounding = true) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
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

  const detectFace = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
  
      const labeledDetections = await Promise.all(
        detections.map(async (detection) => {
          let label = "Unknown";
  
          for (const name in referenceImages) {
            const referenceImageDescriptor = await loadReferenceImage(referenceImages[name]);
            const distance = faceapi.euclideanDistance(referenceImageDescriptor, detection.descriptor);
  
            if (distance < accuracy) {
              label = name;
              const timestamp = new Date().toISOString();
  
              setAttendance((prevAttendance) => {
                // Only log if not already present
                if (!prevAttendance[name]) {
                  return {
                    ...prevAttendance,
                    [name]: [{ attender: name, timestamp, distance }],
                  };
                }
                return prevAttendance;
              });
  
              break;
            }
          }
  
          return { detection, label };
        })
      );
  
      if (bounding) drawDetections(labeledDetections);
    }, interval * 1000);
  };
  
  
  

  const loadReferenceImage = async (imagePaths) => {
    const img = await faceapi.fetchImage(imagePaths[0]); // Take the first image from the set
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
  
      labeledDetections.forEach(({ detection, label }) => {
        const box = detection.detection.box;
  
        // Draw bounding box
        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.strokeRect(box.x, box.y, box.width, box.height);
  
        // Draw label
        context.fillStyle = "red";
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
