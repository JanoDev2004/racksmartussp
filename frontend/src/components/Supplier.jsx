import React, { useEffect, useMemo, useState } from "react";
import { History, X } from "lucide-react";
import PageHeader from "../components/PageHeader";
import { useInboundStore } from "../stores/useInboundStore";

const Supplier = () => {
  const { inboundRecords, fetchInboundRecords, loading } = useInboundStore();

  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Supplier filter
  const [poSearch, setPoSearch] = useState(""); // PO Number filter

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchInboundRecords();
  }, [fetchInboundRecords]);

  // ================= CONFIRMED ONLY =================
  const confirmedInbound = useMemo(() => {
    return inboundRecords.filter((r) => r.status === "Posted");
  }, [inboundRecords]);

  // ================= UNIQUE SUPPLIERS =================
  const suppliers = useMemo(() => {
    return [...new Set(confirmedInbound.map((r) => r.supplier).filter(Boolean))];
  }, [confirmedInbound]);

  // ================= FILTER BY SUPPLIER + PO =================
  const filteredInbound = useMemo(() => {
    return confirmedInbound.filter((r) => {
      const supplierMatch = searchTerm ? r.supplier === searchTerm : true;
      const poMatch = poSearch
        ? r.poNumber?.toLowerCase().includes(poSearch.toLowerCase())
        : true;
      return supplierMatch && poMatch;
    });
  }, [confirmedInbound, searchTerm, poSearch]);

  // ================= RECENT (LAST 4 CONFIRMED) =================
  const recentInbound = useMemo(() => {
    return confirmedInbound.slice(0, 4);
  }, [confirmedInbound]);

  return (
    <main className="px-4 md:px-6 py-6 bg-gray-100 min-h-screen">
      <PageHeader pageName="Supplier" />

      {/* ================= RECENT CONFIRMED ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h5 className="font-bold text-gray-700 border-b pb-1 mb-4">
          Recent Supplier Transactions
        </h5>

        {recentInbound.length === 0 ? (
          <p className="text-center text-gray-400 py-10 text-sm">
            No confirmed supplier transactions yet
          </p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recentInbound.map((pl) => (
              <div
                key={pl._id}
                className="border rounded-lg p-4 hover:shadow transition"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-gray-800">{pl.supplier}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Delivery Date:{" "}
                      {pl.deliveryDate
                        ? new Date(pl.deliveryDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                    <p className="text-xs text-gray-500">Container #{pl.containerNumber}</p>
                  </div>

                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    PO #{pl.poNumber}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <p className="text-xs text-gray-500">
                    Items: <b>{pl.items.length}</b>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= TOTAL CONFIRMED ================= */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="font-bold text-gray-700 border-b pb-1 mb-4">
          Total Supplier Transactions
        </h5>

        {/* Supplier + PO Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Supplier Dropdown */}
          <div>
            <label className="text-sm font-bold text-gray-400">Supplier</label>
            <select
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mt-1 border rounded-md px-3 py-1.5 w-full text-sm"
            >
              <option value="">All Suppliers</option>
              {suppliers.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* PO Number Input */}
          <div>
            <label className="text-sm font-bold text-gray-400">PO Number</label>
            <input
              type="text"
              value={poSearch}
              onChange={(e) => setPoSearch(e.target.value)}
              className="mt-1 border rounded-md px-3 py-1.5 w-full text-sm"
              placeholder="Search PO number..."
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border rounded-xl">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white">
              <tr>
                <th className="p-3 text-left">Supplier</th>
                <th className="p-3 text-left">PO Number</th>
                <th className="p-3 text-left">Delivery Date</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-center">Items</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredInbound.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-400">
                    No confirmed transactions found
                  </td>
                </tr>
              ) : (
                filteredInbound.map((r) => (
                  <tr key={r._id} className="hover:bg-blue-50">
                    <td className="p-4 font-semibold">{r.supplier}</td>
                    <td className="p-4">{r.poNumber}</td>
                    <td className="p-4 text-sm text-gray-600">
                      {r.deliveryDate
                        ? new Date(r.deliveryDate).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </td>
                    <td className="p-4 text-xs font-bold text-green-600">
                      CONFIRMED
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

      {/* ================= PACKING LIST MODAL ================= */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-5xl rounded-xl overflow-hidden">
            <div className="p-5 border-b flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{selectedRecord.supplier}</h3>
                <p className="text-xs text-gray-500">PO #{selectedRecord.poNumber}</p>
                <p className="text-xs text-gray-500">Container #{selectedRecord.containerNumber}</p>
                <p className="text-xs text-gray-500">
                  Delivery Date:{" "}
                  {selectedRecord.deliveryDate
                    ? new Date(selectedRecord.deliveryDate).toLocaleString("en-GB", {
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
                    <th className="p-3 text-center">Qty (Confirmed)</th>
                    <th className="p-3 text-center">UOM</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {selectedRecord.items.map((item, i) => (
                    <tr key={i}>
                      <td className="p-3 font-bold text-blue-700">{item.itemCode}</td>
                      <td className="p-3">{item.itemDescription}</td>
                      <td className="p-3">{item.dimension}</td>
                      <td className="p-3 text-center font-bold">{item.actualQty ?? item.qty}</td>
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

export default Supplier;
