import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useProductsStore } from "../stores/useProductsStore.js";
import PageHeader from "../components/PageHeader";

const Product = () => {
  const { products, fetchProducts, loading, error } = useProductsStore();
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [searchCode, setSearchCode] = useState("");

  // Filter products based on search
  const filteredProducts = useMemo(() => {
  return products.filter(
    (p) =>
      !p.archived && // ✅ hide archived products
      (p.itemCode || "").toLowerCase().includes(searchCode.toLowerCase())
  );
}, [products, searchCode]);

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* ================= HEADER CONTAINER ================= */}
      <PageHeader pageName="Product" />

      {/* Table + Search Container */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Products Overview
        </h5>

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
                <th className="p-3 text-left">Item Code</th>
                <th className="p-3 text-left">Item Description</th>
                <th className="p-3 text-left">Segment</th>
                <th className="p-3 text-left">Dimension</th>
                <th className="p-3 text-center bg-[#28a745]">Quantity</th>
                <th className="p-3 text-center bg-[#ffc107]">
                  Reserved Quantity
                </th>
                <th className="p-3 text-left">Account To</th>
                <th className="p-3 text-left">U.O.M</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="text-center py-6 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="text-center py-6 text-gray-500 font-medium"
                  >
                    No products found.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((item) => (
                  <tr
                    key={item._id}
                    className="odd:bg-white even:bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <td className="p-3 border-b border-gray-200 font-medium">
                      {item.itemCode || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {item.itemDescription || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {item.segment || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {item.dimension || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center bg-[#28a745] text-white font-semibold">
                      {item.quantity ?? 0}
                    </td>
                    <td className="p-3 border-b border-gray-200 text-center bg-[#ffc107] text-white font-semibold">
                      {item.reservedQuantity ?? 0}
                    </td>
                    <td className="p-3 border-b border-gray-200">
                      {item.accountTo || "—"}
                    </td>
                    <td className="p-3 border-b border-gray-200">{item.uom || "—"}</td>
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
