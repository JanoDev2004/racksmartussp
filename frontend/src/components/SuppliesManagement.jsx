import React, { useState, useEffect, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import PageHeader from "./PageHeader";
import { useSuppliesStore } from "../stores/useSuppliesStore.js"; // your Zustand store
import { toast } from "react-hot-toast";

// Initial form
const initialSupplyForm = {
  category: "",
  itemCode: "",
  segment: "",
  itemDescription: "",
  dimension: "",
  quantity: "",
  uom: "",
  brand: "",
  color: "",
  serialNo: "",
  acquisitionDate: "",
  location: "",
  accountTo: "",
};

const SuppliesManagement = () => {
  const {
    supplies,
    loading,
    fetchSupplies,
    addSupply,
    updateSupply,
    deleteSupply,
  } = useSuppliesStore();

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("default", { month: "long" });
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const [searchCode, setSearchCode] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSegment, setFilterSegment] = useState("");
  const [filterItem, setFilterItem] = useState("");
  const [modalForm, setModalForm] = useState(initialSupplyForm);
  const [editingSupplyId, setEditingSupplyId] = useState(null);

  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustMode, setAdjustMode] = useState("add"); // 'add' or 'damage'
  const [adjustTarget, setAdjustTarget] = useState(null);
  const [adjustAmount, setAdjustAmount] = useState("1");
  const [adjustError, setAdjustError] = useState("");

  /* ================= FETCH SUPPLIES ON MOUNT ================= */
  useEffect(() => {
    fetchSupplies();
  }, []);

  /* ================= DYNAMIC FILTER OPTIONS ================= */
  const categoryOptions = useMemo(() => {
    const categories = [
      ...new Set(supplies.map((s) => s.category).filter(Boolean)),
    ];
    return categories.sort();
  }, [supplies]);

  const segmentOptions = useMemo(() => {
    const segments = [
      ...new Set(supplies.map((s) => s.segment).filter(Boolean)),
    ];
    return segments.sort();
  }, [supplies]);

  const itemDescriptionOptions = useMemo(() => {
    const descriptions = [
      ...new Set(supplies.map((s) => s.itemDescription).filter(Boolean)),
    ];
    return descriptions.sort();
  }, [supplies]);

  /* ================= FILTER SUPPLIES ================= */
  const filteredSupplies = useMemo(() => {
    return supplies.filter((s) => {
      const matchArchive = showArchived ? s.archived : !s.archived;
      const matchSearch =
        (s.itemCode || "").toLowerCase().includes(searchCode.toLowerCase()) ||
        (s.itemDescription || "")
          .toLowerCase()
          .includes(searchCode.toLowerCase());

      const matchCategory = !filterCategory || s.category === filterCategory;
      const matchSegment = !filterSegment || s.segment === filterSegment;
      const matchItem = !filterItem || s.itemDescription === filterItem;

      return (
        matchArchive &&
        matchSearch &&
        matchCategory &&
        matchSegment &&
        matchItem
      );
    });
  }, [
    supplies,
    searchCode,
    showArchived,
    filterCategory,
    filterSegment,
    filterItem,
  ]);

  /* ================= SAVE SUPPLY ================= */
  const handleSaveSupply = async (e) => {
    e?.preventDefault();

    try {
      if (editingSupplyId) {
        await updateSupply(editingSupplyId, modalForm);
        toast.success("Supply updated successfully!");
      } else {
        await addSupply({ ...modalForm, archived: false });
        toast.success("Supply added successfully!");
      }
      setShowAddModal(false);
      setEditingSupplyId(null);
      setModalForm(initialSupplyForm);
    } catch (err) {
      console.error("Error saving supply:", err);
      toast.error(err.response?.data?.message || "Failed to save supply");
    }
  };

  /* ================= ARCHIVE ================= */
  const handleArchive = async (supply) => {
    try {
      await updateSupply(supply._id, { ...supply, archived: true });
      toast.success("Supply archived successfully!");
    } catch (err) {
      console.error("Failed to archive supply:", err);
      toast.error("Failed to archive supply");
    }
  };

  const handleUnarchive = async (supply) => {
    try {
      await updateSupply(supply._id, { ...supply, archived: false });
      toast.success("Supply unarchived successfully!");
    } catch (err) {
      console.error("Failed to unarchive supply:", err);
      toast.error("Failed to unarchive supply");
    }
  };

  /* ================= EDIT SUPPLY ================= */
  const handleEditSupply = (supply) => {
    setEditingSupplyId(supply._id);
    setModalForm({
      category: supply.category || "",
      itemCode: supply.itemCode || "",
      segment: supply.segment || "",
      itemDescription: supply.itemDescription || "",
      dimension: supply.dimension || "",
      quantity: supply.quantity ?? 0,
      uom: supply.uom || "",
      brand: supply.brand || "",
      color: supply.color || "",
      serialNo: supply.serialNo || "",
      acquisitionDate: supply.acquisitionDate || "",
      location: supply.location || "",
      accountTo: supply.accountTo || "",
    });
    setShowAddModal(true);
  };

  /* ================= QUANTITY ADJUST ================= */
  const openAdjustModal = (supply, mode) => {
    if (supply.archived) return alert("Cannot adjust archived supplies.");
    setAdjustMode(mode);
    setAdjustTarget(supply);
    setAdjustAmount("1");
    setAdjustError("");
    setShowAdjustModal(true);
  };

  const handleConfirmAdjust = async (e) => {
    e?.preventDefault();
    const amt = Number(adjustAmount);
    if (amt <= 0) {
      toast.error("Enter a positive quantity.");
      return setAdjustError("Enter a positive quantity.");
    }
    if (!adjustTarget) return;

    let newCount = adjustTarget.quantity || 0;
    if (adjustMode === "damage") {
      if (amt > newCount) {
        toast.error("Cannot remove more than current quantity.");
        return setAdjustError("Cannot remove more than current quantity.");
      }
      newCount -= amt;
    } else {
      newCount += amt;
    }

    try {
      await updateSupply(adjustTarget._id, {
        ...adjustTarget,
        quantity: newCount,
      });
      toast.success(
        `Quantity ${adjustMode === "add" ? "added" : "removed"} successfully!`
      );
      setShowAdjustModal(false);
      setAdjustTarget(null);
      setAdjustAmount("1");
      setAdjustError("");
    } catch (err) {
      console.error("Failed to adjust quantity:", err);
      toast.error("Failed to adjust quantity");
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <PageHeader pageName="Supplies Management" />

      {/* ================= CONTROLS ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-4">
          {/* SEARCH & FILTER */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <div>
              <label className="text-sm font-bold text-gray-400 mb-1 block">
                Search
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-2 py-1.5 text-sm focus-within:ring-2 focus-within:ring-blue-500">
                <Search size={16} className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Code or Item"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  className="outline-none bg-transparent flex-1 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-400 mb-1 block">
                Category
              </label>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categoryOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-400 mb-1 block">
                Segment
              </label>
              <select
                value={filterSegment}
                onChange={(e) => setFilterSegment(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Segments</option>
                {segmentOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-bold text-gray-400 mb-1 block">
                Item
              </label>
              <select
                value={filterItem}
                onChange={(e) => setFilterItem(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Items</option>
                {itemDescriptionOptions.map((i) => (
                  <option key={i} value={i}>
                    {i}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ADD / VIEW ARCHIVED BUTTONS */}
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingSupplyId(null);
                setModalForm(initialSupplyForm);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm"
            >
              <Plus size={16} /> Add Supply
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
          <table className="w-full text-sm table-auto">
            <thead className="bg-[#010197] text-white uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Item Code</th>
                <th className="p-3 text-left">Item Description</th>
                <th className="p-3 text-left">Segment</th>
                <th className="p-3 text-left">Dimension</th>
                <th className="p-3 text-center bg-green-700">Quantity</th>
                <th className="p-3 text-left">Color</th>
                <th className="p-3 text-left">Brand</th>
                <th className="p-3 text-left">Serial No.</th>
                <th className="p-3 text-left">Acquisition Date</th>
                <th className="p-3 text-left">Location</th>
                <th className="p-3 text-left">Account To</th>
                <th className="p-3 text-left">U.O.M</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="14" className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredSupplies.length > 0 ? (
                filteredSupplies.map((s) => (
                  <tr
                    key={s._id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                  >
                    <td className="p-3">{s.category}</td>
                    <td className="p-3 font-semibold">{s.itemCode}</td>
                    <td className="p-3">{s.itemDescription}</td>
                    <td className="p-3">{s.segment}</td>
                    <td className="p-3">{s.dimension}</td>
                    <td className="p-3 text-center font-semibold text-white bg-green-700">
                      {s.quantity ?? 0}
                    </td>
                    <td className="p-3">{s.color}</td>
                    <td className="p-3">{s.brand}</td>
                    <td className="p-3">{s.serialNo || "—"}</td>
                    <td className="p-3">{formatDate(s.acquisitionDate)}</td>
                    <td className="p-3">{s.location}</td>
                    <td className="p-3">{s.accountTo || "—"}</td>
                    <td className="p-3">{s.uom}</td>
                    <td className="p-3 text-center flex justify-center gap-2">
                      {!showArchived && (
                        <>
                          <button
                            onClick={() => handleEditSupply(s)}
                            className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => openAdjustModal(s, "add")}
                            className="px-2 py-1 rounded text-xs bg-green-600 text-white hover:bg-green-700"
                          >
                            +
                          </button>
                          <button
                            onClick={() => openAdjustModal(s, "damage")}
                            className="px-2 py-1 rounded text-xs bg-red-600 text-white hover:bg-red-700"
                          >
                            -
                          </button>
                        </>
                      )}
                      <button
                        onClick={() =>
                          showArchived ? handleUnarchive(s) : handleArchive(s)
                        }
                        className={`px-3 py-1 rounded text-xs text-white ${
                          showArchived
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        {showArchived ? "Unarchive" : "Archive"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="14" className="text-center py-6 text-gray-500">
                    {showArchived
                      ? "No archived supplies."
                      : "No supplies found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODALS ================= */}
      {/* Add/Edit Modal */}
      {showAddModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowAddModal(false);
            setEditingSupplyId(null);
            setModalForm(initialSupplyForm);
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">
                {editingSupplyId ? "Edit Supply" : "Add New Supply"}
              </h4>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSupplyId(null);
                  setModalForm(initialSupplyForm);
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveSupply}
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {Object.entries(initialSupplyForm).map(([key]) => {
                let type =
                  key === "acquisitionDate"
                    ? "date"
                    : key === "quantity"
                    ? "number"
                    : "text";
                return (
                  <div key={key}>
                    <label className="block text-sm font-semibold mb-1">
                      {key}
                    </label>
                    <input
                      type={type}
                      name={key}
                      value={modalForm[key]}
                      onChange={(e) =>
                        setModalForm({ ...modalForm, [key]: e.target.value })
                      }
                      required
                      className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm focus:ring-2 focus:ring-[#010197] focus:outline-none"
                    />
                  </div>
                );
              })}

              <div className="col-span-1 md:col-span-2 flex gap-4 mt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]"
                >
                  {editingSupplyId ? "Save Changes" : "Save Supply"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setModalForm(initialSupplyForm);
                    setEditingSupplyId(null);
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Quantity Modal */}
      {showAdjustModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => {
            setShowAdjustModal(false);
            setAdjustTarget(null);
            setAdjustAmount("1");
            setAdjustError("");
          }}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-sm shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold">
                {adjustMode === "add"
                  ? "Add Quantity"
                  : "Report Damage / Remove Quantity"}
              </h4>
              <button
                onClick={() => {
                  setShowAdjustModal(false);
                  setAdjustTarget(null);
                  setAdjustAmount("1");
                  setAdjustError("");
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmAdjust} className="grid gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Item</label>
                <div className="text-sm text-gray-600">
                  {adjustTarget?.itemDescription} -{" "}
                  <span className="font-semibold">
                    {adjustTarget?.itemCode}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-1">
                  Quantity to {adjustMode === "add" ? "add" : "remove"}
                </label>
                <input
                  type="number"
                  min="1"
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="border border-gray-300 rounded-md px-2 py-1 w-full text-sm focus:ring-2 focus:ring-[#010197] focus:outline-none"
                />
                {adjustMode === "damage" && (
                  <p className="text-xs text-gray-500 mt-1">
                    Current: {adjustTarget?.quantity ?? 0}
                  </p>
                )}
                {adjustError && (
                  <p className="text-xs text-red-600 mt-1">{adjustError}</p>
                )}
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]"
                >
                  {adjustMode === "add" ? "Add" : "Remove"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAdjustModal(false);
                    setAdjustTarget(null);
                    setAdjustAmount("1");
                    setAdjustError("");
                  }}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default SuppliesManagement;
