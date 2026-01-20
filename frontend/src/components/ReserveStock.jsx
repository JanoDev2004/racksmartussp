import React, { useState, useEffect } from "react";
import { Plus, ArrowLeft, FolderOpen } from "lucide-react";
import PageHeader from "./PageHeader";
import { useReserveStore } from "../stores/useReserveStore";

const ReserveStock = () => {
  const {
    products,
    reservedPackages,
    releasedPackages,
    fetchProducts,
    fetchReservedPackages,
    fetchReleasedPackages,
    reserveStock,
    releaseReserveStock,
    loading,
  } = useReserveStore();

  // Current reserved package
  const [packageName, setPackageName] = useState("RESERVED-PACKAGE-0001");
  const [reservedBy, setReservedBy] = useState("");
  const [reservedItems, setReservedItems] = useState([]);

  // Add product state
  const [selectedProduct, setSelectedProduct] = useState("");
  const [qty, setQty] = useState("");

  // Modal for viewing reserved details
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);

  // Effects
  useEffect(() => {
    fetchProducts();
    fetchReservedPackages();
    fetchReleasedPackages();
  }, []);

  // Add item to current reserved package
  const addItem = () => {
    if (!selectedProduct) return alert("Select a product!");
    if (!qty || Number(qty) <= 0) return alert("Enter valid quantity!");

    const product = products.find((p) => p.itemCode === selectedProduct);
    if (!product) return alert("Product not found!");

    const availableQty = product.quantity;
    if (Number(qty) > availableQty) {
      return alert(`Insufficient stock. Available: ${availableQty} ${product.uom}`);
    }

    const existingIdx = reservedItems.findIndex((i) => i.itemCode === selectedProduct);
    let updated;
    if (existingIdx > -1) {
      updated = reservedItems.map((it, i) =>
        i === existingIdx ? { ...it, qty: Number(it.qty) + Number(qty) } : it
      );
    } else {
      updated = [
        ...reservedItems,
        {
          itemCode: product.itemCode,
          itemDescription: product.itemDescription,
          qty: Number(qty),
          uom: product.uom,
        },
      ];
    }

    setReservedItems(updated);
    setSelectedProduct("");
    setQty("");
  };

  // Reserve current package
  const handleReserveStock = async () => {
    if (reservedItems.length === 0) return alert("Add at least one item!");
    if (!reservedBy.trim()) return alert("Enter who this is reserved for!");

    const payload = {
      packageName,
      reservedBy: reservedBy.trim(),
      items: reservedItems,
    };

    const success = await reserveStock(payload);
    if (success) {
      setReservedItems([]);
      setReservedBy("");
      setPackageName(`RESERVED-PACKAGE-${Date.now()}`);
      alert("Stock reserved successfully!");
    }
  };

  // Release reserved package
  const handleReleaseReserve = async (reserveId) => {
    if (!window.confirm("Release this reserved package? Stock will be available again.")) return;
    const success = await releaseReserveStock(reserveId);
    if (success) alert("Reserved stock released successfully!");
  };

  // View reserved details
  const viewReservedDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  // View released details
  const viewReleasedDetails = (pkg) => {
    setSelectedPackage(pkg);
    setShowDetailsModal(true);
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER CONTAINER ================= */}
      <PageHeader pageName="Reserve Stock" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel: Current Reserved Package */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Current Reserved Package: <span className="text-blue-600">{packageName}</span>
          </h5>

          {/* Package Name and Reserved By */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Package Name
              </label>
              <input
                type="text"
                value={packageName}
                onChange={(e) => setPackageName(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Enter package name"
              />
            </div>
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1 block">
                Reserved For
              </label>
              <input
                type="text"
                value={reservedBy}
                onChange={(e) => setReservedBy(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
                placeholder="Enter name"
              />
            </div>
          </div>

          {/* Add Product */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-[14px] font-bold text-gray-400 mb-1">Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Select Product --</option>
                {products.map((p) => (
                  <option key={p.itemCode} value={p.itemCode}>
                    {p.itemCode} - {p.itemDescription} ({p.quantity} {p.uom} available)
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
                className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full focus:ring-2 focus:ring-blue-500"
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
          <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm mb-6">
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
                      <td className="p-4 font-semibold text-blue-700">{item.itemCode}</td>
                      <td className="p-4">{item.itemDescription}</td>
                      <td className="p-4 text-right font-bold">{item.qty} {item.uom}</td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() =>
                            setReservedItems(reservedItems.filter((_, idx) => idx !== i))
                          }
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          <ArrowLeft size={16} />
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
              onClick={handleReserveStock}
              disabled={loading}
              className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#00ce5d] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95 disabled:opacity-50"
            >
              {loading ? "Reserving..." : "Reserve Package"}
            </button>
          </div>
        </div>

        {/* Right Panel: Reserved Packages */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Reserved Packages
            </h5>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {reservedPackages.length === 0 ? (
                <p className="text-gray-500 text-center py-8 text-sm">No reserved packages</p>
              ) : (
                reservedPackages.map((pkg) => (
                  <div
                    key={pkg._id}
                    className="p-3 rounded border cursor-pointer transition border-gray-300 hover:bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-sm">{pkg.packageName}</p>
                        <p className="text-xs text-gray-500">
                          {pkg.items.length} items • {pkg.reservedBy}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(pkg.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => viewReservedDetails(pkg)}
                          className="text-blue-600 hover:text-blue-800"
                          title="View Details"
                        >
                          <FolderOpen size={16} />
                        </button>
                        <button
                          onClick={() => handleReleaseReserve(pkg._id)}
                          className="text-red-600 hover:text-red-800"
                          title="Release Reserve"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          </div>

          {/* Released Packages Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
              Released/Canceled Packages
            </h5>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Package Name</th>
                    <th className="p-2 text-left">Reserved By</th>
                    <th className="p-2 text-left">Items</th>
                    <th className="p-2 text-left">Total Qty</th>
                    <th className="p-2 text-left">Released Date</th>
                    <th className="p-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {releasedPackages.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">
                        No released packages
                      </td>
                    </tr>
                  ) : (
                    releasedPackages.map((pkg) => (
                      <tr key={pkg._id} className="border-t hover:bg-gray-50">
                        <td className="p-2 font-semibold">{pkg.packageName}</td>
                        <td className="p-2">{pkg.reservedBy}</td>
                        <td className="p-2">{pkg.items.length} items</td>
                        <td className="p-2">
                          {pkg.items.reduce((sum, item) => sum + item.qty, 0)} total
                        </td>
                        <td className="p-2">
                          {new Date(pkg.updatedAt).toLocaleDateString()}
                        </td>
                        <td className="p-2 text-center">
                          <button
                            onClick={() => viewReleasedDetails(pkg)}
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            View Items
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      {/* Details Modal */}
      {showDetailsModal && selectedPackage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">
                  {selectedPackage.status === "RELEASED" ? "Released Package Details" : "Reserved Package Details"}
                </h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p><strong>Package Name:</strong> {selectedPackage.packageName}</p>
                <p><strong>Reserved By:</strong> {selectedPackage.reservedBy}</p>
                <p><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded text-xs font-semibold ${
                    selectedPackage.status === "RELEASED" 
                      ? "bg-green-100 text-green-800" 
                      : "bg-blue-100 text-blue-800"
                  }`}>
                    {selectedPackage.status}
                  </span>
                </p>
                <p><strong>Created:</strong> {new Date(selectedPackage.createdAt).toLocaleString()}</p>
                {selectedPackage.status === "RELEASED" && (
                  <p><strong>Released:</strong> {new Date(selectedPackage.updatedAt).toLocaleString()}</p>
                )}
              </div>

              <table className="w-full text-sm border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="p-2 text-left">Code</th>
                    <th className="p-2 text-left">Description</th>
                    <th className="p-2 text-right">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedPackage.items.map((item, i) => (
                    <tr key={i} className="border-t">
                      <td className="p-2 font-semibold">{item.itemCode}</td>
                      <td className="p-2">{item.itemDescription}</td>
                      <td className="p-2 text-right">{item.qty} {item.uom}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReserveStock;
