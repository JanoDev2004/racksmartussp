import React, { useState, useMemo } from "react";
import { Plus, X, Search } from "lucide-react";

/* ================= DEMO DATA ================= */
const demoProducts = [
  {
    id: 1,
    code: "PRD-001",
    category: "Rack",
    segment: "Heavy Duty",
    itemDescription: "Steel Rack 5x5",
    dimension: "5x5",
    updatedCount: 10,
    reserveCount: 2,
    uom: "pcs",
    price: 1500,
    accountTo: "Warehouse A",
    archived: false,
  },
  {
    id: 2,
    code: "PRD-002",
    category: "Consumables",
    segment: "Office",
    itemDescription: "Tape Roll",
    dimension: "1 inch",
    updatedCount: 50,
    reserveCount: 5,
    uom: "pcs",
    price: 50,
    accountTo: "Warehouse B",
    archived: false,
  },
];

/* ================= DROPDOWN OPTIONS ================= */
const CATEGORY_OPTIONS = ["Rack", "Consumables", "PPE", "Tools"];

const SEGMENT_OPTIONS = {
  Rack: ["Heavy Duty", "Medium Duty"],
  Consumables: ["Office", "Warehouse"],
  PPE: ["Safety"],
  Tools: ["Electrical"],
};

const ITEM_OPTIONS = {
  "Heavy Duty": ["Steel Rack 5x5", "Steel Rack 6x5"],
  Office: ["Tape Roll", "Bond Paper"],
};

const initialForm = {
  code: "",
  category: "",
  segment: "",
  itemDescription: "",
  dimension: "",
  updatedCount: "",
  reserveCount: "",
  uom: "",
  price: "",
  accountTo: "",
};

