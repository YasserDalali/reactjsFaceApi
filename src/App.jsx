import { useRef, useEffect } from "react";
import "./App.css";
import * as faceapi from "face-api.js";

function App() {
  const videoRef = useRef();
  const canvasRef = useRef();

  // LOAD FROM USEEFFECT
  useEffect(() => {
    startVideo();
    videoRef && loadModels();
  }, []);

  // OPEN YOU FACE WEBCAM
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
  // LOAD MODELS FROM FACE API

  const loadModels = () => {
    Promise.all([
      // THIS FOR FACE DETECT AND LOAD FROM YOU PUBLIC/MODELS DIRECTORY
      faceapi.nets.tinyFaceDetector.loadFromUri("/models"),
/*       faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
 */      faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
/*       faceapi.nets.faceExpressionNet.loadFromUri("/models"),
 */    ]).then(() => {
      faceMyDetect();
    });
  };

  const faceMyDetect = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())


      // DRAW YOU FACE IN WEBCAM
      canvasRef.current.innerHtml = faceapi.createCanvasFromMedia(
        videoRef.current
      );

      faceapi.matchDimensions(canvasRef.current, {
        width: screen.width,
        height: screen.height,
      });

      const resized = faceapi.resizeResults(detections, {
        width: screen.width,
        height: screen.height,
      });

      faceapi.draw.drawDetections(canvasRef.current, resized);
      /*       faceapi.draw.drawFaceLandmarks(canvasRef.current,resized)
     faceapi.draw.drawFaceExpressions(canvasRef.current,resized)
 */
    }, 1000);
  };

  return (
    <div className="myapp">
      <div className="appvide">
        <video crossOrigin="anonymous" style={{ width: "100vw", height: "100vh" }} ref={videoRef} autoPlay></video>
      </div>
      <canvas
        ref={canvasRef}
        className="appcanvas"
        style={{ width: "100vw", height: "100vh" }}
      />
    </div>
  );
}

export default App;
