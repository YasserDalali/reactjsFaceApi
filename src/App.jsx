import { useRef, useEffect, useState } from "react";
import * as faceapi from "face-api.js";
import YasserImg from "./assets/faces/1.jpg";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [detected, setDetected] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    startVideo();
    loadModels();

    return () => {
      // Cleanup the interval on component unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

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

  const loadModels = () => {
    Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri("/models"), // Load the SSD model explicitly

      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
      faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
    ])
      .then(() => {
        detectFace(); // Start face detection after models are loaded
      })
      .catch((err) => {
        console.error("Error loading models", err);
      });
  };

  const detectFace = () => {
    intervalRef.current = setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();

      if (detections.length > 0) {
        const referenceImage = await loadReferenceImage();
        const detectionsDescriptors = detections.map((d) => d.descriptor);
        const distance = faceapi.euclideanDistance(
          referenceImage,
          detectionsDescriptors[0]
        );

        if (distance < 0.6) {
          // Threshold for match
          if (!detected) {
            alert("Face Detected!");
            setDetected(true);
          }
        } else {
          setDetected(false);
        }

        drawDetections(detections);
      }
    }, 1000); // Detection interval
  };

  const loadReferenceImage = async () => {
    const img = await faceapi.fetchImage(YasserImg);
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

  return (
    <div className="app">
      <video
        ref={videoRef}
        autoPlay
        style={{ width: "100vw", height: "100vh" }}
      />
      <canvas
        ref={canvasRef}
        style={{ position: "absolute", top: 0, left: 0 }}
      />
    </div>
  );
}

export default App;
