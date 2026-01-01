import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    id: 1,
    title: "Racksmart Stock Control ",
    desc: "Monitor your stock in real-time with advanced analytics and insights dashboards.",
    img: "/1.png",
  },
  {
    id: 2,
    title: "Powerful Tracker & Reports",
    desc: "One click. Instant report. Smarter tracking with Racksmart Transaction Tracker.",
    img: "/index carousel-III.png",
  },
  {
    id: 3,
    title: "Secure Multi-User Access",
    desc: "Admin, Inventory, and Project Personnel roles all with controlled permissions for security.",
    img: "/3.png",
  },
  {
    id: 4,
    title: "Available on Mobile Browser",
    desc: "Stay connected on the go. Access Racksmart anytime, anywhere on mobile.",
    img: "/4.png",
  },
];

const Index = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Poppins Font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      {/* Full Viewport - No Scroll Ever */}
      <div
        className="h-screen w-screen overflow-hidden bg-[#010197] via-[#0a0080] to-black text-white flex items-center justify-center relative"
        style={{ fontFamily: "'Poppins', sans-serif"  }}
        
      >
        {/* Animated Blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-orange-600/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/3 -right-32 w-80 h-80 bg-blue-600/30 rounded-full blur-3xl animate-pulse delay-700" />
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-700/20 rounded-full blur-3xl animate-pulse delay-300" />
        </div>

        <div className="absolute inset-0 bg-black/50" />

        {/* Main Content - Wider & Shorter Card */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center h-full py-10">
          
          {/* Left Side - Text + Button */}
          <div className="text-center lg:text-left space-y-8">
            {/* Logo */}
            <motion.img
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              src="/updated_logo-removebg-preview.png"
              alt="Racksmart"
              className="w-24 h-24 mx-auto lg:mx-0 drop-shadow-2xl"
            />

            {/* Animated Title & Desc */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold bg-white to-orange-400 bg-clip-text text-transparent leading-tight">
                  {slides[current].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 font-medium max-w-lg mx-auto lg:mx-0">
                  {slides[current].desc}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center lg:justify-start gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    i === current
                      ? "bg-[#fa6709] w-12 shadow-lg shadow-orange-500/60"
                      : "bg-white/40 w-3"
                  }`}
                />
              ))}
            </div>

            {/* Start Now Button - Always Visible */}
            <Link
              to="/login"
              className="inline-block px-16 py-6 text-2xl font-bold rounded-full bg-from-[#fa6709] to-orange-600 shadow-lg hover:shadow-orange-500/70 transform hover:scale-105 transition-all duration-300"
            >
              Start Now!
            </Link>

            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Upright Storage Solutions PH. All Rights Reserved.
            </p>
          </div>

          {/* Right Side - Image Card (Wider, Shorter) */}
          <div className="flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={current}
                initial={{ opacity: 0, scale: 0.9, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.9, rotateY: 15 }}
                transition={{ duration: 0.7 }}
                className="w-full max-w-2xl"
                style={{ perspective: 1200 }}
              >
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  className="bg-white/10 backdrop-blur-2xl rounded-3xl p-8 border border-white/20 shadow-2xl"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
                  }}
                >
                  <img
                    src={slides[current].img}
                    alt={slides[current].title}
                    className="w-full rounded-2xl shadow-2xl border border-white/20"
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;