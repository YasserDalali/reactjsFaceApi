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

      if (detections.length > 0) {
        for (const name in referenceImages) {
          const referenceImageDescriptor = await loadReferenceImage(referenceImages[name]);
          const detectionsDescriptors = detections.map((d) => d.descriptor);
          const distance = faceapi.euclideanDistance(
            referenceImageDescriptor,
            detectionsDescriptors[0]
          );

          if (distance < accuracy) {
            const timestamp = new Date().toISOString();
            setAttendance((prevAttendance) => ({
              ...prevAttendance,
              [name]: [...(prevAttendance[name] || []), { timestamp }],
            }));
            if (bounding) drawDetections(detections);
          }
        }
      }
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

  const drawDetections = (detections) => {
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

      const resizedDetections = faceapi.resizeResults(detections, {
        width: canvas.width,
        height: canvas.height,
      });

      faceapi.draw.drawDetections(canvas, resizedDetections);
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
