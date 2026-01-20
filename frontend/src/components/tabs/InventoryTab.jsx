import React, { useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";
import useReportsStore from "../../stores/useReportsStore";
import DataTable from "../DataTable";

const InventoryTab = () => {
  const {
    filters,
    setFilters,
    fetchInventoryReport,
    fetchInventoryCategories,
    categories,
    reports,
    loading,
    error,
    clearFilters,
    generatePDF,
  } = useReportsStore();

  useEffect(() => {
    fetchInventoryReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update categories whenever inventory type changes
  useEffect(() => {
    if (filters.inventory) {
      fetchInventoryCategories(filters.inventory);
      setFilters({ category: "" });
    }
  }, [filters.inventory]);

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleSearch = () => {
    fetchInventoryReport();
  };

  const handleDownloadPDF = () => {
    generatePDF("inventory");
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Inventory Type
          </label>
          <select
            value={filters.inventory || ""}
            onChange={(e) => handleFilterChange("inventory", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="products">Products</option>
            <option value="supplies">Supplies</option>
            <option value="assets">Assets</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Category
          </label>
          <select
            value={filters.category || ""}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            disabled={!filters.inventory || filters.inventory === "products"}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={filters.startDate || ""}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={filters.endDate || ""}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          <Search size={16} />
          Search
        </button>

        <button
          onClick={clearFilters}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          <Filter size={16} />
          Clear
        </button>

        <button
          onClick={handleDownloadPDF}
          disabled={loading}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
        >
          <Download size={16} />
          PDF
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={reports.inventory || []}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default InventoryTab;
