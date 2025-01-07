import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";

const useFaceDetection = (referenceImages, threshold = 0.4) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const descriptorsRef = useRef({});
  
  // Store detection results for API
  const [detectionResults, setDetectionResults] = useState({
    sessions: [], // Array of detection sessions
    totalDetections: 0,
    lastUpdate: null,
    verifiedUsers: new Set(), // Unique verified users
  });

  // Configuration for stricter detection
  const CONFIG = {
    MIN_CONFIDENCE: 0.8, // Increased from 0.8 to 0.85
    MIN_FACE_SIZE: 100,  // Increased minimum face size
    REQUIRED_CONSECUTIVE_DETECTIONS: 5, // Need multiple consistent detections
    DETECTION_INTERVAL: 100,
    MAX_ANGLE: 12, // Reduced maximum angle deviation
    MIN_BRIGHTNESS: 0.5, // Increased brightness requirement
    MIN_FACE_SCORE: 0.5, // Minimum face detection score
    MAX_DETECTION_DISTANCE: 0.7, // Maximum allowed distance for face matching
    MIN_LANDMARKS_VISIBILITY: 0, // Minimum ratio of visible landmarks
  };

  // Track consecutive detections
  const consecutiveDetectionsRef = useRef({});

  // Enhanced face quality check
  const checkFaceQuality = (detection, videoElement) => {
    const { width, height, score } = detection.detection.box;
    
    // Check detection score
    if (score < CONFIG.MIN_FACE_SCORE) {
      return { isValid: false, reason: 'Low detection confidence' };
    }

    // Check face size
    if (width < CONFIG.MIN_FACE_SIZE || height < CONFIG.MIN_FACE_SIZE) {
      return { isValid: false, reason: 'Face too small or too far' };
    }

    // Check face angle
    const landmarks = detection.landmarks;
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const nose = landmarks.getNose();
    
    // Check if nose points are visible (detect partial face coverage)
    const nosePoints = nose.length;
    const visibleNosePoints = nose.filter(point => 
      point.x >= 0 && point.x <= videoElement.width &&
      point.y >= 0 && point.y <= videoElement.height
    ).length;
    
    if (visibleNosePoints / nosePoints < CONFIG.MIN_LANDMARKS_VISIBILITY) {
      return { isValid: false, reason: 'Face partially covered' };
    }

    // Check face angle
    const angle = Math.abs(Math.atan2(
      rightEye[0].y - leftEye[0].y,
      rightEye[0].x - leftEye[0].x
    ) * (180 / Math.PI));
    
    if (angle > CONFIG.MAX_ANGLE) {
      return { isValid: false, reason: 'Face not aligned properly' };
    }

    // Check face symmetry (detect partial face)
    const leftSide = landmarks.getJawOutline().slice(0, 8);
    const rightSide = landmarks.getJawOutline().slice(8);
    const symmetryRatio = Math.abs(leftSide.length - rightSide.length) / leftSide.length;
    
    if (symmetryRatio > 0.2) { // More than 20% asymmetry
      return { isValid: false, reason: 'Face partially visible' };
    }

    return { isValid: true };
  };

  // Track consecutive successful detections
  const updateConsecutiveDetections = (personId, match) => {
    const currentTime = Date.now();
    
    // Reset if too much time has passed
    if (consecutiveDetectionsRef.current[personId]?.lastDetection &&
        currentTime - consecutiveDetectionsRef.current[personId].lastDetection > 2000) {
      consecutiveDetectionsRef.current[personId] = {
        count: 1,
        lastDetection: currentTime,
        averageDistance: match.distance
      };
      return false;
    }

    if (!consecutiveDetectionsRef.current[personId]) {
      consecutiveDetectionsRef.current[personId] = {
        count: 1,
        lastDetection: currentTime,
        averageDistance: match.distance
      };
      return false;
    }

    const current = consecutiveDetectionsRef.current[personId];
    current.count += 1;
    current.lastDetection = currentTime;
    current.averageDistance = (current.averageDistance * (current.count - 1) + match.distance) / current.count;

    // Check if we have enough consistent detections
    return current.count >= CONFIG.REQUIRED_CONSECUTIVE_DETECTIONS &&
           current.averageDistance <= CONFIG.MAX_DETECTION_DISTANCE;
  };

  // Store detection result
  const storeDetectionResult = (detection, match) => {
    const timestamp = new Date().toISOString();
    
    setDetectionResults(prev => {
      const newSession = {
        timestamp,
        userId: match.label,
        confidence: 1 - match.distance,
        faceLocation: detection.detection.box,
        detectionType: 'FACE_RECOGNITION',
        deviceInfo: {
          userAgent: navigator.userAgent,
          timestamp: Date.now(),
        }
      };

      return {
        ...prev,
        sessions: [...prev.sessions, newSession],
        totalDetections: prev.totalDetections + 1,
        lastUpdate: timestamp,
        verifiedUsers: new Set([...prev.verifiedUsers, match.label])
      };
    });
  };

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
          faceapi.nets.faceRecognitionNet.loadFromUri('/models')
        ]);
        await startVideo();
        await loadReferenceProfiles();
      } catch (error) {
        console.error('Error loading models:', error);
      } finally {
        setLoading(false);
      }
    };

    loadModels();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startVideo = async () => {
    try {
      // First get list of available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      
      console.log('Available video devices:', videoDevices); // Debug available devices

      // Try to use the last device in the list (usually external webcam)
      // If not available, fall back to default
      const deviceId = videoDevices.length > 1 ? videoDevices[videoDevices.length - 1].deviceId : undefined;

      const constraints = {
        video: {
          deviceId: deviceId ? { exact: deviceId } : undefined,
          width: { min: 640, ideal: 1280, max: 1920 },
          height: { min: 480, ideal: 720, max: 1080 },
          facingMode: "user",
          frameRate: { ideal: 10 }
        }
      };

      console.log('Using video constraints:', constraints); // Debug selected constraints

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(err => {
            console.error('Error playing video:', err);
          });
        };
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      // Try fallback to any available camera
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ 
          video: true 
        });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
      } catch (fallbackError) {
        console.error('Fallback camera also failed:', fallbackError);
      }
    }
  };

  const loadReferenceProfiles = async () => {
    for (const [name, images] of Object.entries(referenceImages)) {
      try {
        const descriptors = await Promise.all(
          images.map(async (imageUrl) => {
            const img = await faceapi.fetchImage(imageUrl);
            const detection = await faceapi
              .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: CONFIG.MIN_CONFIDENCE }))
              .withFaceLandmarks()
              .withFaceDescriptor();
            return detection?.descriptor;
          })
        );
        
        const validDescriptors = descriptors.filter(Boolean);
        if (validDescriptors.length > 0) {
          descriptorsRef.current[name] = validDescriptors;
        }
      } catch (error) {
        console.error(`Error loading reference image for ${name}:`, error);
      }
    }
  };

  useEffect(() => {
    if (!loading && videoRef.current) {
      const interval = setInterval(async () => {
        if (!videoRef.current || !canvasRef.current) return;

        const detections = await faceapi
          .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ minConfidence: CONFIG.MIN_CONFIDENCE }))
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (!detections.length) return;

        const canvas = canvasRef.current;
        const displaySize = { 
          width: videoRef.current.videoWidth, 
          height: videoRef.current.videoHeight 
        };
        
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        const context = canvas.getContext('2d');
        context.clearRect(0, 0, canvas.width, canvas.height);

        for (const detection of resizedDetections) {
          const qualityCheck = checkFaceQuality(detection, videoRef.current);
          if (!qualityCheck.isValid) {
            continue;
          }

          let bestMatch = { label: 'Unknown', distance: 1 };

          // Find best match
          for (const [name, descriptors] of Object.entries(descriptorsRef.current)) {
            for (const referenceDescriptor of descriptors) {
              const distance = faceapi.euclideanDistance(detection.descriptor, referenceDescriptor);
              if (distance < CONFIG.MAX_DETECTION_DISTANCE && distance < bestMatch.distance) {
                bestMatch = { label: name, distance };
              }
            }
          }

          if (bestMatch.label !== 'Unknown') {
            // Only store and update attendance if we have enough consecutive detections
            if (updateConsecutiveDetections(bestMatch.label, bestMatch)) {
              storeDetectionResult(detection, bestMatch);
              
              setAttendance(prev => {
                const exists = prev.some(entry => entry.attender === bestMatch.label);
                if (!exists) {
                  return [...prev, {
                    attender: bestMatch.label,
                    timestamp: new Date().toISOString(),
                    distance: bestMatch.distance,
                    verified: true,
                    confidence: 1 - bestMatch.distance
                  }];
                }
                return prev;
              });
            }
          }

          const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
            label: `${bestMatch.label} (${(1 - bestMatch.distance).toFixed(2)})`,
            boxColor: bestMatch.label !== 'Unknown' ? '#00ff00' : '#ff0000'
          });
          drawBox.draw(canvas);
        }
      }, CONFIG.DETECTION_INTERVAL);

      return () => clearInterval(interval);
    }
  }, [loading, threshold]);

  return {
    videoRef,
    canvasRef,
    attendance,
    loading,
    detectionResults, // Now returning detection results for API use
  };
};

export default useFaceDetection;