import React, { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";

const DEMO_SUPPLIES = [
  {
    id: 1,
    code: "SUP-001",
    category: "Consumables",
    segment: "Warehouse",
    itemDescription: "Stretch Film",
    dimension: "500mm",
    updatedCount: 120,
    uom: "Roll",
    brand: "WrapAll",
    color: "Clear",
    location: "A1",
    archived: false,
  },
  {
    id: 2,
    code: "SUP-002",
    category: "PPE",
    segment: "Safety",
    itemDescription: "Safety Helmet",
    dimension: "Standard",
    updatedCount: 45,
    uom: "Piece",
    brand: "SafePro",
    color: "Yellow",
    location: "B2",
    archived: false,
  },
];

const SuppliesManagement = () => {
  const [supplies, setSupplies] = useState(DEMO_SUPPLIES);
  const [searchCode, setSearchCode] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  /* ================= FILTER ================= */
  const filteredSupplies = useMemo(() => {
    return supplies.filter((s) => {
      const matchArchive = showArchived ? s.archived : !s.archived;
      const matchCode = s.code
        .toLowerCase()
        .includes(searchCode.toLowerCase());
      return matchArchive && matchCode;
    });
  }, [supplies, searchCode, showArchived]);

  /* ================= ADD ================= */
  const handleAddSupply = (e) => {
    e.preventDefault();
    const form = e.target;

    const newSupply = {
      id: Date.now(),
      code: form.code.value,
      category: form.category.value,
      segment: form.segment.value,
      itemDescription: form.itemDescription.value,
      dimension: form.dimension.value,
      updatedCount: Number(form.updatedCount.value),
      uom: form.uom.value,
      brand: form.brand.value,
      color: form.color.value,
      location: form.location.value,
      archived: false,
    };

    setSupplies([...supplies, newSupply]);
    setShowAddModal(false);
    form.reset();
  };

  /* ================= ARCHIVE ================= */
  const handleArchive = (id) => {
    setSupplies((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, archived: true } : s
      )
    );
  };

  const handleUnarchive = (id) => {
    setSupplies((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, archived: false } : s
      )
    );
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* ================= HEADER CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Supplies Management
        </h1>
        <p className="text-gray-500 text-sm">
          Add and manage active and archived supplies 
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
           <li>Ensure all office and operational supplies are categorized for easy tracking and replenishment.</li>
<li>Set minimum stock levels for essential supplies to receive alerts before items run out.</li>
<li>Review and archive obsolete or fully consumed supplies to keep the inventory list organized.</li>
          </ul>
        </div>
      </div>

      {/* ================= TABLE + SEARCH + ADD ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Supplies Management
        </h5>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">

          {/* Search */}
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full md:w-auto">
            <Search size={16} className="text-gray-500 mr-1" />
            <input
              type="text"
              placeholder="Search Code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="outline-none text-sm bg-transparent flex-1"
            />
          </div>

          <div className="flex gap-2">
            {/* Add */}
            <button
              onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
            >
              <Plus size={16} /> Add Supply
            </button>

            {/* Toggle Archived */}
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

        {/* ================= TABLE ================= */}
        {/* Supplies Table */}
<div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
  <table className="w-full text-sm">
    <thead className="bg-[#010197] text-white uppercase tracking-wide">
      <tr>
        <th className="p-3 text-left">Code</th>
        <th className="p-3 text-left">Category</th>
        <th className="p-3 text-left">Segment</th>
        <th className="p-3 text-left">Item</th>
        <th className="p-3 text-center bg-green-700">Count</th>
        <th className="p-3 text-left">UOM</th>
        <th className="p-3 text-left">Location</th>
        <th className="p-3 text-center">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredSupplies.length > 0 ? (
        filteredSupplies.map((s) => (
          <tr
            key={s.id}
            className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
          >
            <td className="p-4 font-semibold text-gray-800">{s.code}</td>
            <td className="p-4 text-gray-600">{s.category}</td>
            <td className="p-4 text-gray-600">{s.segment}</td>
            <td className="p-4 text-gray-500">{s.itemDescription}</td>
            <td className="p-4 text-center font-semibold text-white bg-green-700 rounded">
              {s.updatedCount}
            </td>
            <td className="p-4 text-gray-600">{s.uom}</td>
            <td className="p-4 text-gray-600">{s.location}</td>
            <td className="p-4 text-center">
              {!showArchived ? (
                <button
                  onClick={() => handleArchive(s.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs transition"
                >
                  Archive
                </button>
              ) : (
                <button
                  onClick={() => handleUnarchive(s.id)}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs transition"
                >
                  Unarchive
                </button>
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center py-6 text-gray-500">
            {showArchived ? "No archived supplies." : "No supplies found."}
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      </div>

      {/* ================= ADD SUPPLY MODAL ================= */}
{showAddModal && (
  <div
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
    onClick={() => setShowAddModal(false)}
  >
    <div
      className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Modal Header */}
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">
          Add New Supply
        </h4>
        <button
          onClick={() => setShowAddModal(false)}
          className="text-gray-600 hover:text-gray-800"
        >
          <X size={20} />
        </button>
      </div>

      {/* Modal Form */}
      <form
        onSubmit={handleAddSupply}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {[
          { name: "code", label: "Item Code" },
          { name: "category", label: "Category" },
          { name: "segment", label: "Segment" },
          { name: "itemDescription", label: "Description" },
          { name: "dimension", label: "Dimension" },
          { name: "updatedCount", label: "Stock Quantity", type: "number" },
          { name: "uom", label: "Unit of Measure" },
          { name: "brand", label: "Brand" },
          { name: "color", label: "Color" },
          { name: "location", label: "Storage Location" },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              {field.label}
            </label>
            <input
              name={field.name}
              type={field.type || "text"}
              required
              className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm
                         focus:ring-2 focus:ring-[#010197] focus:outline-none"
            />
          </div>
        ))}

        {/* Footer Button */}
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080] mt-2"
        >
          Save Supply
        </button>
      </form>
    </div>
  </div>
)}

    </main>
  );
};

export default SuppliesManagement;
