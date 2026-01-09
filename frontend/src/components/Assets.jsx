import React, { useState, useMemo, useEffect } from "react";
import { Plus, X, Search } from "lucide-react";
import { useAssetsStore } from "../stores/useAssetsStore";
import { toast } from "react-hot-toast";
import PageHeader from "./PageHeader";

const CATEGORY_OPTIONS = ["Rack", "Consumables", "PPE", "Tools", "Equipment", "Office"];
const SEGMENT_OPTIONS = {
  Rack: ["Heavy Duty", "Medium Duty"],
  Consumables: ["Office", "Warehouse"],
  PPE: ["Safety"],
  Tools: ["Electrical"],
  Equipment: ["Warehouse", "Production"],
  Office: ["Admin"],
};
const ITEM_OPTIONS = {
  "Heavy Duty": ["Steel Rack 5x5", "Steel Rack 6x5"],
  Office: ["Tape Roll", "Bond Paper"],
  Warehouse: ["Forklift", "Pallet"],
};

const initialForm = {
  category: "",
  itemDescription: "",
  segment: "",
  brand: "",
  quantity: "",
  serialNo: "",
  acquisitionDate: "",
};

const Assets = () => {
  const { assets, loading, fetchAssets, addAsset, updateAsset, toggleArchive, adjustQuantity } = useAssetsStore();

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  // Fetch assets on mount
  useEffect(() => {
    fetchAssets();
  }, []);

  // Dynamic filter options
  const categoryOptions = useMemo(() => {
    const categories = [...new Set(assets.map(a => a.category).filter(Boolean))];
    return categories.sort();
  }, [assets]);

  const segmentOptions = useMemo(() => {
    const segments = [...new Set(assets.map(a => a.segment).filter(Boolean))];
    return segments.sort();
  }, [assets]);

  const itemDescriptionOptions = useMemo(() => {
    const descriptions = [...new Set(assets.map(a => a.itemDescription).filter(Boolean))];
    return descriptions.sort();
  }, [assets]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showArchived, setShowArchived] = useState(false);
  const [search, setSearch] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [filterItem, setFilterItem] = useState("");

  const [form, setForm] = useState(initialForm);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustMode, setAdjustMode] = useState("add");
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("1");
  const [adjustError, setAdjustError] = useState("");

  // ===== FILTERED ASSETS =====
  const filteredAssets = useMemo(() => {
    return assets.filter((a) => {
      const matchSearch =
        a.itemDescription?.toLowerCase().includes(search.toLowerCase()) ||
        a.brand?.toLowerCase().includes(search.toLowerCase()) ||
        a.serialNo?.toLowerCase().includes(search.toLowerCase());

      const matchCategory = !filterCategory || a.category === filterCategory;
      const matchSegment = !filterSegment || a.segment === filterSegment;
      const matchItem = !filterItem || a.itemDescription === filterItem;

      const matchArchived = showArchived ? a.archived : !a.archived;

      return matchSearch && matchCategory && matchSegment && matchItem && matchArchived;
    });
  }, [assets, search, showArchived, filterCategory, filterSegment, filterItem]);

  // ===== HANDLERS =====
  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(initialForm);
  };

  const handleSave = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.category || !form.itemDescription || !form.segment || !form.brand || !form.quantity || !form.acquisitionDate) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Prepare payload with proper data types
    const payload = {
      category: form.category,
      itemDescription: form.itemDescription,
      segment: form.segment,
      brand: form.brand,
      quantity: parseInt(form.quantity, 10),
      serialNo: form.serialNo || undefined, // Optional field
      acquisitionDate: new Date(form.acquisitionDate),
      ...(editingId ? {} : { archived: false }) // Add archived: false only for new assets
    };

    try {
      if (editingId) {
        await updateAsset(editingId, payload);
        toast.success("Asset updated successfully!");
      } else {
        await addAsset(payload);
        toast.success("Asset added successfully!");
      }
      closeModal();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save asset");
    }
  };

  const handleEdit = (asset) => {
    setEditingId(asset._id);
    setForm({
      category: asset.category || "",
      itemDescription: asset.itemDescription || "",
      segment: asset.segment || "",
      brand: asset.brand || "",
      quantity: asset.quantity?.toString() || "",
      serialNo: asset.serialNo || "",
      acquisitionDate: asset.acquisitionDate ? new Date(asset.acquisitionDate).toISOString().split('T')[0] : "",
    });
    setShowModal(true);
  };

  const openAdjustModal = (asset, mode) => {
    if (asset?.archived) return alert("Cannot adjust quantities of archived item.");
    setAdjustMode(mode);
    setAdjustTarget(asset);
    setAdjustAmount("1");
    setAdjustError("");
    setShowAdjustModal(true);
  };

  const handleToggleArchive = async (assetId) => {
    try {
      await toggleArchive(assetId);
      toast.success("Asset archive status updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to update archive status");
    }
  };

  const handleConfirmAdjust = async (e) => {
  e.preventDefault();
  if (!adjustTarget) return;

  const amount = parseInt(adjustAmount, 10);
  if (isNaN(amount) || amount <= 0) {
    setAdjustError("Please enter a valid quantity");
    return;
  }

  try {
    await adjustQuantity(adjustTarget._id, amount, adjustMode);
    toast.success(
      adjustMode === "add"
        ? "Quantity added successfully!"
        : "Quantity removed successfully!"
    );
    // Reset modal state
    setShowAdjustModal(false);
    setAdjustTarget(null);
    setAdjustAmount("1");
    setAdjustError("");
  } catch (error) {
    setAdjustError(error.response?.data?.message || error.message || "Failed to adjust quantity");
  }
};
  

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <PageHeader pageName="Assets Management" />

      {/* ================= TABLE CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">

          {/* LEFT FILTERS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">

            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">Search</label>
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1.5 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                <Search size={16} className="text-gray-500 mr-2" />
                <input type="text" placeholder="Item, Brand or Serial" value={search} onChange={(e) => setSearch(e.target.value)} className="outline-none bg-transparent flex-1 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">Category</label>
              <select value={filterCategory} onChange={(e) => { setFilterCategory(e.target.value); setFilterSegment(''); setFilterItem(''); }} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500">
                <option value="">All Categories</option>
                {categoryOptions.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">Item Description</label>
              <select value={filterItem} onChange={(e) => setFilterItem(e.target.value)} disabled={!filterSegment} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                <option value="">All Items</option>
                {itemDescriptionOptions.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>

            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">Segment</label>
              <select value={filterSegment} onChange={(e) => { setFilterSegment(e.target.value); setFilterItem(''); }} disabled={!filterCategory} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100">
                <option value="">All Segments</option>
                {segmentOptions.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

          </div>

          <div className="flex gap-2 w-full md:w-auto">
            <button onClick={() => { setShowModal(true); setEditingId(null); setForm(initialForm); }} className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"><Plus size={16} /> Add Asset</button>

            <button onClick={() => setShowArchived(!showArchived)} className={`px-4 py-2 rounded-md text-sm font-bold ${showArchived ? 'bg-gray-700 text-white' : 'bg-gray-300 text-gray-800'}`}>{showArchived ? '← Back to Active' : 'View Archived'}</button>
          </div>
        </div>

        {/* Table */}
