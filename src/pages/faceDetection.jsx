import { useState } from "react";
import useFaceDetection from "../hooks/useFaceDetection";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

/**
 * FaceDetection is a component that detects faces in a given reference image.
 *
 * The component takes four parameters in its useFaceDetection hook:
 * - referenceImages: an object with names as keys and arrays of image paths as values
 * - accuracy: the accuracy of the face detection. Type: float between 0.1-1.0
 * - interval: the time interval between each face detection. Type: int
 * - bounding: whether to draw bounding boxes around the detected faces. Type: boolean
 *
 * The component renders a video element displaying the webcam feed, a canvas element
 * for drawing the detected faces, and an alert element if a face is detected.
 */
function FaceDetection() {
  const referenceImages = {
    Yasser_Dalali: ['/labels/Yasser_Dalali/1.jpg', '/labels/Yasser_Dalali/2.jpg'],
    Hamza_Idehmad: ['/labels/Hamza_Idehmad/1.jpg', '/labels/Hamza_Idehmad/2.jpg']
  };

  const { videoRef, canvasRef, attendance, loading } = useFaceDetection(
    referenceImages,
    0.5,
    1,
    true
  );

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
      {Object.keys(attendance).length > 0 && (
        <Alert message={`Attendance: ${JSON.stringify(attendance)}`} type="success" className="absolute top-0 w-1/4 left-1/3" />
      )}
    </div>
  );
}

export default FaceDetection;
