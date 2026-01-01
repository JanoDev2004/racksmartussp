import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signup, loading } = useUserStore();

  const [formData, setFormData] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    department: "",
    phone: "",
    role: "staff", // frontend default
  });

  const [localError, setLocalError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    const { username, fullName, email, password, confirmPassword } = formData;

    // Validate required fields
    if (!username || !fullName || !email || !password || !confirmPassword) {
      return setLocalError("All required fields must be filled");
    }

    // Validate passwords
    if (password !== confirmPassword) {
      return setLocalError("Passwords do not match");
    }

    // Adjust role to match backend mapping
    let adjustedRole = formData.role;
    if (adjustedRole === "staff") adjustedRole = "inventory";
    if (adjustedRole === "personnel") adjustedRole = "management";

    const signupData = { ...formData, role: adjustedRole };

    const result = await signup(signupData);

    if (result?.requiresVerification) {
      // Redirect to verification page if backend sends verification
      navigate("/verify-code", { state: { email: formData.email } });
    } else if (result !== false) {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-cover bg-center p-6"
         style={{ backgroundImage: "url('/updated background.png')" }}>
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <img src="/updated-logo.png" alt="RackSmart Logo" className="h-28 mx-auto mb-4" />

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Username */}
          <div className="text-left">
            <label htmlFor="username" className="block font-semibold text-gray-600 mb-1">Username</label>
            <input type="text" id="username" value={formData.username} onChange={handleChange}
                   placeholder="Enter your username"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Full Name */}
          <div className="text-left">
            <label htmlFor="fullName" className="block font-semibold text-gray-600 mb-1">Full Name</label>
            <input type="text" id="fullName" value={formData.fullName} onChange={handleChange}
                   placeholder="Enter your full name"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Email */}
          <div className="text-left">
            <label htmlFor="email" className="block font-semibold text-gray-600 mb-1">Email</label>
            <input type="email" id="email" value={formData.email} onChange={handleChange}
                   placeholder="Enter your email"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Password */}
          <div className="text-left">
            <label htmlFor="password" className="block font-semibold text-gray-600 mb-1">Password</label>
            <input type="password" id="password" value={formData.password} onChange={handleChange}
                   placeholder="Enter your password"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Confirm Password */}
          <div className="text-left">
            <label htmlFor="confirmPassword" className="block font-semibold text-gray-600 mb-1">Confirm Password</label>
            <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                   placeholder="Confirm your password"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Department */}
          <div className="text-left">
            <label htmlFor="department" className="block font-semibold text-gray-600 mb-1">Departments</label>
            <input type="text" id="department" value={formData.department} onChange={handleChange}
                   placeholder="Enter your department"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Phone */}
          <div className="text-left">
            <label htmlFor="phone" className="block font-semibold text-gray-600 mb-1">Phone</label>
            <input type="text" id="phone" value={formData.phone} onChange={handleChange}
                   placeholder="Enter your phone number"
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          {/* Role */}
          <div className="text-left">
            <label htmlFor="role" className="block font-semibold text-gray-600 mb-1">Role</label>
            <select id="role" value={formData.role} onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="staff">Staff</option>
              <option value="personnel">Personnel</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button type="submit" disabled={loading}
                  className="w-full bg-neutral-800 hover:bg-gray-600 text-white font-semibold py-3 rounded-lg shadow-md transition-all duration-200 hover:-translate-y-1 disabled:opacity-50">
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {localError && <div className="text-red-600 mt-3 font-semibold text-sm">{localError}</div>}

        <p className="mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")} className="text-gray-800 cursor-pointer font-semibold underline">
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUpPage;
