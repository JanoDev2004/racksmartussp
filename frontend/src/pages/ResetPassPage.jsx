import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";

const ResetPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      alert("Please fill in both fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert(`Password for ${username || "user"} has been reset!`);
      navigate("/login");
    }, 1000);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen flex items-center justify-center p-6 relative"
        style={{
          backgroundImage: "url('/final background (1).png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md"
        >
          <motion.img
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            src="/updated_logo-removebg-preview.png"
            alt="RackSmart"
            className="h-28 mx-auto mb-8"
          />

          <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
            Reset Password
          </h2>
          {username && (
            <p className="text-gray-600 text-center mb-6">
              Updating password for: <b>{username}</b>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                New Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full pl-12 pr-5 py-5 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full pl-12 pr-5 py-5 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition-all"
                  required
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-[#fa6709] hover:bg-[#e55a00] text-white font-bold py-5 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-orange-600 font-medium hover:underline flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ResetPassword;
