// useFaceDetection.js
import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (referenceImage,
    accuracy=0.6,
    interval=1, bounding=true) => {
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
  //? ✅ This code snippet loads four face detection models from a specified URI ("/models"), starts the video stream, and sets the loading state to true. Once all models are loaded, it calls the detectFace function. If any errors occur during loading, it logs the error. Finally, it sets the loading state to false after the models and webcam are ready.
//? -------------------------------------------------------------------------------------------------------

  
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
    //? ✅ This code snippet requests access to the user's camera and sets the video stream to a video element referenced by videoRef. If the request fails, it logs the error to the console.
//? -------------------------------------------------------------------------------------------------------


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
    //? ✅ This code snippet requests access to the user's camera and sets the video stream to a video element referenced by videoRef. If the request fails, it logs the error to the console.
//? -------------------------------------------------------------------------------------------------------



  const loadReferenceImage = async (imagePath) => {
    const img = await faceapi.fetchImage(imagePath);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detections ? detections.descriptor : null;
  };
  const drawDetections = (detections) => {
    if (canvasRef.current && videoRef.current) {
      // Clear canvas before drawing
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      // Set canvas dimensions to match video
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      // Match canvas dimensions with video
      faceapi.matchDimensions(canvas, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
  
      // Resize detections to match canvas size
      const resizedDetections = faceapi.resizeResults(detections, {
        width: canvas.width,
        height: canvas.height,
      });
  
      // Draw detections
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }
  };
  
    //?  This function draws face detections on a canvas element. It first creates a canvas from a video element, sets the canvas dimensions to match the video, and then uses the face-api.js library to draw the detected faces on the canvas.
//? -------------------------------------------------------------------------------------------------------


  return {
    videoRef,
    canvasRef,
    detected,
    loading, // Return loading state here

  };
};

export default useFaceDetection;
