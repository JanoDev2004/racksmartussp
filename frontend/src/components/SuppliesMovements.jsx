import React, { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen, ArrowLeft, Package, User } from "lucide-react";

const SuppliesMovements = () => {
  // --- Master Data (Demo) ---
  const masterSupplies = [
    { code: "SUP-001", itemDescription: "Stretch Film", uom: "Roll", currentStock: 120 },
    { code: "SUP-002", itemDescription: "Safety Helmet", uom: "Pcs", currentStock: 45 },
    { code: "SUP-003", itemDescription: "Electrical Tape", uom: "Roll", currentStock: 200 },
  ];

  // --- States ---
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [borrowerName, setBorrowerName] = useState(""); // Project or Person Name
  const [currentBasket, setCurrentBasket] = useState([]); // Temporary list before saving
  const [savedMovements, setSavedMovements] = useState({}); // Final saved records

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("supplies-movements");
    if (saved) setSavedMovements(JSON.parse(saved));
  }, []);

  // Add Item to Temporary Basket
  const addToBasket = () => {
    if (!selectedProduct) return alert("Select a supply item!");
    if (!qty || Number(qty) <= 0) return alert("Enter valid quantity!");

    const supply = masterSupplies.find((s) => s.code === selectedProduct);

    // Check if stock is enough
    if (Number(qty) > supply.currentStock) return alert("Insufficient stock!");

    const existingIdx = currentBasket.findIndex((i) => i.code === selectedProduct);
    if (existingIdx > -1) {
      const updated = [...currentBasket];
      updated[existingIdx].qty = Number(updated[existingIdx].qty) + Number(qty);
      setCurrentBasket(updated);
    } else {
      setCurrentBasket([
        ...currentBasket,
        {
          code: supply.code,
          description: supply.itemDescription,
          qty: Number(qty),
          uom: supply.uom,
        },
      ]);
    }
    setSelectedProduct("");
    setQty("");
  };

  // Save the whole basket as a "Project Movement"
  const saveMovement = () => {
    if (!borrowerName) return alert("Please enter Project/Borrower Name!");
    if (currentBasket.length === 0) return alert("Basket is empty!");

    const movementId = `${borrowerName.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const updatedMovements = {
      ...savedMovements,
      [movementId]: {
        borrower: borrowerName,
        items: [...currentBasket],
        timestamp: new Date().toLocaleString(),
      },
    };

    setSavedMovements(updatedMovements);
    localStorage.setItem("supplies-movements", JSON.stringify(updatedMovements));

    // Reset
    setCurrentBasket([]);
    setBorrowerName("");
    alert("Outbound Movement Recorded!");
  };

  // Return Items (Inbound)
  const returnMovement = (id) => {
    if (!window.confirm("Return these items to inventory?")) return;
    const updated = { ...savedMovements };
    delete updated[id];
    setSavedMovements(updated);
    localStorage.setItem("supplies-movements", JSON.stringify(updated));
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Supplies Movements
        </h1>
        <p className="text-gray-500 text-sm">
          Tracking of IN and OUT supply movements.
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Monitor the chronological flow of supplies to identify peaks in stock usage.</li>
            <li>Filter movement records by date or transaction type to reconcile inventory balances.</li>
            <li>Audit 'In' and 'Out' entries regularly to ensure all physical transfers are digitally logged.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Create Movement */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">


            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Create Outbound Basket
            </h5>

            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
      <label className="text-[14px] font-bold text-gray-400 mb-1">Supply</label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Choose Item --</option>
                  {masterSupplies.map((s) => (
                    <option key={s.code} value={s.code}>{s.code} - {s.itemDescription}</option>
                  ))}
                </select>
              </div>
              <div>
      <label className="text-[14px] font-bold text-gray-400 mb-1">Quantity</label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
        className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={addToBasket}
            className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
                >
                  + Add to Basket
                </button>
              </div>
            </div>

            {/* Basket Table */}
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
  <table className="w-full text-sm">
    <thead className="bg-[#010197] text-white uppercase tracking-wide">
      <tr>
        <th className="p-3 text-left">Item</th>
        <th className="p-3 text-right">Qty</th>
        <th className="p-3 text-center">Action</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100">
      {currentBasket.length === 0 ? (
        <tr>
          <td colSpan="3" className="text-center py-10 text-gray-400 italic">
            Basket is empty
          </td>
        </tr>
      ) : (
        currentBasket.map((item, i) => (
          <tr key={i} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
            <td className="p-4">
              <p className="font-semibold text-blue-700">{item.code}</p>
              <p className="text-xs text-gray-500">{item.description}</p>
            </td>
            <td className="p-4 text-right font-bold">{item.qty} {item.uom}</td>
            <td className="p-4 text-center">
              <button
                onClick={() => setCurrentBasket(currentBasket.filter((_, idx) => idx !== i))}
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


            {/* Save Section */}
            {currentBasket.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg flex flex-col md:flex-row gap-4 items-end">
                <div className="flex-1 w-full">
                  <label className="block text-xs font-bold text-blue-700 mb-1">Project Name / Borrower</label>
                  <input
                    type="text"
                    value={borrowerName}
                    onChange={(e) => setBorrowerName(e.target.value)}
                    placeholder="e.g. Project Alpha / John Doe"
                    className="w-full border-blue-200 border rounded-md px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <button
                  onClick={saveMovement}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-sm hover:bg-blue-700 shadow-md"
                >
                  Confirm Movement
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Active Project List */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow min-h-100">
            

            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
Active Project Records            
</h5>
            <div className="space-y-3 overflow-y-auto max-h-150">
              {Object.keys(savedMovements).length === 0 ? (
                <p className="text-center text-gray-400 py-20 text-sm">No active movements</p>
              ) : (
                Object.keys(savedMovements).map((id) => (
                  <div key={id} className="border rounded-lg p-3 hover:border-blue-300 transition bg-white shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-blue-600">{id}</p>
                        <p className="font-bold text-gray-800 uppercase text-sm">{savedMovements[id].borrower}</p>
                      </div>
                      <button
                        onClick={() => returnMovement(id)}
                        className="text-green-600 hover:bg-green-50 p-1.5 rounded-md border border-green-200"
                        title="Return Items"
                      >
                        <ArrowLeft size={16} />
                      </button>
                    </div>
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                      <ul className="list-disc list-inside">
                        {savedMovements[id].items.map((it, idx) => (
                          <li key={idx}>{it.qty} {it.uom} - {it.code}</li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">{savedMovements[id].timestamp}</p>
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

export default SuppliesMovements;