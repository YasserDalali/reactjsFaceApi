import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

/**
 * Custom React hook for face detection and recognition in a video stream.
 *
 * This hook initializes video capture from a webcam, loads face detection models,
 * detects faces in the video stream, and compares them against reference images
 * to identify and log attendance.
 *
 * @param {Object} referenceImages - An object containing names as keys and arrays of image paths as values.
 * @param {number} [accuracy=0.6] - The accuracy threshold for face recognition. Must be a float between 0.1 and 1.0.
 * @param {number} [interval=1] - The time interval (in seconds) between each face detection.
 * @param {boolean} [bounding=true] - Whether to draw bounding boxes around detected faces.
 *
 * @returns {Object} - An object containing videoRef, canvasRef, attendance, and loading state.
 */
const useFaceDetection = (referenceImages, accuracy = 0.6, interval = 1, bounding = true) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadModels();
  }, []);

  const loadModels = () => {
    startVideo();
    setLoading(true);

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
      })
      .finally(() => {
        setLoading(false);
      });
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

  /**
   * Detects faces in the video stream at an interval of {interval} seconds.
   * Uses the Tiny Face Detector model to detect faces, and then uses the Face Recognition model to compare
   * the detected faces to the reference images. If a match is found, logs the attendance to the attendance
   * state and draws a bounding box around the detected face with the label.
   * @param {number} interval The time interval between each face detection in seconds.
   * @param {number} accuracy The accuracy of the face detection. Type: float between 0.1-1.0
   * @param {boolean} bounding Whether to draw bounding boxes around the detected faces. Type: boolean
   */
  const detectFace = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
  
      const labeledDetections = await Promise.all(
        detections.map(async (detection) => {
          let label = "Unknown";
  
          for (const name in referenceImages) {
            const referenceImageDescriptor = await loadReferenceImage(referenceImages[name]);
            const distance = faceapi.euclideanDistance(referenceImageDescriptor, detection.descriptor);
  
            if (distance < accuracy) {
              label = name;
              const timestamp = new Date().toISOString();
  
              setAttendance((prevAttendance) => {
                // Only log if not already present
                if (!prevAttendance[name]) {
                  return {
                    ...prevAttendance,
                    [name]: [{ attender: name, timestamp, distance }],
                  };
                }
                return prevAttendance;
              });
  
              break;
            }
          }
  
          return { detection, label };
        })
      );
  
      if (bounding) drawDetections(labeledDetections);
    }, interval * 1000);

  };
  
  
  

  /**
   * Loads a reference image, detects a single face in the image, and
   * returns the face descriptor of the detected face. If no face is detected,
   * returns null.
   *
   * @param {string[]} imagePaths An array of image paths. Only the first image
   * is used.
   *
   * @returns {Object|null} The face descriptor of the detected face, or null
   * if no face is detected.
   */
  const loadReferenceImage = async (imagePaths) => {
    const img = await faceapi.fetchImage(imagePaths[0]); // Take the first image from the set
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detections ? detections.descriptor : null;
  };

  /**
   * Draws bounding boxes around the detected faces on the canvas element.
   *
   * @param {Object[]} labeledDetections An array of objects with two properties:
   * - `detection`: A face detection object from the face-api.js library.
   * - `label`: A string label for the detected face.
   *
   * @returns {void}
   */
  const drawDetections = (labeledDetections) => {
    if (canvasRef.current && videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
  
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
  
      faceapi.matchDimensions(canvas, {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      });
  
      labeledDetections.forEach(({ detection, label }) => {
        const box = detection.detection.box;
  
        // Draw bounding box
        context.strokeStyle = "red";
        context.lineWidth = 1;
        context.strokeRect(box.x, box.y, box.width, box.height);
  
        // Draw label
        context.fillStyle = "red";
        context.font = "16px Arial";
        context.fillText(label.replace("_", " "), box.x, box.y - 10);
      });
    }
  };
  
  

  return {
    videoRef,
    canvasRef,
    attendance,
    loading,
  };
};

export default useFaceDetection;
