// App.js
import { useState } from "react";
import useFaceDetection from "./hooks/useFaceDetection";
import YasserImg from "./assets/faces/1.jpg";
import LoadingSpinner from "./components/LoadingSpinner";

function App() {
  const { videoRef, canvasRef, detected, loading } = useFaceDetection(
    YasserImg,
    0.5,
    3
  );

  /* useFaceDetection(
  referenceImage <type: image>
    accuracy <type: float between: 0.1-1.0 > defaut: 0.6,
    interval <type: int > defaut: 1s> */

  return (
    <div className="app bg-gray-800">
      {loading && <LoadingSpinner />}
      <video
        ref={videoRef}
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

      {detected && <div className="bg-emerald-200 text-green-950 rounded-lg p-4 w-1/2 left-1/4  absolute top-3 border-green-700 border-6">Face Detected!</div>}{" "}
    </div>
  );
}

export default App;
