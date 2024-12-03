import useFaceDetection from "../hooks/useFaceDetection";
import LoadingSpinner from "../components/LoadingSpinner";
import Alert from "../components/Alert";


/**
 * FaceDetection is a component that uses the Face Detection API to recognize faces in a video feed
 * and check attendance based on the detected faces. It uses the useFaceDetection hook to do the
 * heavy lifting and renders the video and canvas elements as well as the attendance list.
 * 
 * @param {Object} referenceImages - an object with the names of the students as keys and an array of
 * paths to their reference images as values.
 * @param {number} threshold - the minimum similarity required for a face to be considered a match.
 * @param {number} maxResults - the maximum number of results to return.
 * @param {boolean} drawBox - whether to draw a red box around the detected face.
 */
function FaceDetection() {

    const referenceImages = {
      Yasser_Dalali: ['/labels/Yasser_Dalali/1.jpg', '/labels/Yasser_Dalali/2.jpg'],
      Hamza_Idehmad: ['/labels/Hamza_Idehmad/1.jpg', '/labels/Hamza_Idehmad/2.jpg'],
      Reda_Aitlhssen: ['/labels/Reda_Aitlhssen/1.jpg'],
      Zakaria_Benjeddi: ['/labels/Zakaria_Benjeddi/1.jpg'],
    };
  
    const { videoRef, canvasRef, attendance, loading } = useFaceDetection(
      referenceImages,
      0.5,
      2,
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
{attendance &&
  Object.keys(attendance).flatMap((name) =>
    attendance[name].map((entry, index) => (
      <Alert
        key={`${name}-${index}`}
        message={`Checked ${entry.attender.replace("_", " ")}, at ${new Date(
          entry.timestamp
        ).toLocaleTimeString()}, ${
          entry.distance.toFixed(2) < 0.45 ? "Accurate" : "Inaccurate"
        }`}
        type="success"
        className="absolute top-0 w-1/4 left-1/3"
      />
    ))
  )}

      </div>
    );
  }
  
  export default FaceDetection;