import React from "react";
import { FaFacebookF, FaInstagram } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  const footerSections = [
    {
      title: "About Us",
      content: (
        <>
          <p className="text-sm text-gray-300 mb-2">
            Your trusted partner for exclusive offers and deals tailored to
            your needs.
          </p>
          <p className="text-sm text-gray-400">
            Need help?{" "}
            <a href="#" className="underline hover:text-white">
              Contact Us
            </a>
          </p>
        </>
      ),
    },
    {
      title: "Quick Links",
      content: (
        <ul className="space-y-2 text-sm text-gray-300">
          <li>
            <a href="#" className="hover:text-white transition">
              Home
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              Services
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-white transition">
              FAQs
            </a>
          </li>
        </ul>
      ),
    },
    {
      title: "Contact Information",
      content: (
        <ul className="space-y-2 text-sm text-gray-300">
          <li>📍 Address: Add later</li>
          <li>📞 Phone: 794-716-8830</li>
          <li>✉️ Email: info@deal.com</li>
        </ul>
      ),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between bg-[#f2f6fc] px-4 sm:px-6 md:px-12 lg:px-20 py-12 md:py-16 lg:py-24 gap-8">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="max-w-lg text-center md:text-left"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Protect your business with Proof
          </h1>
          <p className="text-gray-600 mb-6 text-sm sm:text-base">
            Verify your customer's identity and start building a trusted
            relationship in minutes.
          </p>
          <div className="flex justify-center md:justify-start space-x-3 sm:space-x-4 flex-wrap gap-y-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-3 sm:px-4 py-2 rounded-md flex items-center hover:opacity-80 transition text-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/67/App_Store_(iOS).svg"
                alt="App Store"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              />
              App Store
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-black text-white px-3 sm:px-4 py-2 rounded-md flex items-center hover:opacity-80 transition text-sm"
            >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                alt="Google Play"
                className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
              />
              Google Play
            </motion.button>
          </div>
        </motion.div>

        {/* Right Side Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative mt-8 md:mt-0 flex justify-center md:justify-end"
        >
          <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 relative">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1048/1048953.png"
              alt="Phone"
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-52 md:h-52"
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="absolute top-0 right-10 bg-blue-700 w-4 h-4 rounded-full"
          ></motion.div>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            viewport={{ once: true }}
            className="absolute bottom-5 left-5 bg-blue-400 w-6 h-6 rounded-full"
          ></motion.div>
        </motion.div>
      </section>

      {/* Footer Section */}
      <footer className="bg-[#0b1b46] text-white py-8 sm:py-12 px-4 sm:px-6 md:px-12 lg:px-20 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-gray-700 pb-8 sm:pb-10">
          {/* About Us, Quick Links, Contact Info */}
          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">{section.title}</h3>
              {section.content}
            </motion.div>
          ))}

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
              Subscribe to our newsletter
            </h3>
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 rounded-md text-gray-900 outline-none border border-gray-300 placeholder:text-gray-400 text-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-blue-600 hover:bg-blue-700 transition text-white py-2 rounded-md text-sm font-medium"
              >
                Subscribe
              </motion.button>
            </form>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-gray-400 text-xs sm:text-sm pt-6 gap-3"
        >
          <p>© All rights reserved. Made by Deal</p>
          <div className="flex space-x-4">
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              className="hover:text-white transition"
            >
              <FaInstagram />
            </motion.a>
            <motion.a
              href="#"
              whileHover={{ scale: 1.2, color: "#ffffff" }}
              className="hover:text-white transition"
            >
              <FaFacebookF />
            </motion.a>
          </div>
        </motion.div>
      </footer>
    </div>
  );
};

export default Footer;
