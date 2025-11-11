import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User logged in");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="relative flex flex-col md:flex-row items-center gap-8 bg-white rounded-2xl p-8 shadow-md max-w-4xl w-full">
        
        {/* Illustration */}
        <div className="hidden md:block w-1/2">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzNSIJqzDXU24Up96wvWy36z4IvghRwiWy1g&s"
            alt="Illustration"
            className="w-full rounded-xl"
          />
        </div>

        {/* Form */}
        <div className="w-full md:w-1/2 bg-[#e9ecfc] p-8 rounded-xl">
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Welcome Back
          </h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Please enter your details to continue
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email */}
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 text-lg"
              >
                👁️
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-[#1a1d7e] text-white py-2 rounded-lg font-medium hover:bg-[#0f1360] transition"
            >
              Login
            </button>

            {/* Google Login */}
            <button
              type="button"
              className="w-full flex items-center justify-center border border-gray-300 py-2 rounded-lg font-medium hover:bg-gray-100 transition text-sm"
            >
              <img
                src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Login with Google
            </button>

            {/* Signup Redirect */}
            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <Link
                to="/signup"
                className="text-blue-600 font-medium hover:underline"
              >
                Sign Up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
