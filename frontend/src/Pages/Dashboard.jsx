import React from "react";
import { motion } from "framer-motion";
import phoneMockup from "../assets/mobile-mockup.png";

export default function Dashboard() {
  const labels = [
    { text: "Profile view", top: "70px" },
    { text: "Tasks", top: "calc(70px + 4rem + 2rem)" },
    { text: "Events", top: "calc(70px + 8rem + 4rem)" },
  ];

  return (
    <section className="flex flex-col lg:flex-row items-center justify-between px-1 sm:px-6 md:px-8 lg:px-12 pt-0 pb-10 md:pb-16 lg:pb-20 bg-gray-50 min-h-screen relative overflow-hidden">
      {/* Left Section */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="max-w-lg space-y-4 sm:space-y-3 text-center lg:text-left mt-6 md:mt-10"
      >
        <h1 className="text-2xl sm:text-4xl md:text-4xl font-bold text-gray-900 leading-snug">
          Remote Online Closing (RON)
        </h1>

        <p className="text-gray-600 text-base sm:text-lg">
          • save time &nbsp; • more convenient &nbsp; • more efficient •
        </p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-800 text-white px-6 py-3 rounded-md hover:bg-blue-900 transition"
        >
          Create Event
        </motion.button>
      </motion.div>

      {/* Right Section: Mobile Mockup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        viewport={{ once: true }}
        className="relative mt-4 lg:mt-0 flex justify-center lg:justify-end w-full lg:w-auto translate-x-6"
      >
        {/* Mockup Image */}
        <img
          src={phoneMockup}
          alt="Mobile App Mockup"
          className="w-[260px] sm:w-[300px] md:w-[340px] drop-shadow-xl rounded-2xl relative z-10"
        />

        {/* Blue Circle Background */}
        <div className="absolute top-2 right-6 bg-blue-900 w-24 h-24 sm:w-32 sm:h-32 rounded-full -z-10 opacity-20"></div>

        {/* Labels and Arrows */}
        <div className="hidden md:flex absolute -left-20 lg:-left-28 top-[70px] text-gray-800 font-medium text-sm lg:text-base flex-col items-end space-y-12 lg:space-y-16">
          {labels.map((label, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-end"
            >
              <span>{label.text}</span>
              <span className="text-xl lg:text-2xl -rotate-[30deg]">↘</span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
