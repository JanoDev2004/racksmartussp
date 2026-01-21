import React, { useEffect, useState } from "react";
import { Plus, Minus, CheckCircle } from "lucide-react";
import { useInboundStore } from "../stores/useInboundStore";

const InboundStock = () => {
  // ================= STORE =================
  const {
    pendingPackingLists,
    fetchPendingPackingLists,
    confirmInbound,
    loading,
  } = useInboundStore();

  // ================= STATE =================
  const [selectedPL, setSelectedPL] = useState(""); // containerNumber
  const [items, setItems] = useState([]);

  // ================= LOAD PENDING PACKING LISTS =================
  useEffect(() => {
    fetchPendingPackingLists();
  }, [fetchPendingPackingLists]);

  // ================= SELECT PACKING LIST =================
  const handleSelectPL = (containerNumber) => {
    setSelectedPL(containerNumber);

    if (!containerNumber) {
      setItems([]);
      return;
    }

    const pl = pendingPackingLists.find(
      (p) => p.containerNumber === containerNumber
    );

    if (!pl) return;

    const mappedItems = (pl.items || []).map((i) => ({
      ...i,
      actualQty: i.qty || 0, // default = planned qty
    }));

    setItems(mappedItems);
  };

  // ================= ADJUST QTY =================
  const adjustQty = (idx, type) => {
    const updated = [...items];

    if (type === "minus" && updated[idx].actualQty > 0) {
      updated[idx].actualQty -= 1;
    }

    if (type === "plus" && updated[idx].actualQty < updated[idx].qty) {
      updated[idx].actualQty += 1;
    }

    setItems(updated);
  };

  // ================= CONFIRM INBOUND =================
  const handleConfirmInbound = async () => {
    if (!selectedPL) return;

    const res = await confirmInbound({
      containerNumber: selectedPL,
      items,
    });

    if (res.success) {
      setSelectedPL("");
      setItems([]);
      alert("Stock successfully inbounded!");
    }
  };

  const sortedPendingPackingLists = [...pendingPackingLists].sort((a, b) => {
    if (!a.deliveryDate) return 1;
    if (!b.deliveryDate) return -1;
    return new Date(a.deliveryDate) - new Date(b.deliveryDate);
  });

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Inbound Stock Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Verify physical count before updating inventory.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* SELECT PACKING LIST */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Purchase Orders Pending
            </h5>

            <label className="text-[14px] font-bold text-gray-400 mb-1 block">
              Select Packing List
            </label>

            <select
              value={selectedPL}
              onChange={(e) => handleSelectPL(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Packing List --</option>
              {pendingPackingLists.map((pl) => (
                <option key={pl.containerNumber} value={pl.containerNumber}>
                  {pl.containerNumber} – {pl.poNumber}
                </option>
              ))}
            </select>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Physical Count Verification
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
                      <td
                        colSpan="6"
                        className="text-center py-10 text-gray-400 italic"
                      >
                        Select a packing list
                      </td>
                    </tr>
                  ) : (
                    items.map((i, idx) => (
                      <tr
                        key={idx}
                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                      >
                        <td className="p-4 font-semibold text-blue-700">
                          {i.itemCode}
                        </td>
                        <td className="p-4">{i.itemDescription}</td>
                        <td className="p-4">{i.dimension}</td>
                        <td className="p-4 text-center font-bold">{i.qty}</td>
                        <td className="p-4 text-center font-bold">
                          {i.actualQty}
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex justify-center gap-2">
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
                          </div>
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
                  onClick={handleConfirmInbound}
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2 disabled:opacity-50"
                >
                  <CheckCircle size={18} />
                  Confirm Inbound
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Pending Packing Lists
          </h5>

          {sortedPendingPackingLists.map((pl) => {
            const isSelected = selectedPL === pl.containerNumber;

            return (
              <div
                key={pl.containerNumber}
                onClick={() => handleSelectPL(pl.containerNumber)}
                className={`border rounded-lg p-3 mb-3 cursor-pointer transition
        ${
          isSelected
            ? "border-blue-600 bg-blue-100"
            : "bg-gray-50 hover:bg-blue-50"
        }
      `}
              >
                <p className="text-xs font-bold text-blue-600">
                  Container Number: {pl.containerNumber}
                </p>

                <p className="font-bold text-gray-800">
                  Delivery Date:{" "}
                  {pl.deliveryDate
                    ? new Date(pl.deliveryDate).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "N/A"}
                </p>

                <p className="font-bold text-gray-800">
                  PO Number: {pl.poNumber}
                </p>

                <p className="font-bold text-gray-800">
                  Supplier: {pl.supplier.toUpperCase()}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default InboundStock;
