import React, { useState, useMemo } from "react";
import { Search, History, MapPin, Package, X } from "lucide-react";

const Supplier = () => {
  const [suppliers] = useState([
    {
      id: "0001",
      name: "Global Steel Industrial",
      contact: "Juan Dela Cruz",
      address: "Warehouse 12, Navotas Port, Manila",
      email: "sales@globalsteel.ph",
      transactions: [
        {
          code: "PRD-001",
          category: "Rack",
          description: "Steel Rack 5x5",
          qty: 10,
          uom: "pcs",
          price: 1500,
        },
        {
          code: "PRD-002",
          category: "Rack",
          description: "Heavy Duty Shelf",
          qty: 5,
          uom: "pcs",
          price: 3200,
        },
      ],
    },
    {
      id: "0002",
      name: "Smart Office Solutions",
      contact: "Maria Santos",
      address: "BGC Corporate Center, Taguig",
      email: "maria@smartofficen.ph",
      transactions: [
        {
          code: "PRD-010",
          category: "Consumables",
          description: "Tape Roll 1 inch",
          qty: 50,
          uom: "pcs",
          price: 45,
        },
      ],
    },
  ]);

  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter((s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [suppliers, searchTerm]);

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* HEADER */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
                <h1 className="text-xl font-semibold text-gray-800">
                    RACKSMART – Supplier Directory
                </h1>
                <p className="text-gray-500 text-sm">
          Manage all supplier transactions efficiently.
                </p>

                {/* Instruction Box */}
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
                    <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
                        <li>Keep supplier contact information updated for seamless communication.</li>
      <li>Verify tax identification numbers and business permits for compliance.</li>
      <li>Document all transactions and lead times to monitor supplier performance.</li>
      <li>Categorize suppliers correctly to streamline the procurement process.</li>
                    </ul>
                </div>
            </div>

      {/* ================= CARDS CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Recent Supplier Transacrion
        </h5>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div
              key={s.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{s.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {s.address}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                  ID {s.id}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">
                  Products: <b>{s.transactions.length}</b>
                </p>
                <button
                  onClick={() => setSelectedSupplier(s)}
                  className="flex items-center gap-1 text-sm font-bold text-[#010197] hover:underline"
                >
                  <History size={14} /> View History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TABLE CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Total Supplier Transacrion
        </h5>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">

          <div className="flex flex-col">
              <label className="text-[14px] font-bold text-gray-400  mb-1">Supplier</label>
              
              <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
            </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white">
              <tr>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-center">Products</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSuppliers.map((s) => (
                <tr
                  key={s.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">{s.name}</td>
                  <td className="p-4 text-gray-600">{s.contact}</td>
                  <td className="p-4 text-gray-500 text-xs">{s.address}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedSupplier(s)}
                      className="text-sm font-bold text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PRODUCT HISTORY MODAL ================= */}
      {selectedSupplier && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-5xl rounded-xl shadow-xl overflow-hidden">

            {/* Modal Header */}
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {selectedSupplier.name}
                </h3>
                <p className="text-xs text-gray-500">
                  Delivered Products
                </p>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            {/* Product Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Code</th>
                    <th className="p-3 text-left">Category</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">UOM</th>
                    <th className="p-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedSupplier.transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="p-3 font-bold text-blue-700">{t.code}</td>
                      <td className="p-3 text-gray-500">{t.category}</td>
                      <td className="p-3 font-medium text-gray-800">{t.description}</td>
                      <td className="p-3 text-center font-bold">{t.qty}</td>
                      <td className="p-3 text-center uppercase text-gray-500">{t.uom}</td>
                      <td className="p-3 text-right font-bold">
                        ₱{t.price.toLocaleString()}
                      </td>
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

export default Supplier;
