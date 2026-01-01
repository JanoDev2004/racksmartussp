import React, { useState, useMemo } from "react";
import { Search, History, MapPin, User, X } from "lucide-react";

const Customer = () => {
  const [customers] = useState([
    {
      id: "C-001",
      name: "ABC Construction",
      contact: "Engr. Roberto Cruz",
      address: "Quezon City, Metro Manila",
      email: "purchasing@abc.ph",
      transactions: [
        {
          code: "INV-001",
          item: "Pallet Rack",
          qty: 12,
          uom: "sets",
          amount: 185000,
        },
        {
          code: "INV-002",
          item: "Warehouse Shelving",
          qty: 6,
          uom: "sets",
          amount: 96000,
        },
      ],
    },
    {
      id: "C-002",
      name: "FastMove Logistics",
      contact: "Anna Reyes",
      address: "Cabuyao, Laguna",
      email: "anna@fastmove.ph",
      transactions: [
        {
          code: "INV-010",
          item: "Steel Rack",
          qty: 8,
          uom: "sets",
          amount: 120000,
        },
      ],
    },
  ]);

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Customer Directory
        </h1>
        <p className="text-gray-500 text-sm">
          Manage customer profiles and sales history.
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Keep customer records accurate for billing and delivery.</li>
            <li>Review sales history to understand buying behavior.</li>
            <li>Protect customer data and follow privacy policies.</li>
          </ul>
        </div>
      </div>

      {/* ================= CARDS ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Recent Customers
        </h5>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow transition"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-800">{c.name}</h3>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                    <MapPin size={12} /> {c.address}
                  </p>
                </div>
                <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                  {c.id}
                </span>
              </div>

              <div className="flex justify-between items-center mt-4">
                <p className="text-xs text-gray-500">
                  Transactions: <b>{c.transactions.length}</b>
                </p>
                <button
                  onClick={() => setSelectedCustomer(c)}
                  className="flex items-center gap-1 text-sm font-bold text-[#010197] hover:underline"
                >
                  <History size={14} /> View History
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          All Customers
        </h5>

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div className="flex flex-col">
            <label className="text-[14px] font-bold text-gray-400 mb-1">
              Customer Name
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
className="border border-gray-300 rounded-md px-3 py-1.5 text-sm w-full md:w-80 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-200 rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Contact</th>
                <th className="p-3 text-left">Address</th>
                <th className="p-3 text-center">History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.map((c) => (
                <tr
                  key={c.id}
                  className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition"
                >
                  <td className="p-4 font-semibold text-gray-800">{c.name}</td>
                  <td className="p-4 text-gray-600">{c.contact}</td>
                  <td className="p-4 text-gray-500 text-xs">{c.address}</td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => setSelectedCustomer(c)}
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

      {/* ================= MODAL ================= */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-xl overflow-hidden">

            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">
                  {selectedCustomer.name}
                </h3>
                <p className="text-xs text-gray-500">Sales Transactions</p>
              </div>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X size={18} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Invoice</th>
                    <th className="p-3 text-left">Item</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">UOM</th>
                    <th className="p-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {selectedCustomer.transactions.map((t, i) => (
                    <tr key={i} className="hover:bg-blue-50 transition">
                      <td className="p-3 font-bold text-blue-700">{t.code}</td>
                      <td className="p-3 text-gray-800">{t.item}</td>
                      <td className="p-3 text-center font-bold">{t.qty}</td>
                      <td className="p-3 text-center uppercase text-gray-500">
                        {t.uom}
                      </td>
                      <td className="p-3 text-right font-bold">
                        ₱{t.amount.toLocaleString()}
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

export default Customer;