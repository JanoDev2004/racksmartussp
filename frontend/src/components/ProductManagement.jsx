import React, { useState, useMemo, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useProductsStore } from "../stores/useProductsStore.js";

/* ================= INITIAL FORM ================= */
const initialForm = {
  itemCode: "",
  itemDescription: "",
  category: "",
  segment: "",
  dimension: "",
  accountTo: "",
  uom: "",
};

const ProductManagement = () => {
  const {
    products,
    loading,
    fetchProducts,
    addProduct,
    updateProduct,
  } = useProductsStore();

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");
  const [filterItemDescription, setFilterItemDescription] = useState("");
  const [filterDimension, setFilterDimension] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [form, setForm] = useState(initialForm);

  /* ================= FETCH PRODUCTS ON MOUNT ================= */
  useEffect(() => {
    fetchProducts();
  }, []);

  /* ================= FILTER LOGIC ================= */
  // Get unique item descriptions, dimensions, and segments for filter options
  const itemDescriptionOptions = useMemo(() => {
    const descriptions = [...new Set(products.map(p => p.itemDescription).filter(Boolean))];
    return descriptions.sort();
  }, [products]);

  const dimensionOptions = useMemo(() => {
    const dimensions = [...new Set(products.map(p => p.dimension).filter(Boolean))];
    return dimensions.sort();
  }, [products]);

  const segmentOptions = useMemo(() => {
    const segments = [...new Set(products.map(p => p.segment).filter(Boolean))];
    return segments.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
  return products.filter((p) => {
    const matchSearch =
      (p.itemCode || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.itemDescription || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.category || "").toLowerCase().includes(search.toLowerCase());

    const matchItemDescription = !filterItemDescription || p.itemDescription === filterItemDescription;
    const matchDimension = !filterDimension || p.dimension === filterDimension;
    const matchSegment = !filterSegment || p.segment === filterSegment;
    const matchArchived = showArchived ? p.archived : !p.archived;

    return matchSearch && matchItemDescription && matchDimension && matchSegment && matchArchived;
  });
}, [products, search, filterItemDescription, filterDimension, filterSegment, showArchived]);


  /* ================= HANDLERS ================= */
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    if (!form.itemCode) {
    alert("Item Code is required");
    return;
  }

    const payload = {
      ...form,
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct({ ...payload, archived: false });
      }
      closeModal();
    } catch (err) {
      console.error("Failed to save product:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product._id); // use _id from API
    setForm(product);
    setShowModal(true);
  };

  const toggleArchive = async (product) => {
    try {
      await updateProduct(product._id, { ...product, archived: !product.archived });
    } catch (err) {
      console.error("Failed to toggle archive:", err);
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <PageHeader pageName="Product Management" />

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
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 text-sm focus-within:ring-2 focus-within:ring-blue-500">
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

            {/* Item Description */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Item Description
              </label>
              <select
                value={filterItemDescription}
                onChange={(e) => setFilterItemDescription(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Item Descriptions</option>
                {itemDescriptionOptions.map((desc) => (
                  <option key={desc} value={desc}>
                    {desc}
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
                onChange={(e) => setFilterSegment(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Segments</option>
                {segmentOptions.map((seg) => (
                  <option key={seg} value={seg}>
                    {seg}
                  </option>
                ))}
              </select>
            </div>

            {/* Dimension */}
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Dimension
              </label>
              <select
                value={filterDimension}
                onChange={(e) => setFilterDimension(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Dimensions</option>
                {dimensionOptions.map((dim) => (
                  <option key={dim} value={dim}>
                    {dim}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* RIGHT BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
            >
              <Plus size={16} /> Add Product
            </button>

            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-4 py-2 rounded-md text-sm font-bold ${
                showArchived ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-800"
              }`}
            >
              {showArchived ? "← Back to Active" : "View Archived"}
            </button>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm table-auto">
            <thead className="bg-[#010197] text-white uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left whitespace-nowrap">Item Code</th>
                <th className="p-3 text-left whitespace-nowrap">Item Description</th>
                <th className="p-3 text-left whitespace-nowrap">Segment</th>
                <th className="p-3 text-left whitespace-nowrap">Dimension</th>
                <th className="p-3 text-center bg-[#28a745] whitespace-nowrap">Quantity</th>
                <th className="p-3 text-center bg-[#ffc107] whitespace-nowrap">Reserved Quantity</th>
                <th className="p-3 text-left whitespace-nowrap">Account To</th>
                <th className="p-3 text-left whitespace-nowrap">U.O.M</th>
                <th className="p-3 text-center whitespace-nowrap">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length ? (
                filteredProducts.map((p) => (
                  <tr key={p._id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                    <td className="p-3 font-semibold whitespace-normal wrap-break-word">{p.itemCode || "—"}</td>
                    <td className="p-3 whitespace-normal wrap-break-word">{p.itemDescription || "—"}</td>
                    <td className="p-3 whitespace-normal">{p.segment || "—"}</td>
                    <td className="p-3 whitespace-normal">{p.dimension || "—"}</td>
                    <td className="p-3 text-center bg-[#28a745] text-white font-semibold">{p.quantity ?? 0}</td>
                    <td className="p-3 text-center bg-[#ffc107] text-white font-semibold">{p.reservedQuantity ?? 0}</td>
                    <td className="p-3 whitespace-normal wrap-break-word">{p.accountTo || "—"}</td>
                    <td className="p-3 whitespace-normal">{p.uom || "—"}</td>
                    <td className="p-3 text-center">
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
                          onClick={() => toggleArchive(p)}
                          className={`px-3 py-1 rounded text-xs text-white ${
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
                  <td colSpan="9" className="text-center py-6 text-gray-500">
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
              <h4 className="text-lg font-bold">{editingId ? "Edit Product" : "Add Product"}</h4>
              <button onClick={closeModal}>
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {["itemCode","itemDescription","segment","dimension","accountTo","uom"].map((field) => (
                <div key={field}>
                  <label className="block text-sm font-semibold mb-1">{field}</label>
                  <input
                    name={field}
                    type="text"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm focus:ring-2 focus:ring-[#010197] focus:outline-none"
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
