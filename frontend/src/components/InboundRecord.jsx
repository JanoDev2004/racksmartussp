import React, { useState, useEffect } from "react";
import { Plus, Trash2, PackageCheck } from "lucide-react";

const InboundRecord = () => {
    // ================= STATES =================
    const [poNumber, setPoNumber] = useState("");
    const [supplier, setSupplier] = useState("");
    const [date, setDate] = useState("");
    const [preparedBy, setPreparedBy] = useState("");

    const [selectedProduct, setSelectedProduct] = useState("");
    const [productQty, setProductQty] = useState("");
    const [items, setItems] = useState([]);

    const [savedInbound, setSavedInbound] = useState({});

    // ================= DEMO PRODUCTS =================
    const products = [
        { code: "PRD-001", category: "Steel", dimension: "10x10", uom: "pcs" },
        { code: "PRD-002", category: "Cement", dimension: "50kg", uom: "bag" },
        { code: "PRD-003", category: "Wood", dimension: "2x4", uom: "pcs" },
    ];

    // ================= LOAD LOCAL STORAGE =================
    useEffect(() => {
        const saved = localStorage.getItem("inbound-records");
        if (saved) setSavedInbound(JSON.parse(saved));
    }, []);

    // ================= ADD ITEM =================
    const handleAddItem = () => {
        if (!selectedProduct || !productQty || Number(productQty) <= 0) return;

        const product = products.find((p) => p.code === selectedProduct);
        if (!product) return;

        const existing = items.findIndex((i) => i.code === selectedProduct);

        if (existing !== -1) {
            const updated = [...items];
            updated[existing].qty += Number(productQty);
            setItems(updated);
        } else {
            setItems([
                ...items,
                {
                    code: product.code,
                    category: product.category,
                    dimension: product.dimension,
                    qty: Number(productQty),
                    uom: product.uom,
                },
            ]);
        }

        setSelectedProduct("");
        setProductQty("");
    };

    // ================= REMOVE ITEM =================
    const removeItem = (idx) => {
        setItems(items.filter((_, i) => i !== idx));
    };

    // ================= SAVE PACKING LIST =================
    const saveInbound = () => {
        if (!poNumber || items.length === 0) {
            alert("PO details or item list is incomplete.");
            return;
        }

        const recordId = `PL-${Date.now().toString().slice(-4)}`;

        const updated = {
            ...savedInbound,
            [recordId]: {
                poNumber,
                supplier,
                date,
                preparedBy,
                items: [...items],
                timestamp: new Date().toLocaleString(),
            },
        };

        setSavedInbound(updated);
        localStorage.setItem("inbound-records", JSON.stringify(updated));

        // reset form
        setPoNumber("");
        setSupplier("");
        setDate("");
        setPreparedBy("");
        setItems([]);

        alert("Packing List Saved!");
    };

    // ================= UI =================
    return (
        <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <PackageCheck size={20} /> RACKSMART – Inbound Record
                </h1>
                <p className="text-gray-500 text-sm">
                    Create and document inbound purchase orders from suppliers.
                </p>

                {/* Guidelines */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
                    <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
                    <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                        <li>Verify quantities against supplier invoices.</li>
                        <li>Ensure correct delivery date and PO reference.</li>
                        <li>Double-check item specifications before saving.</li>
                    </ul>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* ================= LEFT SIDE ================= */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow space-y-6">

                        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
                            Purchase Order & Inbound Items
                        </h5>


                        {/* ===== PO DETAILS ===== */}
                       <div>
  {/* PO Info */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">PO Number</label>
      <input
        type="text"
        value={poNumber}
        onChange={(e) => setPoNumber(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">Supplier</label>
      <input
        type="text"
        value={supplier}
        onChange={(e) => setSupplier(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">Delivery Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">Prepared By</label>
      <input
        type="text"
        value={preparedBy}
        onChange={(e) => setPreparedBy(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  </div>

  {/* Product Info */}
  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">Product</label>
      <select
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p.code} value={p.code}>
            {p.code} – {p.category}
          </option>
        ))}
      </select>
    </div>

    <div className="flex flex-col">
      <label className="text-[14px] font-bold text-gray-400 mb-1">Quantity</label>
      <input
        type="number"
        value={productQty}
        onChange={(e) => setProductQty(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    <div className="md:col-span-2">
      <button
        onClick={handleAddItem}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
      >
        <Plus size={16} /> Add Item
      </button>
    </div>
  </div>
</div>


                    </div>


                    {/* ITEMS TABLE */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
  <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
    Temporary Item Lists
  </h5>

  <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
    <table className="w-full text-sm">
      <thead className="bg-[#010197] text-white uppercase tracking-wide">
        <tr>
          <th className="p-3 text-left">Code</th>
          <th className="p-3 text-left">Category</th>
          <th className="p-3 text-left">Dimension</th>
          <th className="p-3 text-center">Qty</th>
          <th className="p-3 text-center">Action</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">
        {items.length === 0 ? (
          <tr>
            <td colSpan="5" className="text-center py-10 text-gray-400 italic">
              No items added
            </td>
          </tr>
        ) : (
          items.map((i, idx) => (
            <tr key={idx} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
              <td className="p-4 font-semibold text-blue-700">{i.code}</td>
              <td className="p-4">{i.category}</td>
              <td className="p-4">{i.dimension}</td>
              <td className="p-4 text-center font-bold">{i.qty} {i.uom}</td>
              <td className="p-4 text-center">
                <button
                  onClick={() => removeItem(idx)}
                  className="text-red-500 hover:text-red-700"
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

  {items.length > 0 && (
    <div className="flex justify-end mt-6">
      <button
        onClick={saveInbound}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
      >
        Save Packing List
      </button>
    </div>
  )}
</div>

                </div>

                {/* ================= RIGHT SIDE ================= */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow">
                        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
                            Pending Packing list</h5>

                        {Object.keys(savedInbound).length === 0 ? (
                            <p className="text-center text-gray-400 py-20 text-sm">
                                No saved records
                            </p>
                        ) : (
                            Object.keys(savedInbound).map((id) => (
                                <div key={id} className="border rounded-lg p-3 mb-3 bg-gray-50">
                                    <p className="text-xs font-bold text-blue-600">{id}</p>
                                    <p className="font-bold text-gray-800">
                                        {savedInbound[id].poNumber}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {savedInbound[id].supplier}
                                    </p>

                                    <ul className="list-disc list-inside text-xs mt-2">
                                        {savedInbound[id].items.map((it, i) => (
                                            <li key={i}>
                                                {it.qty} {it.uom} – {it.code}
                                            </li>
                                        ))}
                                    </ul>

                                    <p className="text-[10px] text-gray-400 mt-2 italic">
                                        {savedInbound[id].timestamp}
                                    </p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

            </div>
        </main>
    );
};

// ================= REUSABLE INPUT =================
const Input = ({ label, value, setValue, type = "text" }) => (
    <div className="flex flex-col">
        <label className="text-xs font-bold text-gray-500 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
    </div>
);

export default InboundRecord;
