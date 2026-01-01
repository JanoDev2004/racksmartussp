import React, { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";

const Product = () => {
  // Dummy product data
  const [products, setProducts] = useState([
    {
      code: "PRD-001",
      category: "Rack",
      segment: "Heavy Duty",
      itemDescription: "Steel Rack 5x5",
      dimension: "5x5",
      updatedCount: 10,
      reserveCount: 2,
      uom: "pcs",
      price: 1500,
      accountTo: "Warehouse A",
    },
    {
      code: "PRD-002",
      category: "Consumables",
      segment: "Office",
      itemDescription: "Tape Roll",
      dimension: "1inch",
      updatedCount: 50,
      reserveCount: 5,
      uom: "pcs",
      price: 50,
      accountTo: "Warehouse B",
    },
  ]);

  const [searchCode, setSearchCode] = useState("");

  // Filter products based on search
  const filteredProducts = useMemo(() => {
    return products.filter((p) =>
      p.code.toLowerCase().includes(searchCode.toLowerCase())
    );
  }, [products, searchCode]);

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* ================= HEADER CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Product Directory
        </h1>
        <p className="text-gray-500 text-sm">
          Manage all product information efficiently.
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Monitor current stock quantities across all categories to prevent overstocking or shortages.</li>
<li>Check the real-time availability of items before processing new inbound or outbound orders.</li>
<li>Verify product specifications and SKU details to ensure data consistency throughout the directory.</li>
          </ul>
        </div>
      </div>

      {/* Table + Search Container */}
      <div className="bg-white p-6 rounded-xl shadow">

                <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">Products Overview</h5>

        {/* Search + Add */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center border border-gray-300 rounded-md px-2 py-1 w-full md:w-auto">
            <Search size={16} className="text-gray-500 mr-1" />
            <input
              type="text"
              placeholder="Search Product Code"
              value={searchCode}
              onChange={(e) => setSearchCode(e.target.value)}
              className="outline-none text-sm bg-transparent flex-1"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-200 w-full text-sm">
            <thead className="bg-[#010197] text-white uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Code</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Segment</th>
                <th className="p-3 text-left">Item Description</th>
                <th className="p-3 text-left">Dimension</th>
                <th className="p-3 text-center bg-[#28a745]">Actual Count</th>
                <th className="p-3 text-center bg-[#ffc107]">Reserve Count</th>
                <th className="p-3 text-left">U.O.M</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Account To</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="10"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item, index) => (
                  <tr
                    key={index}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="p-3 border-b border-gray-200 font-medium">
                      {item.code}
                    </td>
                    <td className="p-3 border-b border-gray-200">{item.category}</td>
                    <td className="p-3 border-b border-gray-200">{item.segment}</td>
                    <td className="p-3 border-b border-gray-200">
                      {item.itemDescription}
                    </td>
                    <td className="p-3 border-b border-gray-200">{item.dimension}</td>
                    <td className="p-3 border-b border-gray-200 text-center bg-[#28a745] text-white font-semibold">
                      {item.updatedCount}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center bg-[#ffc107] text-white font-semibold">
                      {item.reserveCount}
                    </td>
                    <td className="p-3 border-b border-gray-200">{item.uom}</td>
                    <td className="p-3 border-b border-gray-200 font-medium">
                      ₱{item.price.toLocaleString()}
                    </td>
                    <td className="p-3 border-b border-gray-200">{item.accountTo}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Product;
