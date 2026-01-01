import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";
import { toast } from "react-hot-toast";
import { HelpCircle } from "lucide-react";

const MAX_ATTEMPTS = 5;
const LOCK_TIME = 10 * 60 * 1000; // 10 minutes

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading } = useUserStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(null);

  useEffect(() => {
    const storedAttempts = localStorage.getItem("loginAttempts");
    const storedLock = localStorage.getItem("lockedUntil");

    if (storedAttempts) setAttempts(parseInt(storedAttempts, 10));
    if (storedLock) setLockedUntil(parseInt(storedLock, 10));

    if (storedLock && Date.now() > parseInt(storedLock, 10)) {
      localStorage.removeItem("loginAttempts");
      localStorage.removeItem("lockedUntil");
      setAttempts(0);
      setLockedUntil(null);
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (lockedUntil && Date.now() < lockedUntil) {
      const minutesLeft = Math.ceil((lockedUntil - Date.now()) / 60000);
      toast.error(`Too many attempts. Try again in ${minutesLeft} minute(s).`);
      setTimeout(() => window.location.reload(), 1500);
      return;
    }

    try {
      // login returns TRUE or FALSE
      const success = await login(formData.email, formData.password);

      if (success) {
        toast.success("Login successful! Verify the code sent to your email.");

        // Reset attempt counters
        localStorage.removeItem("loginAttempts");
        localStorage.removeItem("lockedUntil");
        setAttempts(0);
        setLockedUntil(null);

        // 👉 Redirect to verification page BEFORE dashboard
        navigate("/verify-code", {
          state: { email: formData.email },
        });

        return;
      }

      // If login failed
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      localStorage.setItem("loginAttempts", newAttempts);

      if (newAttempts >= MAX_ATTEMPTS) {
        const lockUntil = Date.now() + LOCK_TIME;
        localStorage.setItem("lockedUntil", lockUntil);
        setLockedUntil(lockUntil);
        toast.error("Too many failed attempts! Locked for 10 minutes.");
        setTimeout(() => window.location.reload(), 1500);
      } else {
        toast.error(`Attempt ${newAttempts}`);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center p-6"
      style={{ backgroundImage: "url('/final background (1).png')" }}
    >
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <img
          src="/updated_logo-removebg-preview.png"
          alt="RackSmart Logo"
          className="h-28 mx-auto mb-4"
        />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
            <label htmlFor="email" className="block font-semibold text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
          </div>

          <div className="text-left">
            <label htmlFor="password" className="block font-semibold text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              required
            />
            <Link
              to="/forgot-password"
              className="text-sm text-gray-800 mt-3 inline-block font-semibold"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#fa6709] hover:bg-[#e66a00] text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-1 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {attempts > 0 && !lockedUntil && (
          <p className="mt-4 text-sm text-gray-600 font-semibold">
            Login Attempt: {attempts}
          </p>
        )}

        {lockedUntil && Date.now() < lockedUntil && (
          <p className="mt-4 text-sm text-red-600 font-semibold">
            Locked for 10 minutes due to too many failed attempts.
          </p>
        )}

        <button
          onClick={() => navigate("/FAQs")}
          className="mt-6 w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-lg shadow-sm transition-all duration-200"
        >
          <HelpCircle className="w-5 h-5 text-orange-500" />
          FAQs
        </button>
      </div>
    </div>
  );
};

export default LoginPage;