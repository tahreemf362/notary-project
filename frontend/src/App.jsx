import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Auth pages (corrected case)
import Login from "./auth/Login";
import Signup from "./auth/Signup";

// Main components
import Navbar from "./components/Navbar";
import Dashboard from "./Pages/Dashboard";
import About from "./Pages/About";
import Section from "./Pages/Section";
import PlatformSection from "./Pages/PlatformSection"; // also corrected filename spelling
import Footer from "./Pages/Footer";

function App() {
  return (
    <Router>
      <Routes>
        {/* Home route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Dashboard />
              <About />
              <Section />
              <PlatformSection />
              <Footer />
            </>
          }
        />
        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
