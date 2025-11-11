import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PlatformSection() {
  const statusCards = [
    { title: "Completed", color: "bg-white" },
    { title: "Canceled", color: "bg-white" },
    { title: "Pending", color: "bg-white" },
    { title: "Upcoming", color: "bg-[#0C1E5B] text-white" },
  ];

  const events = [
    {
      title: "Christian in Chicago",
      time: "Nov 28 | 15:00",
      price: "Free",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-hvNMFSt1Z67DZWjZ2c6SZbR-h-kTpJLC5Q&s",
    },
    {
      title: "Motivational Podcast",
      time: "Nov 28 | 17:00",
      price: "$15.00",
      img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRDYyxd7R7gPt4Fe-0Wdu418KsFETJWLFJExEBFI6Aq--atZZA9TbRNblAmCDaeGCKnpWA&usqp=CAU",
    },
    {
      title: "Sunday Online Meditation",
      time: "Nov 28 | 8:30",
      price: "$23.00",
      img: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=600&q=60",
    },
    {
      title: "Morning Stretching & Exercise",
      time: "Nov 28 | 10:00",
      price: "$12.00",
      img: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?auto=format&fit=crop&w=600&q=60",
    },
  ];

  return (
    <section className="relative bg-gradient-to-b from-white to-blue-50 py-12 md:py-20 overflow-hidden">
      {/* Floating circles background */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        viewport={{ once: true }}
        className="absolute top-10 left-10 w-4 h-4 bg-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        viewport={{ once: true }}
        className="absolute top-20 left-24 w-8 h-8 border-2 border-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        viewport={{ once: true }}
        className="absolute bottom-10 right-10 w-5 h-5 bg-blue-700 rounded-full"
      ></motion.div>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        viewport={{ once: true }}
        className="absolute bottom-20 right-20 w-10 h-10 border-2 border-blue-700 rounded-full"
      ></motion.div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 px-2"
        >
          A smart transaction management <br className="hidden md:block" />
          platform for everything
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-600 max-w-3xl mx-auto mb-8 md:mb-12 text-sm md:text-base px-4"
        >
          Defend is the most sophisticated fraud detection and prevention
          platform with deepfake intelligence and hundreds of other risk
          signals. By digitizing every customer interaction, your business can
          be protected against fraud and forgery, at scale, across every
          department.
        </motion.p>

        {/* Status Cards */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-12 md:mb-16 px-2">
          {statusCards.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -3 }}
              className={`flex flex-col items-center justify-center w-36 h-20 sm:w-44 sm:h-24 rounded-xl sm:rounded-2xl shadow-sm border border-gray-200 ${item.color} cursor-pointer`}
            >
              <div className="flex items-center gap-2">
                <ArrowRight className={`w-3 h-3 sm:w-4 sm:h-4 ${item.title === "Upcoming" ? "text-white" : "text-gray-700"}`} />
                <h3
                  className={`font-semibold text-xs sm:text-sm ${
                    item.title === "Upcoming" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {item.title}
                </h3>
              </div>
              <p
                className={`text-xs mt-1 ${
                  item.title === "Upcoming" ? "text-gray-300" : "text-gray-500"
                }`}
              >
                86 Task
              </p>
            </motion.div>
          ))}
        </div>

        {/* Event Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 text-left">
          {/* Date & Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="md:col-span-1 bg-white rounded-2xl shadow-md p-6 sm:p-8"
          >
            <div className="text-4xl sm:text-5xl font-bold text-[#0C1E5B] mb-2">28</div>
            <p className="text-gray-500 mb-4 sm:mb-6 text-sm sm:text-base">November, 2024</p>
            <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
              Upcoming Online Events
            </h4>
            <button className="flex items-center gap-1 text-xs sm:text-sm font-medium text-[#0C1E5B] hover:underline">
              View all <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </motion.div>

          {/* Event Cards */}
          <div className="md:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {events.map((event, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03, y: -5 }}
                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition-all cursor-pointer"
              >
                <img
                  src={event.img}
                  alt={event.title}
                  className="w-full h-32 sm:h-40 object-cover"
                />
                <div className="p-3 sm:p-4">
                  <p className="text-xs text-gray-500 mb-1">
                    {event.time} • Online event
                  </p>
                  <h5 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">
                    {event.title}
                  </h5>
                  <p className="text-xs sm:text-sm font-medium text-blue-700">
                    {event.price}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
