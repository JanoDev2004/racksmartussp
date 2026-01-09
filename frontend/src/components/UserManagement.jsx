import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, User } from "lucide-react";
import { useUsersStore } from "../stores/useUsersStore";

const UserManagement = () => {
  const { users, loading, fetchUsers, addUser, updateUser, deleteUser } =
    useUsersStore();
  const [searchName, setSearchName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "", // ✅ Add this
    fullName: "",
    email: "",
    phone: "",
    department: "",
    role: "",
    image: null,
    isOnline: false,
  });

  useEffect(() => {
    fetchUsers(); // load users from API on mount
  }, [fetchUsers]);

  const filteredUsers = users.filter((u) =>
    (u.fullName || "").toLowerCase().includes(searchName.toLowerCase())
  );

  const handleSaveUser = async () => {
    if (!newUser.fullName) return alert("Full Name is required");

    if (newUser._id) {
      await updateUser(newUser._id, newUser);
    } else {
      await addUser(newUser);
    }

    setNewUser({
      username: "", // ✅ Add this
      fullName: "",
      email: "",
      phone: "",
      department: "",
      role: "",
      image: null,
      isOnline: false,
    });
    setShowModal(false);
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      await deleteUser(userId);
    }
  };

  const handleEdit = (user) => {
    setNewUser(user);
    setShowModal(true);
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Manage User Account
        </h1>
        <p className="text-gray-500 text-sm">
          Add, edit, or delete users. Green dot = Online, Red dot = Offline.
        </p>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          User Accounts
        </h5>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            {/* Search Filter */}
            <div className="flex flex-col">
              <label className="text-[14px] font-bold text-gray-400 mb-1">
                Search User
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition h-9.5">
                <Search size={16} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search name..."
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  className="outline-none text-sm bg-transparent w-full"
                />
              </div>
            </div>
          </div>

          {/* Add User Button */}
          <div className="flex items-center gap-2 border-l-0 lg:border-l lg:pl-4 border-gray-200">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-5 py-1.5 rounded-md font-bold text-sm transition shadow-sm h-9.5 whitespace-nowrap"
            >
              <Plus size={16} /> Add User
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white uppercase tracking-wide font-bold">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Full Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Phone</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Verified</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500 italic"
                  >
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-10 text-gray-500 italic"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="p-4 text-center">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-[10px]">
                          <User size={14} />
                        </div>
                      )}
                    </td>
                    <td className="p-4 font-semibold text-gray-700">
                      {user.fullName}
                    </td>
                    <td className="p-4 text-gray-600">{user.email}</td>
                    <td className="p-4 text-gray-600">{user.phone}</td>
                    <td className="p-4 text-gray-600">{user.department}</td>
                    <td className="p-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase whitespace-nowrap
                          ${
                            user.role === "Admin"
                              ? "border-blue-200 text-blue-600 bg-blue-50"
                              : user.role === "Management"
                              ? "border-orange-200 text-orange-600 bg-orange-50"
                              : "border-green-200 text-green-600 bg-green-50"
                          }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      {user.isVerified ? (
                        <span className="text-green-600 font-bold">Yes</span>
                      ) : (
                        <span className="text-red-600 font-bold">No</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => handleEdit(user)}
                          className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-bold"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="text-red-600 hover:text-red-800 flex items-center gap-1 font-bold"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                {newUser._id ? "Edit User" : "Add User"}
              </h4>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "username",
                "fullName",
                "email",
                "phone",
                "department",
                "role",
              ].map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1 text-gray-700">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  <input
                    type={key === "email" ? "email" : "text"}
                    value={newUser[key] || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, [key]: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#010197] focus:outline-none"
                  />
                </div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 mt-4">
              <label className="flex items-center gap-2 bg-[#010197] text-white px-3 py-2 rounded-md text-sm cursor-pointer hover:bg-[#000080]">
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file)
                      setNewUser({
                        ...newUser,
                        image: URL.createObjectURL(file),
                      });
                  }}
                />
              </label>
            </div>

            {newUser.image && (
              <img
                src={newUser.image}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover mt-4 border"
              />
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveUser}
                className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default UserManagement;