const ProductManagement = () => {
  const [products, setProducts] = useState(demoProducts);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  /* ===== FILTER STATES ===== */
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [filterItem, setFilterItem] = useState("");

  const [form, setForm] = useState(initialForm);

  /* ================= FILTER LOGIC ================= */
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.code.toLowerCase().includes(search.toLowerCase()) ||
        p.itemDescription.toLowerCase().includes(search.toLowerCase());

      const matchCategory = !filterCategory || p.category === filterCategory;

      const matchSegment = !filterSegment || p.segment === filterSegment;

      const matchItem = !filterItem || p.itemDescription === filterItem;

      const matchArchived = showArchived ? p.archived : !p.archived;

      return (
        matchSearch &&
        matchCategory &&
        matchSegment &&
        matchItem &&
        matchArchived
      );
    });
  }, [
    products,
    search,
    filterCategory,
    filterSegment,
    filterItem,
    showArchived,
  ]);

  /* ================= HANDLERS ================= */
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (editingId) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editingId ? { ...p, ...form } : p))
      );
    } else {
      setProducts((prev) => [
        ...prev,
        { id: Date.now(), ...form, archived: false },
      ]);
    }
    closeModal();
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setForm(product);
    setShowModal(true);
  };

  const toggleArchive = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p))
    );
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Product Management
        </h1>
        <p className="text-gray-500 text-sm">
          Manage inventory items and stock records.
        </p>
      </div>

      {/* ================= TABLE CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Product Records
        </h5>

        {/* ================= TOP CONTROLS ================= */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
          {/* LEFT FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            {/* Search */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Search
              </label>
              <div
                className="flex items-center border border-gray-300 rounded-md
                 px-3 py-1.5 text-sm
                 focus-within:ring-2 focus-within:ring-blue-500"
              >
                <Search size={16} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Code or Item"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="outline-none bg-transparent flex-1 text-sm"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => {
                  setFilterCategory(e.target.value);
                  setFilterSegment("");
                  setFilterItem("");
                }}
                className="w-full border border-gray-300 rounded-md
                 px-3 py-1.5 text-sm
                 outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Segment */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Segment
              </label>
              <select
                value={filterSegment}
                onChange={(e) => {
                  setFilterSegment(e.target.value);
                  setFilterItem("");
                }}
                disabled={!filterCategory}
                className="w-full border border-gray-300 rounded-md
                 px-3 py-1.5 text-sm
                 outline-none focus:ring-2 focus:ring-blue-500
                 disabled:bg-gray-100"
              >
                <option value="">All Segments</option>
                {(SEGMENT_OPTIONS[filterCategory] || []).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            {/* Item */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Item
              </label>
              <select
                value={filterItem}
                onChange={(e) => setFilterItem(e.target.value)}
                disabled={!filterSegment}
                className="w-full border border-gray-300 rounded-md
                 px-3 py-1.5 text-sm
                 outline-none focus:ring-2 focus:ring-blue-500
                 disabled:bg-gray-100"
              >
                <option value="">All Items</option>
                {(ITEM_OPTIONS[filterSegment] || []).map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f]
                         text-white px-6 py-2 rounded-md font-bold text-sm
                         transition shadow-md active:scale-95"
            >
              <Plus size={16} /> Add Product
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

        {/* ================= TABLE ================= */}

        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm table-fixed">
            {/* ================= HEADER ================= */}
            <thead className="bg-[#010197] text-white uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Code</th>
                <th className="p-3 text-left whitespace-nowrap">Category</th>
                <th className="p-3 text-left whitespace-nowrap">Segment</th>
                <th className="p-3 text-left whitespace-nowrap">
                  Item Description
                </th>
                <th className="p-3 text-left whitespace-nowrap">Dimension</th>
                <th className="p-3 text-center bg-[#28a745] whitespace-nowrap">
                  Stock
                </th>
                <th className="p-3 text-center bg-[#ffc107] whitespace-nowrap">
                  Reserved
                </th>
                <th className="p-3 text-left whitespace-nowrap">UOM</th>
                <th className="p-3 text-left whitespace-nowrap">Price</th>
                <th className="p-3 text-left whitespace-nowrap">Account To</th>
                <th className="p-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            {/* ================= BODY ================= */}
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length ? (
                filteredProducts.map((p) => (
                  <tr
                    key={p.id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="p-3 font-semibold whitespace-nowrap overflow-hidden">
                      {p.code || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap overflow-hidden">
                      {p.category || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap overflow-hidden">
                      {p.segment || "—"}
                    </td>
                    <td className="p-3 max-w-50 whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.itemDescription || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap overflow-hidden">
                      {p.dimension || "—"}
                    </td>
                    <td className="p-3 text-center bg-[#28a745] text-white font-semibold whitespace-nowrap">
                      {p.updatedCount ?? 0}
                    </td>
                    <td className="p-3 text-center bg-[#ffc107] text-white font-semibold whitespace-nowrap">
                      {p.reserveCount ?? 0}
                    </td>
                    <td className="p-3 whitespace-nowrap overflow-hidden">
                      {p.uom || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap overflow-hidden">
                      ₱{p.price?.toLocaleString() || "0.00"}
                    </td>
                    <td className="p-3 max-w-37.5 whitespace-nowrap overflow-hidden text-ellipsis">
                      {p.accountTo || "—"}
                    </td>
                    <td className="p-3 whitespace-nowrap text-center">
                      <div className="flex justify-center gap-2">
                        {!showArchived && (
                          <button
                            onClick={() => handleEdit(p)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                          >
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => toggleArchive(p.id)}
                          className={`px-3 py-1 rounded text-xs text-white ${
                            showArchived
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-blue-600 hover:bg-blue-700"
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
                  <td colSpan="11" className="text-center py-6 text-gray-500">
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
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">
                {editingId ? "Edit Product" : "Add Product"}
              </h4>
              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.keys(initialForm).map((key) => (
                <div key={key}>
                  <label className="block text-sm font-semibold mb-1">
                    {key.replace(/([A-Z])/g, " $1")}
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

export default ProductManagement;
