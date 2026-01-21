import React, { useState, useEffect } from "react";
import { Trash2, FolderOpen, ArrowLeft, X } from "lucide-react";
import PageHeader from "./PageHeader";
import { useSuppliesStore } from "../stores/useSuppliesStore";
import { useBorrowStore } from "../stores/useSuppliesBorrowStore";

const SuppliesMovements = () => {
  // ====================== ZUSTAND STORES ======================
  const {
    supplies,
    fetchSupplies,
    loading: suppliesLoading,
  } = useSuppliesStore();
  const {
    borrowSupplies,
    returnSupplies,
    fetchBorrowRecords,
    fetchReturnedBorrowRecords,
    borrowRecords,
    returnedRecords,
    loading: borrowLoading,
  } = useBorrowStore();

  // ====================== STATES ======================
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");
  const [borrowerName, setBorrowerName] = useState("");
  const [remarks, setRemarks] = useState(""); // ✅ Optional remarks
  const [currentBasket, setCurrentBasket] = useState([]);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [isPreviewOnly, setIsPreviewOnly] = useState(false); // ✅ Whether the modal is readonly
  const [showReturnedItems, setShowReturnedItems] = useState(false);

  // ====================== EFFECTS ======================
  useEffect(() => {
    fetchSupplies();
    fetchBorrowRecords();
    fetchReturnedBorrowRecords();
  }, []);

  // ====================== FUNCTIONS ======================
  const addToBasket = () => {
    if (!selectedProduct) return alert("Select a supply item!");
    if (!qty || Number(qty) <= 0) return alert("Enter valid quantity!");

    const supply = supplies.find((s) => s._id === selectedProduct);
    if (!supply) return alert("Supply not found");
    if (Number(qty) > supply.quantity) return alert("Insufficient stock!");

    const existingIdx = currentBasket.findIndex(
      (i) => i.code === supply.itemCode
    );
    if (existingIdx > -1) {
      const updated = [...currentBasket];
      updated[existingIdx].qty = Number(updated[existingIdx].qty) + Number(qty);
      setCurrentBasket(updated);
    } else {
      setCurrentBasket([
        ...currentBasket,
        {
          code: supply.itemCode, // ✅ use itemCode instead of _id
          _id: supply._id, // optional, keep _id for display or updates
          description: supply.itemDescription,
          qty: Number(qty),
          uom: supply.uom,
        },
      ]);
    }

    setSelectedProduct("");
    setQty("");
  };

  // ====================== CONFIRM SAVE MOVEMENT ======================
  const confirmSaveMovement = async () => {
    const payload = {
      borrower: borrowerName,
      packageName: borrowerName,
      remarks,
      items: currentBasket.map((i) => ({
        itemCode: i.code, // ✅ send itemCode instead of supplyId
        itemDescription: i.description,
        qty: i.qty,
        uom: i.uom,
      })),
    };

    const success = await borrowSupplies(payload);
    if (success) {
      setCurrentBasket([]);
      setBorrowerName("");
      setRemarks("");
      setSelectedProduct("");
      setShowPreviewModal(false);
      alert("Borrow recorded successfully!");
    }
  };

  const handleReturnMovement = async (recordId) => {
    if (!window.confirm("Return these items to inventory?")) return;
    const success = await returnSupplies(recordId);
    if (success) alert("Items returned successfully!");
  };

  const saveMovement = () => {
    if (!borrowerName) return alert("Please enter Borrower/Project Name!");
    if (currentBasket.length === 0) return alert("Basket is empty!");
    setIsPreviewOnly(false); // make modal editable
    setShowPreviewModal(true);
  };

  // ====================== RENDER ======================
  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <PageHeader pageName="Supplies Movements" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Create Movement */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            {/* Borrower / Package */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">
                Borrower / Project Name
              </label>
              <input
                value={borrowerName}
                onChange={(e) => setBorrowerName(e.target.value)}
                placeholder="e.g. Project Alpha / John Doe"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Optional Remarks */}
            <div className="mb-4">
              <label className="text-sm text-gray-600 mb-1 block">
                Remarks (Optional)
              </label>
              <input
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="e.g. Urgent request, handle with care"
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                  Supply
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Supply</option>
                  {supplies.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.itemCode} - {s.itemDescription} ({s.quantity} {s.uom})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                  Quantity
                </label>
                <input
                  type="number"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                  placeholder="0"
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
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

            {/* Returned Items Button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowReturnedItems(!showReturnedItems)}
                className="bg-green-600 text-white px-4 py-2 rounded-md font-bold text-sm hover:bg-green-700 shadow-md"
              >
                {showReturnedItems ? "Hide Returned Items" : "Show Returned Items"}
              </button>
            </div>

            {/* Returned Items Table */}
            {showReturnedItems && (
              <div className="mt-4 overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-green-600 text-white uppercase tracking-wide">
                    <tr>
                      <th className="p-3 text-left">Borrower Name</th>
                      <th className="p-3 text-left">Code</th>
                      <th className="p-3 text-left">Item Description</th>
                      <th className="p-3 text-right">Qty</th>
                      <th className="p-3 text-right">UOM</th>
                      <th className="p-3 text-right">Remarks</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {returnedRecords.length === 0 ? (
                      <tr>
                        <td
                          colSpan="4"
                          className="text-center py-10 text-gray-400 italic"
                        >
                          No returned items
                        </td>
                      </tr>
                    ) : (
                      returnedRecords.flatMap((record) =>
                        record.items.map((item, idx) => (
                          <tr
                            key={`${record._id}-${idx}`}
                            className="odd:bg-white even:bg-gray-50 hover:bg-green-50 transition"
                          >
                            <td className="p-4 font-bold text-gray-800">
                              {record.borrower}
                            </td>
                            <td className="p-4 font-semibold text-blue-700">
                              {item.itemCode}
                            </td>
                            <td className="p-4">
                              {item.itemDescription}
                            </td>
                            <td className="p-4 text-right font-bold">
                              {item.qty}
                            </td>
                            <td className="p-4 text-right font-bold">
                              {item.uom}
                            </td>
                            <td className="p-4 text-right font-bold">
                              {item.remarks || "N/A"}
                            </td>
                            <td className="p-4 text-center">
                              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                                Returned
                              </span>
                            </td>
                          </tr>
                        ))
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}

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
                      <td
                        colSpan="3"
                        className="text-center py-10 text-gray-400 italic"
                      >
                        Basket is empty
                      </td>
                    </tr>
                  ) : (
                    currentBasket.map((item, i) => (
                      <tr
                        key={i}
                        className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                      >
                        <td className="p-4">
                          <p className="font-semibold text-blue-700">
                            {item.code}
                          </p>
                          <p className="text-xs text-gray-500">
                            {item.description}
                          </p>
                        </td>
                        <td className="p-4 text-right font-bold">
                          {item.qty} {item.uom}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() =>
                              setCurrentBasket(
                                currentBasket.filter((_, idx) => idx !== i)
                              )
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

            {/* Save Section */}
            {currentBasket.length > 0 && (
              <div className="mt-6 flex justify-end">
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

        {/* Right Side: Active Borrow Records */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow min-h-100">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Active Borrow Records
            </h5>
            <div className="space-y-3 overflow-y-auto max-h-150">
              {borrowRecords.length === 0 ? (
                <p className="text-center text-gray-400 py-20 text-sm">
                  No active borrow records
                </p>
              ) : (
                borrowRecords.map((record) => (
                  <div
                    key={record._id}
                    className="border rounded-lg p-3 hover:border-blue-300 transition bg-white shadow-sm"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-xs font-bold text-blue-600">
                          {record.packageName || record._id}
                        </p>
                        <p className="font-bold text-gray-800 uppercase text-sm">
                          {record.borrower}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setBorrowerName(record.borrower);
                            setCurrentBasket(
                              record.items.map((i) => ({
                                code: i.itemCode,
                                description: i.itemDescription,
                                qty: i.qty,
                                uom: i.uom,
                              }))
                            );
                            setRemarks(record.remarks || "");
                            setIsPreviewOnly(true); // ✅ readonly modal
                            setShowPreviewModal(true);
                          }}
                          className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md border border-blue-200"
                          title="Preview"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          onClick={() => handleReturnMovement(record._id)}
                          className="text-green-600 hover:bg-green-50 p-1.5 rounded-md border border-green-200"
                          title="Return Items"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      </div>
                    </div>
                    <div className="text-[11px] text-gray-500 bg-gray-50 p-2 rounded">
                      <ul className="list-disc list-inside">
                        {record.items.map((it, idx) => (
                          <li key={idx}>
                            <span className="font-semibold text-blue-700">
                              {it.itemCode}
                            </span>
                            {" — "}
                            {it.qty} {it.uom} - {it.itemDescription}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 italic">
                      {new Date(record.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      {showPreviewModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowPreviewModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-bold text-gray-800">
                Preview Movement
              </h4>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                <X size={20} /> {/* ✅ X instead of Trash */}
              </button>
            </div>

            <div className="mb-3">
              <p className="text-sm text-gray-600">
                Borrower: <span className="font-semibold">{borrowerName}</span>
              </p>
              <p className="text-sm text-gray-600">
                Remarks:{" "}
                <span className="font-semibold">{remarks || "N/A"}</span>
              </p>
              <p className="text-sm text-gray-600">
                Items:{" "}
                <span className="font-semibold">{currentBasket.length}</span>
              </p>
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
                      <td className="p-2 font-semibold">{idx + 1}</td>
                      <td className="p-2 text-sm text-gray-700">
                        {it.description}
                      </td>
                      <td className="p-2 text-right font-bold">
                        {it.qty} {it.uom}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Only show buttons if not preview-only */}
            {!isPreviewOnly && (
              <div className="flex gap-4">
                <button
                  onClick={confirmSaveMovement}
                  className="flex-1 bg-[#010197] text-white py-2 rounded-md font-semibold hover:bg-[#000080]"
                >
                  Confirm Movement
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="flex-1 bg-gray-400 text-white py-2 rounded-md font-semibold hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
};

export default SuppliesMovements;
