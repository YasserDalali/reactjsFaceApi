// App.js
import { useState } from "react";
import useFaceDetection from "./hooks/useFaceDetection";
import YasserImg from "./assets/faces/1.jpg";

function App() {
  const { videoRef, canvasRef, detected } = useFaceDetection(YasserImg, 0.5, 3);

  /* useFaceDetection(
  referenceImage <type: image>
    accuracy <type: float between: 0.1-1.0 > defaut: 0.6,
    interval <type: int > defaut: 1s> */

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
      {detected && <div className="alert">Face Detected!</div>}
    </div>
  );
}

export default App;
