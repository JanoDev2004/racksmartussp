import React, { useState } from "react";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const ResetPassPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword)
      return toast.error("All fields are required");

    if (newPassword !== confirmNewPassword)
      return toast.error("Passwords do not match");

    try {
      setLoading(true);
      await axios.post("/auth/reset-password", {
        token,
        newPassword,
        confirmNewPassword,
      });

      toast.success("Password reset successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative">
      <motion.div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="font-semibold">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-12 py-4 border rounded-xl"
                required
              />
            </div>
          </div>

          <div>
            <label className="font-semibold">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="w-full pl-12 py-4 border rounded-xl"
                required
              />
            </div>
          </div>

          <button
            disabled={loading}
            className="w-full bg-orange-600 text-white py-4 rounded-xl"
          >
            {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassPage;
