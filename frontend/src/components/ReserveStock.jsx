import React, { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen } from "lucide-react";
import PageHeader from "../components/PageHeader";

const ReserveStock = () => {
  // --- Demo Products (hardcoded for frontend-only) ---
  const demoProducts = [
    { code: "P001", itemDescription: "Product One", uom: "pcs" },
    { code: "P002", itemDescription: "Product Two", uom: "pcs" },
    { code: "P003", itemDescription: "Product Three", uom: "pcs" },
  ];

  // Current reserved package
  const [packageName, setPackageName] = useState("RESERVED-PACKAGE-0001");
  const [reservedItems, setReservedItems] = useState([]);

  // Add product state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");

  // Saved packages in localStorage
  const [savedPackages, setSavedPackages] = useState({});
  const [selectedSavedPackage, setSelectedSavedPackage] = useState("");

  // Load saved packages from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("reserved-packages");
    if (saved) {
      const parsed = JSON.parse(saved);
      setSavedPackages(parsed);
      const keys = Object.keys(parsed);
      if (keys.length > 0) setSelectedSavedPackage(keys[0]);
    }
  }, []);

  // Add item to current reserved package
  const addItem = () => {
    if (!selectedProduct) return alert("Select a product!");
    if (!qty || Number(qty) <= 0) return alert("Enter valid quantity!");

    const product = demoProducts.find((p) => p.code === selectedProduct);
    if (!product) return alert("Product not found!");

    const existingIdx = reservedItems.findIndex((i) => i.code === selectedProduct);
    let updated;
    if (existingIdx > -1) {
      updated = reservedItems.map((it, i) =>
        i === existingIdx ? { ...it, qty: String(Number(it.qty) + Number(qty)) } : it
      );
    } else {
      updated = [
        ...reservedItems,
        {
          code: product.code,
          description: product.itemDescription || "No description",
          qty: String(qty),
          unit: product.uom || "pcs",
        },
      ];
    }

    setReservedItems(updated);
    setSelectedProduct("");
    setQty("");
  };

  // Save current package (hold stock)
  const savePackage = () => {
    if (reservedItems.length === 0) return alert("Add at least one item!");
    const updated = {
      ...savedPackages,
      [packageName]: {
        items: [...reservedItems],
        savedAt: new Date().toLocaleString(),
      },
    };
    setSavedPackages(updated);
    localStorage.setItem("reserved-packages", JSON.stringify(updated));
    alert(`Package "${packageName}" reserved!`);
  };

  // Load package
  const loadPackage = (name) => {
    if (!savedPackages[name]) return;
    setReservedItems([...savedPackages[name].items]);
    setPackageName(name);
    setSelectedSavedPackage(name);
  };

  // Release reserved package
  const releasePackage = (name) => {
    if (!window.confirm(`Release reserved package "${name}"?`)) return;
    const updated = { ...savedPackages };
    delete updated[name];
    setSavedPackages(updated);
    localStorage.setItem("reserved-packages", JSON.stringify(updated));
    if (selectedSavedPackage === name) {
      setReservedItems([]);
      setPackageName("New Package");
      setSelectedSavedPackage("");
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* ================= HEADER CONTAINER ================= */}
      <PageHeader pageName="Reserve Stock" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Saved Packages */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Current Reserved Package: <span className="text-blue-600">{packageName}</span>
          </h5>

          {/* Add Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
      <label className="text-[14px] font-bold text-gray-400 mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Product --</option>
                {demoProducts.map((p) => (
                  <option key={p.code} value={p.code}>
                    {p.code} - {p.itemDescription}
                  </option>
                ))}
              </select>
            </div>

            <div>
      <label className="text-[14px] font-bold text-gray-400 mb-1">Quantity</label>
              <input
                type="number"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                placeholder="Qty"
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
              />
            </div>

            <div className="flex items-end">
              <button
                onClick={addItem}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
              >
                + Add to Reserved
              </button>
            </div>
          </div>

          {/* Reserved Items Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
  <table className="w-full text-sm">
    <thead className="bg-[#010197] text-white uppercase tracking-wide">
      <tr>
        <th className="p-3 text-left">NO</th>
        <th className="p-3 text-left">CODE</th>
        <th className="p-3 text-left">DESCRIPTION</th>
        <th className="p-3 text-right">QTY</th>
        <th className="p-3 text-center">ACTION</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {reservedItems.length === 0 ? (
        <tr>
          <td colSpan="5" className="text-center py-10 text-gray-500 italic">
            No items reserved yet. Select product & quantity above.
          </td>
        </tr>
      ) : (
        reservedItems.map((item, i) => (
          <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
            <td className="p-4">{i + 1}</td>
            <td className="p-4 font-semibold text-blue-700">{item.code}</td>
            <td className="p-4">{item.description}</td>
            <td className="p-4 text-right font-bold">{item.qty}</td>
            <td className="p-4 text-center">
              <button
                onClick={() =>
                  setReservedItems(reservedItems.filter((_, idx) => idx !== i))
                }
                className="text-red-500 hover:text-red-700 transition"
              >
                <Trash2 size={16} />
              </button>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>


          <div className="flex justify-end mt-4 gap-2">
            <button
              onClick={savePackage}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#00ce5d] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
            >
              Reserve Package
            </button>
          </div>
        </div>

        {/* Right Panel: Current Package */}

        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Reserved Packages
            </h5>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {Object.keys(savedPackages).length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No reserved packages</p>
              ) : (
                Object.keys(savedPackages).map((name) => (
                  <div
                    key={name}
                    className={`p-3 rounded border cursor-pointer transition ${selectedSavedPackage === name
                        ? "bg-blue-50 border-blue-500"
                        : "border-gray-300 hover:bg-gray-50"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{name}</p>
                        <p className="text-xs text-gray-500">
                          {savedPackages[name].items.length} items • {savedPackages[name].savedAt}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => loadPackage(name)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          onClick={() => releasePackage(name)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default ReserveStock;
