import React, { useState } from "react";
import { Trash2, Upload } from "lucide-react";

const Setting = () => {
  const [user, setUser] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "09123456789",
    department: "Sales",
    role: "Manager",
    avatar: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [passwordStrength, setPasswordStrength] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const handleSavePassword = () => {
    alert("This is a demo. Password changes are not saved.");
    setPasswordData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
    setPasswordStrength("");
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setUser({ ...user, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveAvatar = () => {
    setUser({ ...user, avatar: null });
  };

  const handleLogout = () => {
    // redirect to login page (demo)
    window.location.href = "/login"; // replace with actual route if needed
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen space-y-6">

      {/* ================= HEADER CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Account Settings
        </h1>
        <p className="text-gray-500 text-sm">
          You can edit fields and upload/delete avatar and change password.
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Keep your personal information and contact details updated to ensure proper communication.</li>
            <li>Use a strong, unique password and update it regularly to maintain your account's security.</li>
            <li>Upload a professional and clear profile image to help colleagues identify you within the system.</li>
          </ul>
        </div>
      </div>

      {/* Profile Details */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Profile Details
        </h5>

        <div className="flex flex-col gap-6">
          {/* Compact Avatar Section */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Avatar Circle */}
              <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden flex items-center justify-center">
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-gray-400 text-xs">No Photo</span>
                )}
              </div>

              {/* Upload Overlay (Floating Button) */}
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-md transition-all border-2 border-white"
                title="Upload Photo"
              >
                <Upload size={14} />
              </label>

              {/* Delete Button (Small X on Top Right) */}
              {user.avatar && (
                <button
                  onClick={handleRemoveAvatar}
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm border-2 border-white"
                  title="Remove Photo"
                >
                  <Trash2 size={12} />
                </button>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
                id="avatar-upload"
              />
            </div>
          </div>

          {/* Form Fields - tighter spacing */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {["fullName", "email", "phone", "department", "role"].map((field) => (
    <div key={field} className="flex flex-col">
      <label className="block text-gray-600 font-semibold text-sm mb-1">
        {field === "fullName" ? "Full Name" : field.charAt(0).toUpperCase() + field.slice(1)}
      </label>
      <input
        type="text"
        value={user[field]}
        onChange={(e) => setUser({ ...user, [field]: e.target.value })}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
      />
    </div>
  ))}
</div>


          
        </div>
      </div>

      {/* Security / Change Password */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Security
        </h5>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-600 font-semibold mb-1">Current Password</label>
            <input
              type="password"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
            />
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">New Password</label>
            <input
              type="password"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
            />
            {passwordStrength && (
              <p
                className={`mt-2 font-semibold ${passwordStrength === "Weak"
                    ? "text-red-600"
                    : passwordStrength === "Medium"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
              >
                Password Strength: {passwordStrength}
              </p>
            )}
          </div>

          <div>
            <label className="block text-gray-600 font-semibold mb-1">Confirm New Password</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={passwordData.confirmNewPassword}
              onChange={handleChange}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-400 outline-none text-sm bg-white"
            />
          </div>
        </div>

        <button
          onClick={handleSavePassword}
          disabled={passwordStrength !== "Strong"}
            className="flex items-center gap-2 mt-3 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
        >
          Save Changes
        </button>
      </div>

      {/* Logout Container */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
Setting
        </h5>
       <div>
         <button
          onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-2 bg-[#e60505] hover:bg-[#8d0000] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
        >
          Logout
        </button>
       </div>
      </div>

{/* Logout Modal */}
{showLogoutModal && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowLogoutModal(false)}
  >
    <div
      className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <h4 className="text-lg font-bold text-gray-800 mb-2 text-center">
        Confirm Logout
      </h4>

      <p className="text-sm text-gray-600 mb-6 text-center">
        Are you sure you want to logout from your account?
      </p>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={() => setShowLogoutModal(false)}
          className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500 transition"
        >
          Cancel
        </button>
        <button
          onClick={handleLogout}
          className="flex-1 bg-red-600 text-white py-2 rounded-md font-semibold hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
};

export default Setting;
