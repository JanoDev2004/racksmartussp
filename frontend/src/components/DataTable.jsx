import React from "react";

const DataTable = ({ data, loading, error }) => {
  if (loading) return <div className="py-8 text-center">Loading...</div>;
  if (error) return <div className="py-8 text-center text-red-600">{error}</div>;
  if (!data.length) return <div className="py-8 text-center text-gray-500">No data available</div>;

  const columns = Object.keys(data[0]);

  // Helper to safely render cell values
  const renderCell = (value) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "object") {
      // Pick common fields if available
      return value.username || value.fullName || JSON.stringify(value);
    }
    return value;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col}
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase border-b"
              >
                {col.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((item, idx) => (
            <tr key={idx} className="hover:bg-gray-50">
              {columns.map((col, i) => (
                <td key={i} className="px-4 py-3 text-sm text-gray-900 border-b">
                  {renderCell(item[col])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
