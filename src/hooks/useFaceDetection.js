// useFaceDetection.js
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (referenceImage,
    accuracy=0.6,
    interval=1) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [detected, setDetected] = useState(false);
  const [loading, setLoading] = useState(true); // Track the loading state


  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
      startVideo();
      setLoading(true);  // Set loading to true when models start loading

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
      }).finally(() => {    setLoading(false); // Set loading to false after models and webcam are ready
      })
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
        const referenceImageDescriptor = await loadReferenceImage(referenceImage);
        const detectionsDescriptors = detections.map((d) => d.descriptor);
        const distance = faceapi.euclideanDistance(
          referenceImageDescriptor,
          detectionsDescriptors[0]
        );

        if (distance < accuracy) {
          if (!detected) {
            console.log("Face Detected!");
            setDetected(true);
          }
        } 

        drawDetections(detections);
      }
    }, interval*1000);
  };

  const loadReferenceImage = async (imagePath) => {
    const img = await faceapi.fetchImage(imagePath);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detections ? detections.descriptor : null;
  };

  const drawDetections = (detections) => {
    if (canvasRef.current) {
      canvasRef.current.innerHTML = faceapi.createCanvasFromMedia(videoRef.current);
      faceapi.matchDimensions(canvasRef.current, {
        width: videoRef.current.width,
        height: videoRef.current.height,
      });
      faceapi.draw.drawDetections(canvasRef.current, detections);
    }
  };

  return {
    videoRef,
    canvasRef,
    detected,
    loading, // Return loading state here

  };
};

export default useFaceDetection;
