import React from "react";
import { useNavigate } from "react-router-dom";

const Verification = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="relative flex flex-col items-center gap-6 bg-white rounded-2xl p-8 shadow-md max-w-md w-full">
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Account Created Successfully 🎉
        </h2>
        <p className="text-center text-gray-500">Next step: Verify your identity</p>

        <button
          onClick={() => navigate("/face-capture")}
          className="w-full bg-[#1a1d7e] text-white py-2 rounded-lg font-medium hover:bg-[#0f1360] transition"
        >
          Start Verification
        </button>
      </div>
    </div>
  );
};

export default Verification;
