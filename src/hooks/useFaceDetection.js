import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (
  referenceImages, 
  accuracy = 0.45, // Decreased threshold for stricter matching
  interval = 1,
  bounding = true
) => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPerson, setCurrentPerson] = useState(null); // Track current person
  
  // Store detection history as arrays of last N detections
  const detectionHistoryRef = useRef({});
  
  // Enhanced configuration with stricter parameters
  const CONFIG = {
    REQUIRED_CONSECUTIVE_DETECTIONS: 8,  // Increased from 5 to 8
    DETECTION_TIMEOUT: 8000, // Reduced to 8 seconds
    DISTANCE_VARIANCE_THRESHOLD: 0.03, // Reduced to 3% for more consistency
    MIN_FACE_SIZE: 200, // Increased minimum face size
    BRIGHTNESS_THRESHOLD: 0.6, // Increased minimum brightness
    MAX_ANGLE_DEVIATION: 10, // Reduced maximum angle deviation
    MAX_VERIFICATION_ATTEMPTS: 5, // Reduced max verification attempts
    MIN_CONFIDENCE_SCORE: 0.8, // Minimum confidence score for detection
    REFERENCE_IMAGES_REQUIRED: 3, // Minimum number of reference images needed
    SPOOF_DETECTION_THRESHOLD: 0.95, // Threshold for detecting potential spoofing
  };

  // New state for tracking verification attempts
  const verificationAttemptsRef = useRef({});
  const lastDetectionTimeRef = useRef({});

  // New helper functions
  const checkFaceQuality = async (detection) => {
    // Check face size
    const faceSize = detection.detection.box.width;
    if (faceSize < CONFIG.MIN_FACE_SIZE) {
      return { valid: false, reason: 'Face too small or too far' };
    }

    // Check face alignment using landmarks
    const landmarks = detection.landmarks;
    const angle = calculateFaceAngle(landmarks);
    if (Math.abs(angle) > CONFIG.MAX_ANGLE_DEVIATION) {
      return { valid: false, reason: 'Face not properly aligned' };
    }

    // Check image brightness
    const brightness = await calculateBrightness(videoRef.current);
    if (brightness < CONFIG.BRIGHTNESS_THRESHOLD) {
      return { valid: false, reason: 'Insufficient lighting' };
    }

    return { valid: true };
  };

  const calculateFaceAngle = (landmarks) => {
    const leftEye = landmarks.getLeftEye()[0];
    const rightEye = landmarks.getRightEye()[0];
    const angle = Math.atan2(
      rightEye.y - leftEye.y,
      rightEye.x - leftEye.x
    ) * (180 / Math.PI);
    return angle;
  };

  const calculateBrightness = async (video) => {
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let sum = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
      sum += (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
    }
    return sum / (imageData.data.length / 4) / 255;
  };

  // New function to compare with multiple reference images
  const compareWithReferences = async (detection, name) => {
    if (!referenceImages[name] || referenceImages[name].length < CONFIG.REFERENCE_IMAGES_REQUIRED) {
      console.warn(`Insufficient reference images for ${name}`);
      return { match: false, avgDistance: 1 };
    }

    const distances = await Promise.all(
      referenceImages[name].map(async (refImage) => {
        const refDescriptor = await loadReferenceImage(refImage);
        return refDescriptor ? 
          faceapi.euclideanDistance(refDescriptor, detection.descriptor) : 1;
      })
    );

    // Filter out failed detections
    const validDistances = distances.filter(d => d !== 1);
    
    if (validDistances.length < CONFIG.REFERENCE_IMAGES_REQUIRED) {
      return { match: false, avgDistance: 1 };
    }

    const avgDistance = validDistances.reduce((a, b) => a + b, 0) / validDistances.length;
    const variance = Math.sqrt(
      validDistances.reduce((acc, d) => acc + Math.pow(d - avgDistance, 2), 0) / validDistances.length
    );

    // Check if the variance between reference images is too high
    if (variance > CONFIG.DISTANCE_VARIANCE_THRESHOLD) {
      console.warn(`High variance in reference image matching for ${name}`);
      return { match: false, avgDistance: 1 };
    }

    return {
      match: avgDistance < accuracy,
      avgDistance
    };
  };

  // Enhanced spoof detection
  const detectPossibleSpoof = (detection) => {
    const { width, height } = detection.detection.box;
    const aspectRatio = width / height;
    
    // Check for unnaturally perfect aspect ratios
    if (Math.abs(aspectRatio - 1) < 0.01) {
      return true;
    }

    // Check for static/frozen frames
    const imageData = getImageData(videoRef.current);
    if (isStaticFrame(imageData)) {
      return true;
    }

    return false;
  };

  // Frame comparison helper
  const lastFrameRef = useRef(null);
  const staticFrameCountRef = useRef(0);

  const isStaticFrame = (currentFrame) => {
    if (!lastFrameRef.current) {
      lastFrameRef.current = currentFrame;
      return false;
    }

    const difference = calculateFrameDifference(currentFrame, lastFrameRef.current);
    lastFrameRef.current = currentFrame;

    if (difference < 0.001) { // Very little change between frames
      staticFrameCountRef.current++;
      if (staticFrameCountRef.current > 5) { // 5 consecutive static frames
        return true;
      }
    } else {
      staticFrameCountRef.current = 0;
    }

    return false;
  };

  // Enhanced detection history update
  const updateDetectionHistory = async (name, distance, detection) => {
    const now = Date.now();
    
    // Spoof detection check
    if (detectPossibleSpoof(detection)) {
      console.warn('Possible spoofing attempt detected');
      return false;
    }

    // Compare with reference images
    const referenceComparison = await compareWithReferences(detection, name);
    if (!referenceComparison.match) {
      return false;
    }

    // Quality checks and other verifications...
    const qualityCheck = await checkFaceQuality(detection);
    if (!qualityCheck.valid) {
      console.log(`Quality check failed for ${name}: ${qualityCheck.reason}`);
      return false;
    }

    // If verification is successful and it's a different person than last detected
    if (currentPerson !== name) {
      setCurrentPerson(name);
      // Simple TTS greeting
      const utterance = new SpeechSynthesisUtterance(name);
      utterance.rate = 1.0;  // Normal speed
      utterance.pitch = 1.0; // Normal pitch
      utterance.volume = 1.0; // Full volume
      window.speechSynthesis.speak(utterance);
    }

    // Update detection history
    detectionHistoryRef.current[name].push({
      distance,
      timestamp: now,
      quality: qualityCheck
    });

    // Keep only recent detections
    detectionHistoryRef.current[name] = detectionHistoryRef.current[name]
      .filter(d => now - d.timestamp < CONFIG.DETECTION_TIMEOUT);

    // Update last detection time
    lastDetectionTimeRef.current[name] = now;

    // Check if we have enough consistent detections
    if (detectionHistoryRef.current[name].length >= CONFIG.REQUIRED_CONSECUTIVE_DETECTIONS) {
      const recentDetections = detectionHistoryRef.current[name]
        .slice(-CONFIG.REQUIRED_CONSECUTIVE_DETECTIONS);

      // Calculate average and variance
      const avgDistance = recentDetections
        .reduce((sum, d) => sum + d.distance, 0) / recentDetections.length;

      const variance = recentDetections
        .every(d => Math.abs(d.distance - avgDistance) < (avgDistance * CONFIG.DISTANCE_VARIANCE_THRESHOLD));

      if (variance) {
        return true;
      }
    }

    // Track failed attempts
    verificationAttemptsRef.current[name] = (verificationAttemptsRef.current[name] || 0) + 1;
    if (verificationAttemptsRef.current[name] > CONFIG.MAX_VERIFICATION_ATTEMPTS) {
      console.log(`Too many failed verification attempts for ${name}`);
      return false;
    }

    return false;
  };

  useEffect(() => {
    loadModels();
    return () => {
      // Cleanup detection history on unmount
      detectionHistoryRef.current = {};
    };
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

  const recordMissedDetection = (name) => {
    if (detectionHistoryRef.current[name]) {
      // Reset detection history if person is not detected
      detectionHistoryRef.current[name] = [];
    }
  };

  const detectFace = () => {
    setInterval(async () => {
      const detections = await faceapi
        .detectAllFaces(
          videoRef.current, 
          new faceapi.TinyFaceDetectorOptions({
            inputSize: 800, // Increased from 640
            scoreThreshold: CONFIG.MIN_CONFIDENCE_SCORE
          })
        )
        .withFaceLandmarks()
        .withFaceDescriptors();
      
      // Keep track of which names were detected in this interval
      const detectedNames = new Set();
  
      const labeledDetections = await Promise.all(
        detections.map(async (detection) => {
          let label = "Unknown";
          let verifiedMatch = false;
  
          for (const name in referenceImages) {
            const referenceImageDescriptor = await loadReferenceImage(referenceImages[name]);
            const distance = faceapi.euclideanDistance(referenceImageDescriptor, detection.descriptor);
  
            if (distance < accuracy) {
              detectedNames.add(name);
              // Update detection history and check for verification
              const isVerified = updateDetectionHistory(name, distance, detection);
              
              if (isVerified) {
                label = name;
                verifiedMatch = true;
                const timestamp = new Date().toISOString();
  
                setAttendance((prevAttendance) => {
                  const alreadyPresent = prevAttendance.some(
                    (entry) => entry.attender === name
                  );
                
                  if (!alreadyPresent) {
                    return [
                      ...prevAttendance,
                      { 
                        attender: name, 
                        timestamp, 
                        distance, 
                        verified: true,
                        consecutiveDetections: CONFIG.REQUIRED_CONSECUTIVE_DETECTIONS 
                      },
                    ];
                  }
                
                  return prevAttendance;
                });
  
                break;
              }
            }
          }
  
          // If not verified, show verification progress
          const detectionCount = detectionHistoryRef.current[label]?.length || 0;
          const verifyingLabel = verifiedMatch ? 
            label : 
            `Verifying... (${detectionCount}/${CONFIG.REQUIRED_CONSECUTIVE_DETECTIONS})`;
  
          return { 
            detection, 
            label: verifyingLabel,
            verifiedMatch 
          };
        })
      );

      // Record missed detections for anyone not detected in this interval
      Object.keys(referenceImages).forEach(name => {
        if (!detectedNames.has(name)) {
          recordMissedDetection(name);
        }
      });
  
      if (bounding) drawDetections(labeledDetections);
    }, interval * 1000);
  };

  const loadReferenceImage = async (imagePaths) => {
    const img = await faceapi.fetchImage(imagePaths[0]);
    const detections = await faceapi
      .detectSingleFace(img)
      .withFaceLandmarks()
      .withFaceDescriptor();
    return detections ? detections.descriptor : null;
  };

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
  
      labeledDetections.forEach(({ detection, label, verifiedMatch }) => {
        const box = detection.detection.box;
        const color = verifiedMatch ? "#00FF00" : "#FFA500";
  
        // Draw bounding box
        context.strokeStyle = color;
        context.lineWidth = 2;
        context.strokeRect(box.x, box.y, box.width, box.height);
  
        // Draw label without greeting
        context.fillStyle = color;
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
    currentPerson,
  };
};

export default useFaceDetection;