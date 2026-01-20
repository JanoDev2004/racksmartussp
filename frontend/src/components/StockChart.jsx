import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CalendarDays } from "lucide-react";
import useDashboardStore from "../stores/useDashboardStore";

const StockChart = () => {
  const { graphData, selectedPeriod, setSelectedPeriod } = useDashboardStore();

  const chartData = useMemo(() => {
    if (!graphData || !graphData.length) return [];

    let cumulativeTotal = 0;

    return graphData.map((item) => {
      const inbound = Number(item.stockIn) || 0;
      const outbound = Number(item.stockOut) || 0;

      // Calculate the running balance
      cumulativeTotal += inbound - outbound;

      return {
        label: item.period, // Format: 2024-01, 2024-02, etc.
        stockIn: inbound,
        stockOut: outbound,
        total: cumulativeTotal,
      };
    });
  }, [graphData]);

  if (!chartData.length) {
    return (
      <div className="p-6 bg-white rounded-xl shadow">
        <p className="text-gray-500 font-semibold">Loading chart data...</p>
      </div>
    );
  }

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <div className="space-y-8">
        {/* Filter Controls */}
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-2 mb-4">
            Stock Chart Filters
          </h5>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium w-full"
              >
                <option value="year">Year</option>
                <option value="month">Month</option>
                <option value="week">Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bar Chart: Stock In/Out */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Stock Inbound / Stock Outbound ({selectedPeriod.toUpperCase()})
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip cursor={{ fill: "#f5f5f5" }} />
              <Legend verticalAlign="top" height={36} />
              {/* Stock In - Green */}
              <Bar
                dataKey="stockIn"
                name="Stock In"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
              />
              {/* Stock Out - Rose/Red */}
              <Bar
                dataKey="stockOut"
                name="Stock Out"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Total Stock */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Total Stock Movements ({selectedPeriod.toUpperCase()})
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#eee"
              />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend verticalAlign="top" height={36} />
              <Line
                type="monotone"
                dataKey="total"
                name="Running Inventory Total"
                stroke="#3b82f6"
                strokeWidth={4}
                dot={{ r: 6, fill: "#3b82f6" }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default StockChart;
