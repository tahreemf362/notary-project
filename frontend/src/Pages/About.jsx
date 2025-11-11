import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

// Import all 5 mockup images
import mockup1 from "../assets/mobile-mockup.png";
import mockup2 from "../assets/mobile-mockup2.png";
import mockup3 from "../assets/mobile-mockup3.png";
import mockup4 from "../assets/mobile-mockup4.png";
import mockup5 from "../assets/mobile-mockup5.png";

export default function About() {
  const images = [mockup1, mockup2, mockup3, mockup4, mockup5];
  const [current, setCurrent] = useState(2); // middle image as default focus

  // Move carousel
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  const nextSlide = () =>
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));

  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 py-12 md:py-20 overflow-hidden">
      {/* ===== Floating background circles ===== */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute top-10 left-10 w-4 h-4 bg-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute top-20 left-24 w-8 h-8 border-2 border-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="absolute bottom-10 right-10 w-5 h-5 bg-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        viewport={{ once: true }}
        className="absolute bottom-20 right-20 w-10 h-10 border-2 border-blue-700 rounded-full"
      ></motion.div>

      {/* ===== Content ===== */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-snug px-2"
        >
          Sign and notarize documents with audio <br className="hidden md:block" /> 
          and video anytime, anywhere on a <br className="hidden md:block" />
          computer or your phone
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 text-sm md:text-base leading-relaxed px-4"
        >
          Important forms require a notarization or a witness, and now they can
          be completed without asking your customer to find a notary. The
          Notarize Network has completed millions of online notarizations.
          Notaries are available 24/7 and documents are acceptable in all 50
          states.
        </motion.p>

        {/* ===== Image Carousel Section ===== */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="flex justify-center items-center relative px-4"
        >
          {/* Left Arrow */}
          <button
            onClick={prevSlide}
            className="absolute left-0 sm:left-2 md:left-8 z-20 bg-blue-700 p-2 sm:p-3 rounded-full cursor-pointer hover:bg-blue-800 transition shadow-lg"
          >
            <ArrowRight className="text-white rotate-180 w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Images */}
          <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 transition-all overflow-hidden">
            {images.map((img, index) => {
              const distance = Math.abs(index - current);
              const isCenter = index === current;

              // Consistent scaling & opacity - FIXED to remove differences
              let scale = 0.7;
              let opacity = 0.5;
              if (distance === 1) {
                scale = 0.85;
                opacity = 0.75;
              }
              if (isCenter) {
                scale = 1;
                opacity = 1;
              }

              // FIXED: Consistent width for all images
              const baseWidth = 140; // Base width for side images
              const centerWidth = 180; // Width for center image
              const width = isCenter ? centerWidth : baseWidth;

              return (
                <motion.img
                  key={index}
                  src={img}
                  alt={`Mockup ${index + 1}`}
                  className="rounded-xl sm:rounded-2xl drop-shadow-lg transition-all duration-500"
                  style={{
                    transform: `scale(${scale})`,
                    opacity,
                    width: `${width}px`,
                    height: "auto", // FIXED: Maintain aspect ratio
                    objectFit: "contain", // FIXED: Prevent distortion
                  }}
                  whileHover={{ scale: scale * 1.05 }}
                />
              );
            })}
          </div>

          {/* Right Arrow */}
          <button
            onClick={nextSlide}
            className="absolute right-0 sm:right-2 md:right-8 z-20 bg-blue-700 p-2 sm:p-3 rounded-full cursor-pointer hover:bg-blue-800 transition shadow-lg"
          >
            <ArrowRight className="text-white w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
