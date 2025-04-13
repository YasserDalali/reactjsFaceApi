import { useState, useEffect, useRef } from "react";
import * as faceapi from "face-api.js";
import sb from '../database/supabase-client';

const useFaceDetection = (threshold = 0.4) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [attendance, setAttendance] = useState([]);
  const descriptorsRef = useRef({});
  const employeeDataRef = useRef({}); // Store employee data for attendance logging
  
  // Store detection results for API
  const [detectionResults, setDetectionResults] = useState({
    sessions: [], // Array of detection sessions
    totalDetections: 0,
    lastUpdate: null,
    verifiedUsers: new Set(), // Unique verified users
  });

  // Configuration for stricter detection
  const CONFIG = {
    MIN_CONFIDENCE: 0.5, // Reduced from 0.8 for easier detection
    MIN_FACE_SIZE: 80,  // Reduced minimum face size
    REQUIRED_CONSECUTIVE_DETECTIONS: 2, // Reduced for faster recognition
    DETECTION_INTERVAL: 100,
    MAX_ANGLE: 25, // Increased angle tolerance
    MIN_BRIGHTNESS: 0.3, // Reduced brightness requirement
    MIN_FACE_SCORE: 0.3, // Reduced minimum face score
    MAX_DETECTION_DISTANCE: 0.7, // Increased distance threshold
    MIN_LANDMARKS_VISIBILITY: 0,
  };

  // Track consecutive detections
  const consecutiveDetectionsRef = useRef({});

  // Fetch employee data and images from Supabase
  const fetchEmployeeData = async () => {
    try {
      console.log('Starting to fetch employee data and faces...');

      // First, list all files in the employee-avatars bucket
      const { data: files, error: storageError } = await sb.storage
        .from('employee-avatars')
        .list();

      if (storageError) {
        console.error('Error listing files:', storageError);
        throw storageError;
      }

      console.log('Found files in bucket:', files);

      // Get all employees data
      const { data: employees, error: dbError } = await sb
        .from('employees')
        .select('id, name, avatar_url')
        .not('avatar_url', 'is', null);

      if (dbError) {
        console.error('Error fetching employees:', dbError);
        throw dbError;
      }

      console.log('Found employees:', employees);

      const referenceImages = {};
      const processedEmployees = new Set();

      // Process each employee
      for (const employee of employees) {
        if (!employee.avatar_url || processedEmployees.has(employee.name)) continue;

        try {
          // Get the public URL for the employee's avatar
          const { data: avatarData } = sb.storage
            .from('employee-avatars')
            .getPublicUrl(employee.avatar_url);

          if (avatarData?.publicUrl) {
            // Store employee data for later use
            employeeDataRef.current[employee.name] = {
              id: employee.id,
              name: employee.name
            };

            // Initialize array for this employee's face images
            referenceImages[employee.name] = [avatarData.publicUrl];
            processedEmployees.add(employee.name);

            console.log(`Processed avatar for ${employee.name}:`, avatarData.publicUrl);

            // Look for additional training images with the employee's name
            const employeeFiles = files.filter(file => 
              file.name.toLowerCase().includes(employee.name.toLowerCase()) &&
              file.name !== employee.avatar_url
            );

            // Add additional training images if found
            for (const file of employeeFiles) {
              const { data: additionalImage } = sb.storage
                .from('employee-avatars')
                .getPublicUrl(file.name);

              if (additionalImage?.publicUrl) {
                referenceImages[employee.name].push(additionalImage.publicUrl);
                console.log(`Added additional training image for ${employee.name}:`, file.name);
              }
            }
          }
        } catch (error) {
          console.error(`Error processing employee ${employee.name}:`, error);
        }
      }

      // Look for any training images that might not be linked to employees
      for (const file of files) {
        // Skip already processed files
        if ([...processedEmployees].some(name => 
          file.name.toLowerCase().includes(name.toLowerCase())
        )) continue;

        // Try to extract name from filename (assuming format: name_*.jpg)
        const nameMatch = file.name.match(/^([^_]+)/);
        if (nameMatch) {
          const name = nameMatch[1];
          if (!referenceImages[name]) {
            const { data: imageData } = sb.storage
              .from('employee-avatars')
              .getPublicUrl(file.name);

            if (imageData?.publicUrl) {
              if (!referenceImages[name]) {
                referenceImages[name] = [];
                console.log(`Found training images for unlisted employee: ${name}`);
              }
              referenceImages[name].push(imageData.publicUrl);
            }
          }
        }
      }

      console.log('Finished processing employee faces:', {
        employeeCount: Object.keys(referenceImages).length,
        totalImages: Object.values(referenceImages).flat().length
      });

      return referenceImages;
    } catch (error) {
      console.error('Error fetching employee data:', error);
      return {};
    }
  };

  // Log attendance to Supabase using MCP
  const logAttendance = async (employeeName, confidence) => {
    try {
      console.log('🔍 Starting attendance logging process for:', employeeName);
      
      const employeeData = employeeDataRef.current[employeeName];
      if (!employeeData) {
        console.error('❌ Employee data not found in ref:', employeeName);
        console.log('Current employeeDataRef:', employeeDataRef.current);
        return false;
      }

      console.log('📋 Employee data found:', employeeData);

      // Get today's date in ISO format for comparison
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      console.log('📅 Checking attendance between:', {
        today: today.toISOString(),
        tomorrow: tomorrow.toISOString()
      });

      // Check if attendance already exists for today
      const checkQuery = `
        SELECT id, checkdate 
        FROM attendance 
        WHERE employee_id = ${employeeData.id}
        AND checkdate >= '${today.toISOString()}'
        AND checkdate < '${tomorrow.toISOString()}'
        LIMIT 1;
      `;
      
      console.log('🔍 Executing check query:', checkQuery);
      
      const checkResult = await window.mcp_supabase_execute_sql({
        project_id: "zfkdqglvibuxgjexkall",
        query: checkQuery
      });

      console.log('📊 Check result:', checkResult);

      const existingAttendance = checkResult?.data || [];

      // Only proceed if no attendance record exists for today
      if (existingAttendance.length === 0) {
        console.log('✨ No existing attendance found, proceeding with new record');
        
        const now = new Date();
        const startTime = new Date(now);
        startTime.setHours(9, 0, 0, 0);

        const lateness = now > startTime ? 
          Math.floor((now - startTime) / (1000 * 60)) : 
          0;

        console.log('⏰ Calculated lateness:', {
          now: now.toISOString(),
          startTime: startTime.toISOString(),
          latenessMinutes: lateness
        });

        // Insert new attendance record
        const insertQuery = `
          INSERT INTO attendance (
            employee_id, 
            checkdate, 
            status, 
            lateness
          ) VALUES (
            ${employeeData.id},
            '${now.toISOString()}',
            '${lateness > 0 ? 'late' : 'on_time'}',
            ${lateness > 0 ? `'${lateness} minutes'` : 'NULL'}
          ) RETURNING id, checkdate;
        `;

        console.log('📝 Executing insert query:', insertQuery);

        const insertResult = await window.mcp_supabase_execute_sql({
          project_id: "zfkdqglvibuxgjexkall",
          query: insertQuery
        });

        console.log('📊 Insert result:', insertResult);

        if (insertResult?.data?.[0]?.id) {
          console.log(`✅ Successfully logged attendance for ${employeeName}`);
          return true;
        } else {
          console.error('❌ Failed to insert attendance record:', insertResult);
          return false;
        }
      } else {
        console.log(`ℹ️ Attendance already logged for ${employeeName} at ${existingAttendance[0].checkdate}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error in logAttendance:', error);
      return false;
    }
  };

  // Enhanced face quality check
  const checkFaceQuality = (detection, videoElement) => {
    const { width, height, score } = detection.detection.box;
    
    console.log('Face detection quality:', {
      score,
      width,
      height,
      minRequired: CONFIG.MIN_FACE_SIZE
    });

    // Check detection score
    if (score < CONFIG.MIN_FACE_SCORE) {
      console.log('Failed quality check: Low detection confidence', score);
      return { isValid: false, reason: 'Low detection confidence' };
    }

    // Check face size
    if (width < CONFIG.MIN_FACE_SIZE || height < CONFIG.MIN_FACE_SIZE) {
      console.log('Failed quality check: Face too small', { width, height });
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
    
    const visibilityRatio = visibleNosePoints / nosePoints;
    console.log('Face visibility ratio:', visibilityRatio);
    
    if (visibilityRatio < CONFIG.MIN_LANDMARKS_VISIBILITY) {
      console.log('Failed quality check: Face partially covered');
      return { isValid: false, reason: 'Face partially covered' };
    }

    // Check face angle
    const angle = Math.abs(Math.atan2(
      rightEye[0].y - leftEye[0].y,
      rightEye[0].x - leftEye[0].x
    ) * (180 / Math.PI));
    
    console.log('Face angle:', angle);
    
    if (angle > CONFIG.MAX_ANGLE) {
      console.log('Failed quality check: Face angle too large', angle);
      return { isValid: false, reason: 'Face not aligned properly' };
    }

    // Check face symmetry (detect partial face)
    const leftSide = landmarks.getJawOutline().slice(0, 8);
    const rightSide = landmarks.getJawOutline().slice(8);
    const symmetryRatio = Math.abs(leftSide.length - rightSide.length) / leftSide.length;
    
    console.log('Face symmetry ratio:', symmetryRatio);
    
    if (symmetryRatio > 0.2) {
      console.log('Failed quality check: Face asymmetry too high', symmetryRatio);
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
  const storeDetectionResult = async (detection, match) => {
    console.log('🎯 Detection result:', {
      label: match.label,
      confidence: match.confidence,
      threshold: 0.7
    });

    // Only attempt to log attendance if confidence is high enough
    if (match.confidence > 0.7) {
      console.log('✨ Confidence threshold met, attempting to log attendance');
      const attendanceLogged = await logAttendance(match.label, match.confidence);
      
      if (attendanceLogged) {
        console.log('📝 Attendance logged successfully, updating UI');
        const timestamp = new Date().toISOString();

        setDetectionResults(prev => {
          const newSession = {
            timestamp,
            userId: match.label,
            confidence: match.confidence,
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

        setAttendance(prev => {
          const exists = prev.some(entry => entry.attender === match.label);
          if (!exists) {
            return [...prev, {
              attender: match.label,
              timestamp,
              confidence: match.confidence,
              verified: true
            }];
          }
          return prev;
        });
      } else {
        console.log('ℹ️ Attendance logging skipped (already logged or error occurred)');
      }
    } else {
      console.log('⚠️ Confidence too low to log attendance:', match.confidence);
    }
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
        
        // Load reference images from Supabase
        const referenceImages = await fetchEmployeeData();
        await loadReferenceProfiles(referenceImages);
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

  const loadReferenceProfiles = async (referenceImages) => {
    for (const [name, images] of Object.entries(referenceImages)) {
      try {
        const descriptors = await Promise.all(
          images.map(async (imageUrl) => {
            try {
              const img = await faceapi.fetchImage(imageUrl);
              const detection = await faceapi
                .detectSingleFace(img, new faceapi.SsdMobilenetv1Options({ minConfidence: CONFIG.MIN_CONFIDENCE }))
                .withFaceLandmarks()
                .withFaceDescriptor();
              return detection?.descriptor;
            } catch (error) {
              console.error(`Error processing image for ${name}:`, error);
              return null;
            }
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

        try {
          const detections = await faceapi
            .detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options({ 
              minConfidence: CONFIG.MIN_CONFIDENCE,
              maxResults: 1
            }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (!detections.length) {
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');
            context.clearRect(0, 0, canvas.width, canvas.height);
            return;
          }

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
            
            // Draw face landmarks for better visualization
            const landmarks = detection.landmarks;
            const drawLandmarks = new faceapi.draw.DrawFaceLandmarks(landmarks);
            drawLandmarks.draw(canvas);

            if (!qualityCheck.isValid) {
              // Draw red box with reason
              const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
                label: qualityCheck.reason,
                boxColor: '#ff0000',
                drawLabelOptions: {
                  fontSize: 16,
                  fontStyle: 'bold',
                  padding: 10
                }
              });
              drawBox.draw(canvas);
              continue;
            }

            let bestMatch = { label: 'Unknown', distance: 1 };
            let matchCount = 0;
            let totalDistance = 0;

            // Find best match with averaging
            for (const [name, descriptors] of Object.entries(descriptorsRef.current)) {
              for (const referenceDescriptor of descriptors) {
                const distance = faceapi.euclideanDistance(detection.descriptor, referenceDescriptor);
                if (distance < CONFIG.MAX_DETECTION_DISTANCE) {
                  matchCount++;
                  totalDistance += distance;
                  if (distance < bestMatch.distance) {
                    bestMatch = { label: name, distance };
                  }
                }
              }
            }

            // Calculate average confidence for this match
            const averageDistance = matchCount > 0 ? totalDistance / matchCount : 1;
            const confidence = 1 - averageDistance;

            // Only proceed if we have a good match
            if (bestMatch.label !== 'Unknown' && confidence > 0.6) {
              if (updateConsecutiveDetections(bestMatch.label, bestMatch)) {
                // Draw green box with name above
                const boxWithText = {
                  ...detection.detection.box,
                  y: detection.detection.box.y - 30 // Move label above the box
                };
                
                // Draw name label background
                context.fillStyle = 'rgba(0, 255, 0, 0.3)';
                context.fillRect(
                  boxWithText.x - 5,
                  boxWithText.y - 5,
                  context.measureText(bestMatch.label).width + 10,
                  30
                );

                // Draw box
                const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
                  label: `${bestMatch.label} (${(confidence * 100).toFixed(1)}%)`,
                  boxColor: '#00ff00',
                  drawLabelOptions: {
                    fontSize: 16,
                    fontStyle: 'bold',
                    padding: 10
                  }
                });
                drawBox.draw(canvas);

                // Log attendance if confidence is high enough
                if (confidence > 0.7) {
                  await storeDetectionResult(detection, {
                    ...bestMatch,
                    confidence
                  });
                }
              }
            } else {
              // Draw yellow box for unknown face
              const drawBox = new faceapi.draw.DrawBox(detection.detection.box, {
                label: 'Unknown Person',
                boxColor: '#ffff00',
                drawLabelOptions: {
                  fontSize: 16,
                  fontStyle: 'bold',
                  padding: 10
                }
              });
              drawBox.draw(canvas);
            }
          }
        } catch (error) {
          console.error('Error during face detection:', error);
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