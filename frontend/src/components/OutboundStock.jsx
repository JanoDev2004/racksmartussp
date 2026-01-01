import React, { useEffect, useState } from "react";
import { Plus, Minus, CheckCircle, PackageMinus } from "lucide-react";

const OutboundStock = () => {
  // ================= STATE =================
  const [packingLists, setPackingLists] = useState({});
  const [selectedPL, setSelectedPL] = useState("");
  const [items, setItems] = useState([]);

  // ================= LOAD OUTBOUND PACKING LISTS =================
  useEffect(() => {
    const saved = localStorage.getItem("outbound-records");
    if (saved) setPackingLists(JSON.parse(saved));
  }, []);

  // ================= SELECT PACKING LIST =================
  const handleSelectPL = (pl) => {
    setSelectedPL(pl);

    const mappedItems = packingLists[pl].items.map((i) => ({
      ...i,
      actualQty: i.qty, // default same as planned
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

  // ================= CONFIRM OUTBOUND =================
  const confirmOutbound = () => {
    if (!selectedPL) return;

    // 👉 DITO normally magbabawas ng stock (demo lang)
    console.log("Outbounded Items:", items);

    const updated = { ...packingLists };
    delete updated[selectedPL];

    setPackingLists(updated);
    localStorage.setItem("outbound-records", JSON.stringify(updated));

    setSelectedPL("");
    setItems([]);

    alert("Stock successfully outbounded!");
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <PackageMinus size={20} /> RACKSMART – Outbound Stock Verification
        </h1>
        <p className="text-gray-500 text-sm">
          Verify physical dispatch before deducting inventory.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Physically count items before release.</li>
            <li>Adjust quantity if short or partially released.</li>
            <li>Confirm only once items are ready for dispatch.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ================= LEFT ================= */}
        <div className="lg:col-span-2 space-y-6">
          {/* SELECT PACKING LIST */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Select Packing Lists
            </h5>

            <label className="text-[14px] font-bold text-gray-400  mb-1 block">
              Select Packing List
            </label>

            <select
              value={selectedPL}
              onChange={(e) => handleSelectPL(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select Packing List --</option>
              {Object.keys(packingLists).map((pl) => (
                <option key={pl} value={pl}>
                  {pl} – {packingLists[pl].packingNumber}
                </option>
              ))}
            </select>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Dispatch Quantity Verification
            </h5>

            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-[#010197] text-white uppercase tracking-wide">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Category</th>
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
                          {i.code}
                        </td>
                        <td className="p-4">{i.category}</td>
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
                  onClick={confirmOutbound}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-bold flex items-center gap-2"
                >
                  <CheckCircle size={18} />
                  Confirm Outbound
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

          {Object.keys(packingLists).length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">
              No pending outbound lists
            </p>
          ) : (
            Object.keys(packingLists).map((pl) => (
              <div key={pl} className="border rounded-lg p-3 mb-3 bg-gray-50">
                <p className="text-xs font-bold text-blue-600">{pl}</p>
                <p className="font-bold text-gray-800">
                  {packingLists[pl].packingNumber}
                </p>
                <p className="text-xs text-gray-500">
                  {packingLists[pl].consignee}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default OutboundStock;
