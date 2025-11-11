import React, { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const FaceVerify = () => {
  const videoRef = useRef();
  const canvasRef = useRef();
  const [message, setMessage] = useState("Loading models...");

  // Models load karna
  useEffect(() => {
    const loadModels = async () => {
      try {
        await faceapi.nets.ssdMobilenetv1.loadFromUri("/models");
        await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        await faceapi.nets.faceRecognitionNet.loadFromUri("/models");
        setMessage("Models Loaded ✅ Now start camera...");
      } catch (error) {
        setMessage("Model loading failed ❌");
        console.error(error);
      }
    };
    loadModels();
  }, []);

  // Camera start karna
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error: ", err);
    }
  };

  // Face detection karna
  const handleCapture = async () => {
    const detections = await faceapi
      .detectAllFaces(videoRef.current)
      .withFaceLandmarks()
      .withFaceDescriptors();

    if (detections.length > 0) {
      setMessage("Face captured ✅ Uploading to server...");
      // Yahan API call karna hai backend ko send karne ke liye
      // Example: send detections[0].descriptor
    } else {
      setMessage("No face detected ❌ Try again!");
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Face Verification</h2>
      <p>{message}</p>

      <video
        ref={videoRef}
        autoPlay
        muted
        width="400"
        height="300"
        style={{ borderRadius: "10px" }}
      ></video>

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div style={{ marginTop: "20px" }}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={handleCapture}>Capture Face</button>
      </div>
    </div>
  );
};

export default FaceVerify;