<div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
  <table className="w-full text-sm table-auto">
    <thead className="bg-[#010197] text-white uppercase tracking-wide">
      <tr>
        <th className="p-3 text-left whitespace-nowrap">Category</th>
        <th className="p-3 text-left whitespace-nowrap">Item Description</th>
        <th className="p-3 text-left whitespace-nowrap">Segment</th>
        <th className="p-3 text-left whitespace-nowrap">Brand</th>
        <th className="p-3 text-center bg-[#28a745] whitespace-nowrap">Quantity</th>
        <th className="p-3 text-left whitespace-nowrap">Serial No.</th>
        <th className="p-3 text-left whitespace-nowrap">Acquisition Date</th>
        <th className="p-3 text-center whitespace-nowrap">Actions</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filteredAssets.length ? (
        filteredAssets.map((a) => (
          <tr
            key={a._id}
            className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
          >
            <td className="p-4 font-semibold text-gray-800"><div className="max-w-[140px] truncate">{a.category}</div></td>
            <td className="p-4 text-gray-500"><div className="max-w-[240px] truncate">{a.itemDescription}</div></td>
            <td className="p-4 text-gray-600"><div className="max-w-[140px] truncate">{a.segment}</div></td>
            <td className="p-4 text-gray-600"><div className="max-w-[140px] truncate">{a.brand}</div></td>
            <td className="p-4 text-center bg-[#28a745] text-white font-semibold">{a.quantity ?? 0}</td>
            <td className="p-4 text-gray-600"><div className="max-w-[140px] truncate">{a.serialNo || "—"}</div></td>
            <td className="p-4 text-gray-600"><div className="max-w-[140px] truncate">{formatDate(a.acquisitionDate)}</div></td>
            <td className="p-4 text-center">
              <div className="flex justify-center gap-2">
                {!showArchived && (
                  <>
                    <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800 transition flex items-center gap-1 font-bold">Edit</button>
                    <button onClick={() => openAdjustModal(a, 'add')} className="px-2 py-1 rounded text-xs bg-green-600 text-white hover:bg-green-700">+ Qty</button>
                    <button onClick={() => openAdjustModal(a, 'damage')} className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700">Damage</button>
                  </>
                )}
                <button onClick={() => handleToggleArchive(a._id)} className={`px-3 py-1 rounded text-xs text-white transition ${showArchived ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"}`}>
                  {showArchived ? "Unarchive" : "Archive"}
                </button>
              </div>
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="8" className="text-center py-6 text-gray-500">
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
        {[
          { name: "category", label: "Category", required: true },
          { name: "itemDescription", label: "Item Description", required: true },
          { name: "segment", label: "Segment", required: true },
          { name: "brand", label: "Brand", required: true },
          { name: "quantity", label: "Quantity", type: "number", required: true },
          { name: "serialNo", label: "Serial No." },
          { name: "acquisitionDate", label: "Acquisition Date", type: "date", required: true },
        ].map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-semibold mb-1 text-gray-700">
              {field.label} {field.required && <span className="text-red-500">*</span>}
            </label>
            <input
              name={field.name}
              type={field.type || "text"}
              value={form[field.name]}
              onChange={(e) =>
                setForm({ ...form, [field.name]: e.target.value })
              }
              required={field.required}
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

{showAdjustModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => { setShowAdjustModal(false); setAdjustTarget(null); setAdjustAmount('1'); setAdjustError(''); }}>
    <div className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg" onClick={(e) => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-gray-800">{adjustMode === 'add' ? 'Add Quantity' : 'Report Damage / Remove Quantity'}</h4>
        <button onClick={() => { setShowAdjustModal(false); setAdjustTarget(null); setAdjustAmount('1'); setAdjustError(''); }} className="text-gray-600 hover:text-gray-800"><X size={20} /></button>
      </div>

      <form onSubmit={handleConfirmAdjust} className="grid gap-4">
        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Item</label>
          <div className="text-sm text-gray-600">{adjustTarget?.itemDescription} - <span className="font-semibold">{adjustTarget?.code}</span></div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-1 text-gray-700">Quantity to {adjustMode === 'add' ? 'add' : 'remove'}</label>
          <input type="number" min="1" value={adjustAmount} onChange={(e) => setAdjustAmount(e.target.value)} className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm focus:ring-2 focus:ring-[#010197] focus:outline-none" />
          {adjustMode === 'damage' && (
            <p className="text-xs text-gray-500 mt-1">Current: {adjustTarget?.updatedCount ?? 0}</p>
          )}
          {adjustError && <p className="text-xs text-red-600 mt-1">{adjustError}</p>}
        </div>

        <div className="flex gap-4">
          <button type="submit" className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]">{adjustMode === 'add' ? 'Add' : 'Remove'}</button>
          <button type="button" onClick={() => { setShowAdjustModal(false); setAdjustTarget(null); setAdjustAmount('1'); setAdjustError(''); }} className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500">Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}

    </main>
  );
};

export default Assets;
