import React, { useState, useEffect } from "react";
import { Plus, Trash2, FolderOpen, ArrowLeft, Package, User } from "lucide-react";
import PageHeader from "./PageHeader";

const SuppliesMovements = () => {
  // --- Master Data (Demo) ---
  const masterSupplies = [
    { code: "SUP-001", itemDescription: "Stretch Film", category: "Consumables", segment: "Warehouse", dimension: "500mm", uom: "Roll", currentStock: 120 },
    { code: "SUP-002", itemDescription: "Safety Helmet", category: "PPE", segment: "Safety", dimension: "Standard", uom: "Pcs", currentStock: 45 },
    { code: "SUP-003", itemDescription: "Electrical Tape", category: "Consumables", segment: "Warehouse", dimension: "25mm", uom: "Roll", currentStock: 200 },
  ];

  // Dropdown options (reused pattern)
  const CATEGORY_OPTIONS = ["Rack", "Consumables", "PPE", "Tools", "Equipment", "Office"];
  const SEGMENT_OPTIONS = {
    Rack: ["Heavy Duty", "Medium Duty"],
    Consumables: ["Office", "Warehouse"],
    PPE: ["Safety"],
    Tools: ["Electrical"],
    Equipment: ["Warehouse", "Production"],
    Office: ["Admin"],
  };

  // --- States ---
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [borrowerName, setBorrowerName] = useState(""); // Project or Person Name
  const [currentBasket, setCurrentBasket] = useState([]); // Temporary list before saving
  const [savedMovements, setSavedMovements] = useState({}); // Final saved records

  // Typeahead & search
  const [productQuery, setProductQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Package naming / preview (default RESERVED-PACKAGE-XXXX)
  const [packageName, setPackageName] = useState(`RESERVED-PACKAGE-${String(Date.now()).slice(-6)}`);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

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
    setProductQuery("");
    setShowSuggestions(false);
    setQty("");
  };

  // Save the whole basket as a "Project Movement" (opens preview)
  const saveMovement = () => {
    if (!borrowerName) return alert("Please enter Project/Borrower Name!");
    if (currentBasket.length === 0) return alert("Basket is empty!");
    setShowPreviewModal(true);
  };

  const confirmSaveMovement = (nameOverride) => {
    const id = nameOverride || packageName || `${borrowerName.toUpperCase()}-${Date.now().toString().slice(-4)}`;
    const updatedMovements = {
      ...savedMovements,
      [id]: {
        borrower: borrowerName,
        items: [...currentBasket],
        packageName: id,
        timestamp: new Date().toLocaleString(),
      },
    };

    setSavedMovements(updatedMovements);
    localStorage.setItem("supplies-movements", JSON.stringify(updatedMovements));

    // Reset
    setCurrentBasket([]);
    setBorrowerName("");
    setProductQuery("");
    setSelectedProduct("");
    setQty("");
    setShowPreviewModal(false);
    alert("Outbound Movement Recorded!");
  };

  const generateDefaultPackageName = () => `RESERVED-PACKAGE-${String(Date.now()).slice(-6)}`;
  const newPackage = () => {
    setPackageName(generateDefaultPackageName());
    setCurrentBasket([]);
    setBorrowerName("");
    setProductQuery("");
    setSelectedProduct("");
    setQty("");
    setShowSuggestions(false);
  };

  const setPackageFromBorrower = () => {
    if (!borrowerName) return alert('Enter Project/Borrower Name first');
    setPackageName(`${borrowerName.replace(/\s+/g, '-').toUpperCase()}-${String(Date.now()).slice(-6)}`);
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
      <PageHeader pageName="Supplies Movements" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Side: Create Movement */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">


            <div className="flex items-center justify-between border-b border-gray-200 pb-1 mb-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Package Name</p>
                <input value={packageName} onChange={(e) => setPackageName(e.target.value)} className="border border-gray-300 rounded-md px-3 py-1 text-sm w-72 focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2 items-center">
                <button onClick={newPackage} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">New Package</button>
                <button onClick={setPackageFromBorrower} className="px-3 py-1 bg-gray-100 rounded text-sm hover:bg-gray-200">From Borrower</button>
              </div>
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <label className="text-[14px] font-bold text-gray-400 mb-1">Supply</label>
                <input
                  value={productQuery}
                  onChange={(e) => { setProductQuery(e.target.value); setShowSuggestions(true); setHighlightedIndex(-1); }}
                  onKeyDown={(e) => {
                    const matches = masterSupplies.filter((p) => (p.code + ' ' + p.itemDescription).toLowerCase().includes(productQuery.toLowerCase()));
                    if (e.key === 'ArrowDown') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.min(prev + 1, Math.max(0, matches.length - 1)));
                    } else if (e.key === 'ArrowUp') {
                      e.preventDefault();
                      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
                    } else if (e.key === 'Enter') {
                      if (showSuggestions && highlightedIndex >= 0 && matches[highlightedIndex]) {
                        const sel = matches[highlightedIndex];
                        setSelectedProduct(sel.code);
                        setProductQuery(`${sel.code} - ${sel.itemDescription}`);
                        setShowSuggestions(false);
                        setQty('');
                      }
                    } else if (e.key === 'Escape') {
                      setShowSuggestions(false);
                    }
                  }}
                  placeholder="Type to search supplies..."
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500 w-full"
                />

                {showSuggestions && productQuery && (
                  <div className="absolute z-20 left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow max-h-48 overflow-y-auto">
                    {masterSupplies.filter((p) => (p.code + ' ' + p.itemDescription).toLowerCase().includes(productQuery.toLowerCase())).map((p, idx) => (
                      <div
                        key={p.code}
                        onMouseDown={() => { setSelectedProduct(p.code); setProductQuery(`${p.code} - ${p.itemDescription}`); setShowSuggestions(false); setQty(''); }}
                        className={`px-3 py-2 cursor-pointer ${idx === highlightedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                      >
                        <div className="text-sm font-semibold">{p.code} - {p.itemDescription}</div>
                        <div className="text-xs text-gray-500">{p.uom} • {p.category}</div>
                      </div>
                    ))}
                  </div>
                )}
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
                        <p className="text-xs font-bold text-blue-600">{savedMovements[id].packageName || id}</p>
                        <p className="font-bold text-gray-800 uppercase text-sm">{savedMovements[id].borrower}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => { setPackageName(savedMovements[id].packageName || id); setBorrowerName(savedMovements[id].borrower); setCurrentBasket([...savedMovements[id].items]); setShowPreviewModal(true); }}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md border border-blue-200"
                          title="Preview"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          onClick={() => returnMovement(id)}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-md border border-green-200"
                          title="Return Items"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      </div>
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

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowPreviewModal(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">Preview Movement</h4>
              <button onClick={() => setShowPreviewModal(false)} className="text-gray-600 hover:text-gray-800"><Trash2 size={20} /></button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600">Package: <span className="font-semibold">{packageName}</span></p>
              <p className="text-sm text-gray-600">Borrower: <span className="font-semibold">{borrowerName}</span></p>
              <p className="text-sm text-gray-600">Items: <span className="font-semibold">{currentBasket.length}</span></p>
            </div>

            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm max-h-72 overflow-y-auto mb-4">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 text-sm text-gray-600">
                  <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {currentBasket.map((it, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-2 font-semibold">{it.code}</td>
                      <td className="p-2 text-sm text-gray-700">{it.description}</td>
                      <td className="p-2 text-right font-bold">{it.qty} {it.uom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-4">
              <button onClick={() => { confirmSaveMovement(packageName || generateDefaultPackageName()); }} className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]">Confirm Movement</button>
              <button onClick={() => setShowPreviewModal(false)} className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500">Cancel</button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default SuppliesMovements;