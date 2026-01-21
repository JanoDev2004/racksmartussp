import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const ForgotPassPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");

    try {
      setLoading(true);
      await axios.post("/auth/forgot-password", { email });
      toast.success("Password reset link sent to your email");
      setEmail("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <motion.div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-2">Forgot Password</h2>
        <p className="text-center text-gray-600 mb-8">
          Enter your email and we’ll send a reset link.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 py-4 border rounded-xl"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-xl"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <button
          onClick={() => navigate("/login")}
          className="mt-6 flex items-center gap-2 text-orange-600 mx-auto"
        >
          <ArrowLeft size={16} /> Back to Login
        </button>
      </motion.div>
    </div>
  );
};

export default ForgotPassPage;
