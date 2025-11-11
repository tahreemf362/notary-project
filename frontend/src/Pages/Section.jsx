import React from "react";
import { MessageSquare, Video, FileText } from "lucide-react";
import { motion } from "framer-motion";

export default function Section() {
  const cards = [
    { icon: MessageSquare, label: "Messenger", isActive: false },
    { icon: Video, label: "Video Conference", isActive: true },
    { icon: FileText, label: "Document", isActive: false },
  ];

  return (
    <section className="bg-[#0C1E5B] text-white py-12 md:py-20 px-4 sm:px-6 lg:px-8 text-center">
      <motion.h2
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 px-2"
      >
        The Notarize Network never sleeps
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="text-gray-300 max-w-2xl mx-auto mb-8 md:mb-12 text-sm md:text-base px-4"
      >
        The largest network of online notaries performing notarizations and
        checking IDs. It's the internet's trust agent.
      </motion.p>

      <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className={`w-36 h-36 sm:w-40 sm:h-40 flex flex-col items-center justify-center rounded-xl transition-all cursor-pointer ${
                card.isActive
                  ? "bg-white text-[#0C1E5B] shadow-lg scale-105"
                  : "border border-gray-400 hover:bg-[#1B2B6B]"
              }`}
            >
              <Icon className={`w-7 h-7 sm:w-8 sm:h-8 mb-2 ${card.isActive ? "" : "text-gray-300"}`} />
              <span className={`text-xs sm:text-sm ${card.isActive ? "font-semibold" : "text-gray-200"}`}>
                {card.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
