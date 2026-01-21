import React, { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useOutboundStore } from "../stores/useOutboundStore";
import { useProductsStore } from "../stores/useProductsStore";

const OutboundRecord = () => {
  // ================= ZUSTAND STORES =================
  const {
    pendingOutboundPackingLists,
    fetchPendingOutboundPackingLists,
    createOutboundRecord,
    confirmOutbound,
    loading,
  } = useOutboundStore();

  const {
    products,
    getProductDropDown,
    loading: productsLoading,
  } = useProductsStore();

  // ================= STATES =================
  const [packingNumber, setPackingNumber] = useState("");
  const [consignee, setConsignee] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [date, setDate] = useState("");
  const [dispatchDate, setDispatchDate] = useState("");
  const [referenceDocs, setReferenceDocs] = useState("");
  const [purchaseOrderNo, setPurchaseOrderNo] = useState("");
  const [deliveryReceipt, setDeliveryReceipt] = useState("");
  const [serviceInvoice, setServiceInvoice] = useState("");
  const [remarks, setRemarks] = useState("");
  const [preparedBy, setPreparedBy] = useState("");

  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQty, setProductQty] = useState("");
  const [items, setItems] = useState([]);

  // ================= LOAD DATA =================
  useEffect(() => {
    fetchPendingOutboundPackingLists();
    getProductDropDown();
  }, []);
  // ================= ADD ITEM =================
  const handleAddItem = () => {
    if (!selectedProduct || !productQty || Number(productQty) <= 0) return;

    // Find product from products store
    const product = products.find((p) => p.itemCode === selectedProduct);
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

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const handleSaveOutbound = async () => {
    if (!packingNumber || !consignee || items.length === 0) {
      alert("Packing details or item list is incomplete.");
      return;
    }

    const payload = {
      packingNumber,
      consignee,
      address,
      contactPerson,
      date,
      dispatchDate,
      referenceDocs,
      purchaseOrderNo,
      deliveryReceipt,
      serviceInvoice,
      remarks,
      preparedBy,
      items,
    };

    const res = await createOutboundRecord(payload);
    if (res.success) {
      alert("Outbound record saved successfully!");
      setPackingNumber("");
      setConsignee("");
      setAddress("");
      setContactPerson("");
      setDate("");
      setDispatchDate("");
      setReferenceDocs("");
      setPurchaseOrderNo("");
      setDeliveryReceipt("");
      setServiceInvoice("");
      setRemarks("");
      setPreparedBy("");
      setItems([]);
    } else {
      alert(res.message);
    }
  };

  const handleConfirm = async (record) => {
    const confirmItems = record.items.map((i) => ({ ...i, actualQty: i.qty }));
    const res = await confirmOutbound({
      packingNumber: record.packingNumber,
      items: confirmItems,
    });
    if (res.success) {
      alert("Outbound record confirmed!");
    } else {
      alert(res.message);
    }
  };

  const handleSelectPendingPL = (record) => {
  setPackingNumber(record.packingNumber);
  setConsignee(record.consignee);
  setAddress(record.address || "");
  setContactPerson(record.contactPerson || "");
  setDate(record.date ? new Date(record.date).toISOString().split("T")[0] : "");
  setDispatchDate(record.dispatchDate ? new Date(record.dispatchDate).toISOString().split("T")[0] : "");
  setReferenceDocs(record.referenceDocs || "");
  setPurchaseOrderNo(record.purchaseOrderNo || "");
  setDeliveryReceipt(record.deliveryReceipt || "");
  setServiceInvoice(record.serviceInvoice || "");
  setRemarks(record.remarks || "");
  setPreparedBy(record.preparedBy || "");
  setItems(record.items.map(i => ({ ...i })));
};


  // ================= UI =================
  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          RACKSMART – Outbound Record
        </h1>
        <p className="text-gray-500 text-sm">
          Create and document outbound packing lists for dispatch.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-6">
          {/* FORM */}
          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Packing List & Outbound Items
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {[
                {
                  label: "Packing Number",
                  value: packingNumber,
                  setter: setPackingNumber,
                },
                { label: "Consignee", value: consignee, setter: setConsignee },
                { label: "Address", value: address, setter: setAddress },
                {
                  label: "Contact Person",
                  value: contactPerson,
                  setter: setContactPerson,
                },
                {
                  label: "Dispatch Date",
                  value: date,
                  setter: setDate,
                  type: "date",
                },
                {
                  label: "Delivery Date",
                  value: dispatchDate,
                  setter: setDispatchDate,
                  type: "date",
                },
                {
                  label: "Prepared By",
                  value: preparedBy,
                  setter: setPreparedBy,
                },
                {
                  label: "Reference Docs",
                  value: referenceDocs,
                  setter: setReferenceDocs,
                },
                {
                  label: "Purchase Order No.",
                  value: purchaseOrderNo,
                  setter: setPurchaseOrderNo,
                },
                {
                  label: "Delivery Receipt",
                  value: deliveryReceipt,
                  setter: setDeliveryReceipt,
                },
                {
                  label: "Service Invoice",
                  value: serviceInvoice,
                  setter: setServiceInvoice,
                },
              ].map((f, idx) => (
                <div key={idx} className="flex flex-col">
                  <label className="text-[14px] font-bold text-gray-400 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type || "text"}
                    value={f.value}
                    onChange={(e) => f.setter(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}

              <div className="md:col-span-3">
                <label className="text-[14px] font-bold text-gray-400 mb-1">
                  Remarks
                </label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
              </div>
            </div>

            {/* ADD ITEM */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div className="flex flex-col">
                <label className="text-[14px] font-bold text-gray-400 mb-1">
                  Product
                </label>
                <select
                  value={selectedProduct}
                  onChange={(e) => setSelectedProduct(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {productsLoading ? (
                    <option disabled>Loading...</option>
                  ) : (
                    products.map((p) => (
                      <option key={p._id} value={p.itemCode}>
                        {p.itemCode} – {p.itemDescription}
                      </option>
                    ))
                  )}
                </select>
              </div>

              <div className="flex flex-col">
                <label className="text-[14px] font-bold text-gray-400 mb-1">
                  Quantity
                </label>
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

          {/* ITEMS TABLE */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Temporary Outbound Item List
            </h5>
            <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-[#010197] text-white uppercase tracking-wide">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Item Description</th>
                    <th className="p-3 text-left">Dimension</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        className="text-center py-10 text-gray-400 italic"
                      >
                        No items added
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
                        <td className="p-4 text-center font-bold">
                          {i.qty} {i.uom}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => removeItem(idx)}
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
            {/* SAVE BUTTON */}
            {items.length > 0 && (
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleSaveOutbound}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
                >
                  Save Packing List
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <h5 className="text-gray-700 font-bold border-b pb-1 mb-4">
              Pending Packing Lists
            </h5>

            {loading ? (
              <p className="text-center text-gray-400 py-10">Loading...</p>
            ) : pendingOutboundPackingLists.length === 0 ? (
              <p className="text-center text-gray-400 py-20 text-sm">
                No pending packing lists
              </p>
            ) : (
              pendingOutboundPackingLists.map((record) =>   {
                return (
                  <div
                    key={record._id}
                    className="border rounded-lg p-4 mb-3 transition"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-bold text-blue-600">
                        {record.packingNumber}
                      </p>
                      <p className="text-sm font-semibold">{record.consignee}</p>
                    </div>
                    <div className="text-xs text-gray-500 mb-2">
                      {record.date && <p>Dispatch: {new Date(record.date).toLocaleDateString()}</p>}
                      {record.dispatchDate && <p>Delivery: {new Date(record.dispatchDate).toLocaleDateString()}</p>}
                      <p>Created: {new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                    <ul className="text-xs list-disc list-inside mb-3">
                      {record.items.map((item, i) => (
                        <li key={i}>
                          {item.qty} {item.uom} – {item.itemCode}
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default OutboundRecord;
