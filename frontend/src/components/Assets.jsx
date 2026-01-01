import React, { useState, useMemo } from "react";
import { Plus, X, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const demoAssets = [
  {
    id: 1,
    category: "Equipment",
    code: "AST-001",
    segment: "Warehouse",
    itemDescription: "Forklift",
    brand: "Toyota",
    updatedCount: 2,
    price: 850000,
    acquisitionDate: "2024-06-10",
    remarks: "Operational",
    archived: false,
  },
  {
    id: 2,
    category: "Office",
    code: "AST-002",
    segment: "Admin",
    itemDescription: "Office Chair",
    brand: "Ergo",
    updatedCount: 15,
    price: 3500,
    acquisitionDate: "2024-01-15",
    remarks: "",
    archived: false,
  },
];

const Assets = () => {
  const [assets, setAssets] = useState(demoAssets);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    category: "",
    code: "",
    segment: "",
    itemDescription: "",
    brand: "",
    updatedCount: "",
    price: "",
    acquisitionDate: "",
    remarks: "",
  });

  // ===== FILTER =====
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.code.toLowerCase().includes(search.toLowerCase()) ||
        a.itemDescription.toLowerCase().includes(search.toLowerCase());

      const matchArchived = showArchived ? a.archived : !a.archived;

      return matchSearch && matchArchived;
    });
  }, [assets, search, showArchived]);

  // ===== HANDLERS =====
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm({
      category: "",
      code: "",
      segment: "",
      itemDescription: "",
      brand: "",
      updatedCount: "",
      price: "",
      acquisitionDate: "",
      remarks: "",
    });
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (editingId) {
      setAssets((prev) =>
        prev.map((a) =>
          a.id === editingId ? { ...a, ...form } : a
        )
      );
    } else {
      setAssets((prev) => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          archived: false,
        },
      ]);
    }
    closeModal();
  };

  const handleEdit = (asset) => {
    setEditingId(asset.id);
    setForm(asset);
    setShowModal(true);
  };

  const toggleArchive = (id) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, archived: !a.archived } : a
      )
    );
  };

  

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* ================= HEADER CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Assest Management
        </h1>
        <p className="text-gray-500 text-sm">
          Record and manage all company assets efficiently.
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Assign a unique asset tag and serial number to each item for precise tracking and accountability.</li>
<li>Record the purchase date, warranty details, and current condition of each asset for maintenance.</li>
<li>Update the asset status and assigned personnel whenever an item is deployed or returned.</li>
          </ul>
        </div>
      </div>

      {/* ================= TABLE CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow">

        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Assest Management
        </h5>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full md:w-auto">
            <Search size={16} className="text-gray-500 mr-1" />
            <input
              type="text"
              placeholder="Search asset"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="outline-none text-sm bg-transparent flex-1"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button
              onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
            >
              <Plus size={16} /> Add Asset
            </button>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-md text-sm font-bold ${
                showArchived
                  ? "bg-gray-700 text-white"
                  : "bg-gray-300 text-gray-800"
              }`}
            >
              {showArchived ? "← Back to Active" : "View Archived"}
            </button>
          </div>
        </div>

        {/* Table */}
<div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
  <table className="w-full text-sm">
    <thead className="bg-[#010197] text-white uppercase tracking-wide">
      <tr>
        <th className="p-3 text-left">Category</th>
        <th className="p-3 text-center">Code</th>
        <th className="p-3 text-left">Item</th>
        <th className="p-3 text-left">Brand</th>
        <th className="p-3 text-center bg-[#28a745]">Count</th>
        <th className="p-3 text-left">Price</th>
        <th className="p-3 text-center">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredAssets.length ? (
        filteredAssets.map((a) => (
          <tr
            key={a.id}
            className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
          >
            <td className="p-4 font-semibold text-gray-800">{a.category}</td>
            <td className="p-4 text-center text-gray-600">{a.code}</td>
            <td className="p-4 text-gray-500">{a.itemDescription}</td>
            <td className="p-4 text-gray-600">{a.brand}</td>
            <td className="p-4 text-center bg-[#28a745] text-white font-semibold">
              {a.updatedCount}
            </td>
            <td className="p-4 text-gray-800">₱{a.price}</td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                {!showArchived && (
                  <button
                    onClick={() => handleEdit(a)}
                                                className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1 font-bold"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => toggleArchive(a.id)}
                  
                  className={`px-3 py-1 rounded text-xs text-white transition
                    
                    ${
                    showArchived ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
                  }`}
                >
                  {showArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="7" className="text-center py-6 text-gray-500">
            No records found.
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

      {/* ================= MODAL ================= */}
{showModal && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={closeModal}
  >
    <div
      className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">
          {editingId ? "Edit Asset" : "Add Asset"}
        </h4>
        <button
          className="text-gray-600 hover:text-gray-800"
          onClick={closeModal}
        >
          <X size={20} />
        </button>
      </div>

      {/* Modal Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.keys(form).map((key) => (
          <div key={key}>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="text"
              value={form[key]}
              onChange={(e) =>
                setForm({ ...form, [key]: e.target.value })
              }
              className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm
                         focus:ring-2 focus:ring-[#010197] focus:outline-none"
            />
          </div>
        ))}
      </div>

      {/* Footer Buttons */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={handleSave}
          className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]"
        >
          Save
        </button>
        <button
          onClick={() => setForm(initialForm)}
          className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500"
        >
          Clear
        </button>
      </div>
    </div>
  </div>
)}

    </main>
  );
};

export default Assets;
