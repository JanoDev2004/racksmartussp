import React, { useState } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";

const UserManagement = () => {
    const [users, setUsers] = useState([
        {
            id: 1,
            fullName: "John Doe",
            email: "john@example.com",
            phone: "09171234567",
            department: "Warehouse",
            role: "Admin",
            image: null,
            isOnline: true,
        },
        {
            id: 2,
            fullName: "Jane Smith",
            email: "jane@example.com",
            phone: "09179876543",
            department: "Sales",
            role: "Management",
            image: null,
            isOnline: false,
        },
    ]);

    const [searchName, setSearchName] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [newUser, setNewUser] = useState({
        fullName: "",
        email: "",
        phone: "",
        department: "",
        role: "",
        image: null,
        isOnline: false,
    });

    const filteredUsers = users.filter((u) =>
        u.fullName.toLowerCase().includes(searchName.toLowerCase())
    );

    const handleSaveUser = () => {
        if (!newUser.fullName) return alert("Full Name is required");
        if (newUser.id) {
            setUsers(users.map((u) => (u.id === newUser.id ? newUser : u)));
        } else {
            setUsers([...users, { ...newUser, id: Date.now() }]);
        }
        setNewUser({
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

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter((u) => u.id !== id));
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

                {/* Instruction Box */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
                    <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
                    <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                        <li>Ensure all user information is accurate before saving changes.</li>
                        <li>Assign appropriate roles to maintain system security and access control.</li>
                        <li>Upload clear profile images for better identification of personnel.</li>
                        <li>Regularly review account statuses to manage active and inactive users.</li>
                    </ul>
                </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow">
                <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
                    User Accounts
                </h5>

                {/* Filters and Actions Row - Matched to UserActivity UI */}
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">

                        {/* Search Filter */}
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-gray-400 mb-1">Search User</label>
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

                        {/* Role Filter - Select UI style from your ref */}
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-gray-400 mb-1">Role</label>
                            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white h-9.5">
                                <option value="">All Roles</option>
                                <option value="Admin">Admin</option>
                                <option value="Management">Management</option>
                                <option value="Inventory">Inventory</option>
                            </select>
                        </div>

                        {/* Department Filter */}
                        <div className="flex flex-col">
                            <label className="text-[14px] font-bold text-gray-400 mb-1">Department</label>
                            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white h-9.5">
                                <option value="">All Departments</option>
                                <option value="IT">IT</option>
                                <option value="HR">HR</option>
                                <option value="Warehouse">Warehouse</option>
                            </select>
                        </div>
                    </div>

                    {/* Add User Action - Matched to Download button style */}
                    <div className="flex items-center gap-2 border-l-0 lg:border-l lg:pl-4 border-gray-200">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-5 py-1.5 rounded-md font-bold text-sm transition shadow-sm h-9.5 whitespace-nowrap"
                        >
                            <Plus size={16} /> Add User
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                    <table className="w-full text-sm">
                        <thead className="bg-[#010197] text-white uppercase tracking-wide font-bold">
                            <tr>
                                <th className="p-3 text-left">Status</th>
                                <th className="p-3 text-left">Image</th>
                                <th className="p-3 text-left">Full Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                                <th className="p-3 text-left">Department</th>
                                <th className="p-3 text-left">Role</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="text-center py-10 text-gray-500 italic">No users found.</td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                                        <td className="p-4 text-center">
                                            <span className={`inline-block w-2.5 h-2.5 rounded-full ${user.isOnline ? "bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" : "bg-red-500"}`} />
                                        </td>
                                        <td className="p-4 text-center">
                                            {user.image ? (
                                                <img src={user.image} alt="" className="w-9 h-9 rounded-full object-cover border border-gray-200" />
                                            ) : (
                                                <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 text-[10px]">N/A</div>
                                            )}
                                        </td>
                                        <td className="p-4 font-semibold text-gray-700 whitespace-nowrap">{user.fullName}</td>
                                        <td className="p-4 text-gray-600">{user.email}</td>
                                        <td className="p-4 text-gray-600">{user.phone}</td>
                                        <td className="p-4 text-gray-600">{user.department}</td>

                                        {/* --- Role Badge Logic from UserActivity --- */}
                                        <td className="p-4">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase whitespace-nowrap
                  ${user.role === 'Admin' ? 'border-blue-200 text-blue-600 bg-blue-50' :
                                                    user.role === 'Management' ? 'border-orange-200 text-orange-600 bg-orange-50' :
                                                        'border-green-200 text-green-600 bg-green-50'}`}>
                                                {user.role}
                                            </span>
                                        </td>

                                        <td className="p-4">
                                            <div className="flex justify-center gap-3">
                                                <button onClick={() => handleEdit(user)} 
                                                className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1 font-bold"
                                                >
                                                    <Edit size={14} /> Edit
                                                </button>
                                                <button onClick={() => handleDelete(user.id)} className="text-red-600 hover:text-red-800 transition flex items-center gap-1 font-bold">
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

    {showModal && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowModal(false)}
  >
    <div
      className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">
          {newUser.id ? "Edit User" : "Add User"}
        </h4>
        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
      </div>

      {/* Modal Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { key: "fullName", label: "Full Name" },
          { key: "email", label: "Email", type: "email" },
          { key: "phone", label: "Phone" },
          { key: "department", label: "Department" },
          { key: "role", label: "Role" },
        ].map(({ key, label, type = "text" }) => (
          <div key={key} className="md:col-span-1">
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              {label}
            </label>
            <input
              type={type}
              value={newUser[key]}
              onChange={(e) =>
                setNewUser({ ...newUser, [key]: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm
                         focus:ring-2 focus:ring-[#010197] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Image + Status */}
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

        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <input
            type="checkbox"
            checked={newUser.isOnline}
            onChange={(e) =>
              setNewUser({ ...newUser, isOnline: e.target.checked })
            }
            className="accent-[#010197]"
          />
          Online
        </label>
      </div>

      {newUser.image && (
        <img
          src={newUser.image}
          alt="Preview"
          className="w-20 h-20 rounded-full object-cover mt-4 border"
        />
      )}

      {/* Footer Buttons */}
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
