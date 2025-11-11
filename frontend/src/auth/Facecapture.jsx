import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

const FaceCapture = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("front");
  const [message, setMessage] = useState("Take your front picture");
  const [capturedImages, setCapturedImages] = useState({});
  const [cnicFile, setCnicFile] = useState(null);
  const videoRef = useRef();
  const cnicInputRef = useRef();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert("Camera not accessible");
    }
  };

  const captureImage = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);
    const imageData = canvas.toDataURL("image/png");

    setCapturedImages((prev) => ({ ...prev, [step]: imageData }));

    if (step === "front") {
      setStep("right");
      setMessage("Now turn your face to RIGHT side");
    } else if (step === "right") {
      setStep("left");
      setMessage("Now turn your face to LEFT side");
    } else if (step === "left") {
      setStep("cnic");
      setMessage("Upload your CNIC photo for verification");
    }
  };

  const handleCnicUpload = (e) => {
    setCnicFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!cnicFile || !capturedImages.front) {
      alert("Please complete all steps first");
      return;
    }

    const formData = new FormData();
    // Only front image used for comparison for simplicity
    const blob = await fetch(capturedImages.front).then(res => res.blob());
    formData.append("liveImage", blob, "live.png");
    formData.append("cnicImage", cnicFile);

    try {
      const res = await fetch("http://localhost:5000/api/verify-face", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.match) {
        alert(`✅ Verification Successful (${data.similarity}%)`);
      } else {
        alert(`❌ Verification Failed (${data.similarity}%). Please retry.`);
      }
    } catch (err) {
      alert("Verification error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="relative flex flex-col items-center gap-6 bg-white rounded-2xl p-8 shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">Face Verification</h2>
        <p className="text-center text-gray-500">{message}</p>

        <video
          ref={videoRef}
          autoPlay
          className="w-full rounded-xl border-2 border-indigo-100"
          style={{ maxHeight: 360 }}
        ></video>

        <div className="w-full flex gap-3">
          {step !== "cnic" && (
            <>
              <button
                onClick={startCamera}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
              >
                Start Camera
              </button>
              <button
                onClick={captureImage}
                className="flex-1 bg-[#1a1d7e] text-white py-2 rounded-lg font-medium hover:bg-[#0f1360] transition"
              >
                Capture
              </button>
            </>
          )}
        </div>

        {step === "cnic" && (
          <div className="w-full space-y-3">
            <input
              ref={cnicInputRef}
              type="file"
              onChange={handleCnicUpload}
              className="hidden"
            />

            <button
              onClick={() => cnicInputRef.current && cnicInputRef.current.click()}
              className="w-full bg-[#1a1d7e] text-white py-2 rounded-lg font-medium hover:bg-[#0f1360] transition"
            >
              Upload CNIC Photo
            </button>

            {cnicFile && (
              <p className="text-sm text-gray-600 text-center">{cnicFile.name}</p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-300 transition"
            >
              Submit for Verification
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full bg-gray-100 text-gray-800 py-2 rounded-lg font-medium hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceCapture;
