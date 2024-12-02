// App.js
import { useState } from "react";
import useFaceDetection from "../hooks/useFaceDetection";
import YasserImg from "../assets/faces/1.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

/**
 * FaceDetection is a component that detects faces in a given reference image.
 *
 * The component takes four parameters in its useFaceDetection hook:
 * - referenceImage: the image to detect faces in. Type: image
 * - accuracy: the accuracy of the face detection. Type: float between 0.1-1.0
 * - interval: the time interval between each face detection. Type: int
 * - bounding: whether to draw bounding boxes around the detected faces. Type: boolean
 *
 * The component renders a video element displaying the webcam feed, a canvas element
 * for drawing the detected faces, and an alert element if a face is detected.
 */
function FaceDetection() {
  const { videoRef, canvasRef, detected, loading } = useFaceDetection(
    YasserImg,
    0.5,
    1,
    false
  );

  return (
    <div className="app bg-black">
      {loading && <LoadingSpinner />}
      <video
        ref={videoRef}
        className="rounded-3xl px-5"
        autoPlay
        style={{ width: "100vw", height: "100vh",

         }}
        
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
      {detected && (
        <Alert message="Face Detected!" type="success" className="absolute top-0 w-1/4 left-1/3" />
      )}
      
    </div>
  );
}

export default FaceDetection;
