import React, { useState, useEffect } from "react";
import { Trash2, Upload } from "lucide-react";
import { useUserStore } from "../stores/useUserStore"; // adjust path if needed
import { toast } from "react-hot-toast";
import axios from "../lib/axios";
import PageHeader from "../components/PageHeader";

const Setting = () => {
  const {
    user,
    loading,
    logout,
    checkAuth,
    refreshToken,
  } = useUserStore();
  
  const [localUser, setLocalUser] = useState(user);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [passwordStrength, setPasswordStrength] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    if (!user) checkAuth();
    setLocalUser(user);
  }, [user]);

  // ---------- PASSWORD HANDLERS ----------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));

    if (name === "newPassword") {
      setPasswordStrength(getPasswordStrength(value));
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return "";
    if (password.length < 8) return "Weak";
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*]/.test(password);
    if (password.length >= 12 && hasLower && hasUpper && hasNumber && hasSpecial) return "Strong";
    if ((hasLower || hasUpper) && hasNumber) return "Medium";
    return "Weak";
  };

  const handleSavePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      return toast.error("Passwords do not match");
    }
    try {
      await axios.post("/auth/change-password", passwordData);
      toast.success("Password updated successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
      setPasswordStrength("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    }
  };

  // ---------- AVATAR HANDLERS ----------
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await axios.post("/users/avatar", formData);
      setLocalUser({ ...localUser, avatar: res.data.avatar });
      toast.success("Avatar updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload avatar");
    }
  };

  const handleRemoveAvatar = async () => {
    try {
      await axios.delete("/users/avatar");
      setLocalUser({ ...localUser, avatar: null });
      toast.success("Avatar removed!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove avatar");
    }
  };

  // ---------- PROFILE UPDATE ----------
  const handleSaveProfile = async () => {
    try {
      const res = await axios.put("/users/profile", localUser);
      setLocalUser(res.data);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen space-y-6">
      {/* Header */}
      <PageHeader pageName="Setting" />

      {/* Profile */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">Profile Details</h5>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
              {localUser?.avatar ? (
                <img src={localUser.avatar} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-gray-400 text-xs">No Photo</span>
              )}
            </div>

            <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md border-2 border-white">
              <Upload size={14} />
            </label>

            {localUser?.avatar && (
              <button onClick={handleRemoveAvatar} className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm border-2 border-white">
                <Trash2 size={12} />
              </button>
            )}

            <input type="file" accept="image/*" onChange={handleAvatarChange} id="avatar-upload" className="hidden" />
          </div>
        </div>

        {/* Profile Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {["fullName","email","phone","department","role"].map((field) => (
            <div key={field} className="flex flex-col">
              <label className="block text-gray-600 font-semibold text-sm mb-1">{field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}</label>
              <input
                type="text"
                value={localUser?.[field] || ""}
                onChange={(e) => setLocalUser({ ...localUser, [field]: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
              />
            </div>
          ))}
        </div>

        <button onClick={handleSaveProfile} className="bg-[#1800ad] text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-[#15008f]">
          Save Profile
        </button>
      </div>

      {/* Password */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">Security</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Current Password</label>
            <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white" />
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">New Password</label>
            <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white" />
            {passwordStrength && <p className={`mt-2 font-semibold ${passwordStrength==="Weak"?"text-red-600":passwordStrength==="Medium"?"text-yellow-600":"text-green-600"}`}>Password Strength: {passwordStrength}</p>}
          </div>
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Confirm New Password</label>
            <input type="password" name="confirmNewPassword" value={passwordData.confirmNewPassword} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white" />
          </div>
        </div>
        <button onClick={handleSavePassword} disabled={passwordStrength !== "Strong"} className="mt-3 bg-[#1800ad] text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-[#15008f]">
          Save Password
        </button>
      </div>

      {/* Logout */}
      <div className="bg-white p-6 rounded-xl shadow">
        <button onClick={()=>setShowLogoutModal(true)} className="bg-red-600 text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-red-700">Logout</button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={()=>setShowLogoutModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg" onClick={(e)=>e.stopPropagation()}>
            <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">Confirm Logout</h4>
            <p className="text-sm text-gray-600 mb-6 text-center">Are you sure you want to logout?</p>
            <div className="flex gap-4">
              <button onClick={()=>setShowLogoutModal(false)} className="flex-1 bg-gray-400 text-white py-2 rounded-md hover:bg-gray-500">Cancel</button>
              <button onClick={logout} className="flex-1 bg-red-600 text-white py-2 rounded-md hover:bg-red-700">Logout</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Setting;
