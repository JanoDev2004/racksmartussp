import React, { useEffect, useState } from "react";
import { Plus, Minus, CheckCircle, PackageMinus } from "lucide-react";
import { useOutboundStore } from "../stores/useOutboundStore";

const OutboundStock = () => {
  const {
    outboundRecords,
    fetchOutboundRecords,
    confirmOutbound,
    loading,
  } = useOutboundStore();

  const [selectedPL, setSelectedPL] = useState("");
  const [items, setItems] = useState([]);

  // Load outbound records on mount
  useEffect(() => {
    fetchOutboundRecords();
  }, []);

  // Handle selecting a packing list from dropdown
  const handleSelectPL = (pl) => {
    setSelectedPL(pl);
    const record = outboundRecords.find((r) => r.packingNumber === pl);
    if (!record) return;

    const mappedItems = record.items.map((i) => ({
      ...i,
      actualQty: i.qty,
    }));

    setItems(mappedItems);
  };

  // Adjust actual quantity
  const adjustQty = (idx, type) => {
    const updated = [...items];
    if (type === "minus" && updated[idx].actualQty > 0) updated[idx].actualQty -= 1;
    if (type === "plus" && updated[idx].actualQty < updated[idx].qty) updated[idx].actualQty += 1;
    setItems(updated);
  };

  // Confirm outbound
  const handleConfirm = async () => {
    if (!selectedPL) return;

    const result = await confirmOutbound({ packingNumber: selectedPL, items });
    if (result.success) {
      alert("Outbound confirmed!");
      setSelectedPL("");
      setItems([]);
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Pending packing lists
  const pendingRecords = outboundRecords
  .filter((r) => r.status === "Pending")
  .sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date) - new Date(b.date);
  });

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <PackageMinus size={20} /> RACKSMART – Outbound Stock Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Verify physical dispatch before deducting inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Select PL & Table */}
        <div className="lg:col-span-2 space-y-6">
          {/* Dropdown */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Select Packing List
            </h5>
            <select
              value={selectedPL}
              onChange={(e) => handleSelectPL(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
            >
              <option value="">-- Select Packing List --</option>
              {pendingRecords.map((r) => (
                <option key={r.packingNumber} value={r.packingNumber}>
                  {r.packingNumber} – {r.consignee}
                </option>
              ))}
            </select>
          </div>

          {/* Items Table */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Dispatch Quantity Verification
            </h5>

            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-[#010197] text-white uppercase tracking-wide">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Dimension</th>
                    <th className="p-3 text-center">Planned</th>
                    <th className="p-3 text-center">Actual</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-10 text-gray-400 italic">
                        Select a packing list
                      </td>
                    </tr>
                  ) : (
                    items.map((i, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                      >
                        <td className="p-4 font-semibold text-blue-700">{i.itemCode}</td>
                        <td className="p-4">{i.itemDescription}</td>
                        <td className="p-4">{i.dimension}</td>
                        <td className="p-4 text-center font-bold">{i.qty}</td>
                        <td className="p-4 text-center font-bold">{i.actualQty}</td>
                        <td className="p-4 text-center flex justify-center gap-2">
                          <button
                            onClick={() => adjustQty(idx, "minus")}
                            className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition"
                          >
                            <Minus size={14} />
                          </button>
                          {i.actualQty < i.qty && (
                            <button
                              onClick={() => adjustQty(idx, "plus")}
                              className="bg-green-600 hover:bg-green-700 text-white px-2 py-1 rounded transition"
                            >
                              <Plus size={14} />
                            </button>
                          )}
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
                  onClick={handleConfirm}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2"
                  disabled={loading}
                >
                  <CheckCircle size={18} /> Confirm Outbound
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Pending Packing Lists */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Pending Packing Lists
          </h5>

          {pendingRecords.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">No pending outbound lists</p>
          ) : (
            pendingRecords.map((r) => (
              <div
                key={r.packingNumber}
                className={`border rounded-lg p-3 mb-3 bg-gray-50 cursor-pointer ${
                  selectedPL === r.packingNumber ? "border-blue-600 bg-blue-100" : ""
                }`}
                onClick={() => handleSelectPL(r.packingNumber)}
              >
                <p className="text-xs font-bold text-blue-600">{r.packingNumber}</p>
                <p className="font-bold text-gray-800">{r.consignee}</p>
                <p className="text-xs text-gray-500">{r.status}</p>
                {r.date && <p className="text-xs text-gray-400">Dispatch: {new Date(r.date).toLocaleDateString()}</p>}
                {r.dispatchDate && <p className="text-xs text-gray-400">Delivery: {new Date(r.dispatchDate).toLocaleDateString()}</p>}
                <p className="text-xs text-gray-400">Created: {new Date(r.createdAt).toLocaleDateString()}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default OutboundStock;
