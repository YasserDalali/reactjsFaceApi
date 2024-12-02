// App.js
import { useState } from "react";
import useFaceDetection from "../hooks/useFaceDetection";
import YasserImg from "../assets/faces/1.jpg";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";

function FaceDetection() {
  const { videoRef, canvasRef, detected, loading } = useFaceDetection(
    YasserImg,
    0.5,
    1
  );

  /* useFaceDetection(
  referenceImage <type: image>
    accuracy <type: float between: 0.1-1.0 > defaut: 0.6,
    interval <type: int > defaut: 1s> */

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
      {detected && (
        <Alert message="Face Detected!" type="success" className="absolute top-0 w-1/4 left-1/3" />
      )}
      
    </div>
  );
}

export default FaceDetection;
