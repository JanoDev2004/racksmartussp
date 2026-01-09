import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useOutboundStore } from "../stores/useOutboundStore";

const Customer = () => {
  const { outboundRecords, fetchOutboundRecords, loading } = useOutboundStore();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Customer filter
  const [packingSearch, setPackingSearch] = useState(""); // Packing number filter

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchOutboundRecords();
  }, [fetchOutboundRecords]);

  // ================= CONFIRMED ONLY =================
  const confirmedOutbound = useMemo(() => {
    return outboundRecords.filter((r) => r.status === "Confirmed");
  }, [outboundRecords]);

  // ================= UNIQUE CUSTOMERS =================
  const customers = useMemo(() => {
    return [
      ...new Set(confirmedOutbound.map((r) => r.consignee).filter(Boolean)),
    ];
  }, [confirmedOutbound]);

  // ================= FILTER BY CUSTOMER + PACKING NUMBER =================
  const filteredOutbound = useMemo(() => {
    return confirmedOutbound.filter((r) => {
      const customerMatch = searchTerm ? r.consignee === searchTerm : true;
      const packingMatch = packingSearch
        ? r.packingNumber.toLowerCase().includes(packingSearch.toLowerCase())
        : true;
      return customerMatch && packingMatch;
    });
  }, [confirmedOutbound, searchTerm, packingSearch]);

  // ================= RECENT (LAST 4 CONFIRMED) =================
  const recentOutbound = useMemo(() => {
    return confirmedOutbound.slice(0, 4);
  }, [confirmedOutbound]);

  return (
    <main className="px-4 md:px-6 py-6 bg-gray-100 min-h-screen">
      <PageHeader pageName="Customer" />

      {/* ================= RECENT ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h5 className="font-bold text-gray-700 border-b pb-1 mb-4">
          Recent Customer Outbound Records
        </h5>

        {recentOutbound.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            No recent outbound records yet
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentOutbound.map((r) => (
              <div
                key={r._id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{r.consignee}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Packing No: {r.packingNumber}
                    </p>
                    <p className="text-xs text-gray-500">
                      Date:{" "}
                      {r.date
                        ? new Date(r.date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>

                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    PO number: {r.purchaseOrderNo || "—"}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">
                    Items: <b>{r.items.length}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= TOTAL ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="font-bold text-gray-700 border-b pb-1 mb-4">
          All Customer Outbound Records
        </h5>

        {/* Customer + Packing Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Customer Dropdown */}
          <div>
            <label className="text-sm font-bold text-gray-400">Customer</label>
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 border rounded-md px-3 py-1.5 w-full text-sm"
            >
              <option value="">All Customers</option>
              {customers.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Packing Number Input */}
          <div>
            <label className="text-sm font-bold text-gray-400">
              Packing No.
            </label>
            <input
              type="text"
              value={packingSearch}
              onChange={(e) => setPackingSearch(e.target.value)}
              className="mt-1 border rounded-md px-3 py-1.5 w-full text-sm"
              placeholder="Search Packing Number..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white">
              <tr>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Packing No.</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredOutbound.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredOutbound.map((r) => (
                  <tr key={r._id} className="hover:bg-blue-50">
                    <td className="p-4 font-semibold">{r.consignee}</td>
                    <td className="p-4">{r.packingNumber}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {r.date
                        ? new Date(r.date).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="p-4 text-xs font-bold text-green-600">
                      {r.status.toUpperCase()}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="font-bold text-blue-600"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">
                  {selectedRecord.consignee}
                </h3>
                <p className="text-xs text-gray-500">
                  Packing No: {selectedRecord.packingNumber}
                </p>
                <p className="text-xs text-gray-500">
                  Date:{" "}
                  {selectedRecord.date
                    ? new Date(selectedRecord.date).toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })
                    : "—"}
                </p>
              </div>
              <button onClick={() => setSelectedRecord(null)}>
                <X />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-900 text-white">
                  <tr>
                    <th className="p-3 text-left">Item Code</th>
                    <th className="p-3 text-left">Description</th>
                    <th className="p-3 text-left">Dimension</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">UOM</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedRecord.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-blue-700">
                        {item.itemCode}
                      </td>
                      <td className="p-3">{item.itemDescription}</td>
                      <td className="p-3">{item.dimension}</td>
                      <td className="p-3 text-center font-bold">
                        {item.actualQty ?? item.qty}
                      </td>
                      <td className="p-3 text-center">{item.uom}</td>
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
