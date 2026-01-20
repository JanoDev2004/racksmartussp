import React from "react";
import { Search, Filter, Download } from "lucide-react";
import useReportsStore from "../../stores/useReportsStore";
import DataTable from "../DataTable";

const PersonnelActivityTab = () => {
  const {
    filters,
    setFilters,
    fetchPersonnelActivityReport,
    reports,
    loading,
    error,
    clearFilters,
    generatePDF,
  } = useReportsStore();

  const handleFilterChange = (key, value) => {
    setFilters({ [key]: value });
  };

  const handleSearch = () => {
    fetchPersonnelActivityReport();
  };

  const handleDownloadPDF = () => {
    generatePDF("personnel-activity");
  };

  return (
    <div>
      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Username
          </label>
          <input
            type="text"
            value={filters.user || ""}
            onChange={(e) => handleFilterChange("user", e.target.value)}
            placeholder="Username"
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-sm font-semibold text-gray-600 mb-1">
            Action
          </label>
          <select
            value={filters.action || ""}
            onChange={(e) => handleFilterChange("action", e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
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
        data={reports.personnelActivity || []}
        loading={loading}
        error={error}
      />
    </div>
  );
};

export default PersonnelActivityTab;
