import React, { useState, useEffect } from "react";
import { Plus, Trash2, PackageCheck } from "lucide-react";
import { useProductsStore } from "../stores/useProductsStore";
import { useInboundStore } from "../stores/useInboundStore";

const InboundRecord = () => {
  // ================= STATES =================
  const [containerNumber, setContainerNumber] = useState(""); // NEW
  const [poNumber, setPoNumber] = useState("");
  const [supplier, setSupplier] = useState("");
  const [date, setDate] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQty, setProductQty] = useState("");
  const [items, setItems] = useState([]);

  // ================= PRODUCT STORE =================
  const { products, getProductDropDown, loading: productsLoading } =
    useProductsStore();

  // ================= INBOUND STORE =================
  const {
    pendingPackingLists,
    createInboundRecord,
    fetchPendingPackingLists,
    loading: inboundLoading,
  } = useInboundStore();

  // ================= LOAD PRODUCTS =================
  useEffect(() => {
    getProductDropDown();
  }, [getProductDropDown]);

  // ================= LOAD PENDING PACKING LISTS =================
  useEffect(() => {
    fetchPendingPackingLists();
  }, [fetchPendingPackingLists]);

  // ================= ADD ITEM =================
  const handleAddItem = () => {
    if (!selectedProduct || !productQty || Number(productQty) <= 0) return;

    const product = products.find((p) => p.itemCode === selectedProduct);
    if (!product) return;

    const existingIndex = items.findIndex((i) => i.itemCode === selectedProduct);

    if (existingIndex !== -1) {
      const updated = [...items];
      updated[existingIndex].qty += Number(productQty);
      setItems(updated);
    } else {
      setItems([
        ...items,
        {
          itemCode: product.itemCode,
          itemDescription: product.itemDescription,
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
  const saveInbound = async () => {
    if (!containerNumber || !poNumber || !items.length) {
      alert("Container Number, PO details, or item list is incomplete.");
      return;
    }

    const payload = {
      containerNumber, // NEW
      poNumber,
      supplier,
      deliveryDate: date,
      preparedBy,
      items,
    };

    const res = await createInboundRecord(payload);

    if (res.success) {
      alert("Packing List Saved!");
      setContainerNumber(""); // reset
      setPoNumber("");
      setSupplier("");
      setDate("");
      setPreparedBy("");
      setItems([]);
    } else {
      alert(res.message || "Failed to save packing list.");
    }
  };

  // ================= UI =================
  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <PackageCheck size={20} /> RACKSMART – Inbound Record
        </h1>
        <p className="text-gray-500 text-sm">
          Create and document inbound purchase orders from suppliers.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h5 className="text-gray-700 font-bold border-b pb-1">
              Purchase Order & Inbound Items
            </h5>

            {/* PO DETAILS */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <Input
                label="Container Number"
                value={containerNumber}
                setValue={setContainerNumber}
              />
              <Input label="PO Number" value={poNumber} setValue={setPoNumber} />
              <Input label="Supplier" value={supplier} setValue={setSupplier} />
              <Input
                label="Delivery Date"
                value={date}
                setValue={setDate}
                type="date"
              />
              <Input label="Prepared By" value={preparedBy} setValue={setPreparedBy} />
            </div>

            {/* PRODUCT */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-[14px] font-bold text-gray-400 mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="border rounded-md px-3 py-1.5 text-sm"
                >
                  <option value="">
                    {productsLoading ? "Loading products..." : "Select Product"}
                  </option>
                  {products.map((p) => (
                    <option key={p.itemCode} value={p.itemCode}>
                      {p.itemCode} – {p.itemDescription}
                    </option>
                  ))}
                </select>
              </div>

              <Input
                label="Quantity"
                value={productQty}
                setValue={setProductQty}
                type="number"
              />

              <div className="md:col-span-2">
                <button
                  onClick={handleAddItem}
                  disabled={productsLoading}
                  className="flex items-center gap-2 bg-[#1800ad] disabled:opacity-50 text-white px-6 py-2 rounded-md font-bold text-sm"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>
            </div>
          </div>

          {/* ITEMS TABLE */}
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h5 className="text-gray-700 font-bold border-b pb-1 mb-4">
              Temporary Item Lists
            </h5>

            <table className="w-full text-sm">
              <thead className="bg-[#010197] text-white">
                <tr>
                  <th className="p-3 text-left">Code</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Dimension</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-10 text-center text-gray-400">
                      No items added
                    </td>
                  </tr>
                ) : (
                  items.map((i, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 font-semibold text-blue-700">{i.itemCode}</td>
                      <td className="p-3">{i.itemDescription}</td>
                      <td className="p-3">{i.dimension}</td>
                      <td className="p-3 text-center font-bold">
                        {i.qty} {i.uom}
                      </td>
                      <td className="p-3 text-center">
                        <button onClick={() => removeItem(idx)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {items.length > 0 && (
              <div className="flex justify-end mt-6">
                <button
                  onClick={saveInbound}
                  disabled={inboundLoading}
                  className="bg-[#1800ad] text-white px-6 py-2 rounded-md font-bold disabled:opacity-50"
                >
                  Save Packing List
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b pb-1 mb-4">
            Pending Packing List
          </h5>

          {pendingPackingLists.length === 0 ? (
            <p className="text-center text-gray-400 py-20 text-sm">No saved records</p>
          ) : (
            pendingPackingLists.map((rec) => (
              <div key={rec.containerNumber} className="border rounded-lg p-3 mb-3 bg-gray-50">
                <p className="text-xs font-bold text-blue-600">{rec.containerNumber}</p>
                <p className="font-bold">{rec.poNumber}</p>
                <ul className="text-xs list-disc list-inside mt-2">
                  {rec.items.map((it, i) => (
                    <li key={i}>
                      {it.qty} {it.uom} – {it.itemCode}
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

// ================= REUSABLE INPUT =================
const Input = ({ label, value, setValue, type = "text" }) => (
  <div className="flex flex-col">
    <label className="text-[14px] font-bold text-gray-400 mb-1">{label}</label>
    <input
      type={type}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="border rounded-md px-3 py-1.5 text-sm"
    />
  </div>
);

export default InboundRecord;
