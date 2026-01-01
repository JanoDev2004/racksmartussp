// src/components/StockChart.jsx
import React, { useState, useMemo } from "react";
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

const StockChart = () => {
  const [viewType, setViewType] = useState("Year"); // Year | Month | Week
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(
    new Date().toLocaleString("en-US", { month: "long" })
  );

  const monthsList = Array.from({ length: 12 }, (_, i) =>
    new Date(0, i).toLocaleString("en-US", { month: "long" })
  );

  const years = Array.from(
    { length: new Date().getFullYear() - 2024 + 1 },
    (_, i) => 2024 + i
  );

  const demoTransactions = [
    { createdAt: "2025-01-05", action: "IN", count: 10 },
    { createdAt: "2025-01-15", action: "OUT", count: 4 },
    { createdAt: "2025-02-02", action: "IN", count: 8 },
    { createdAt: "2025-02-18", action: "OUT", count: 3 },
    { createdAt: "2025-03-10", action: "IN", count: 12 },
    { createdAt: "2025-03-20", action: "OUT", count: 6 },
    { createdAt: "2025-04-07", action: "IN", count: 15 },
    { createdAt: "2025-04-25", action: "OUT", count: 7 },
  ];

  const data = useMemo(() => {
    let grouped = [];

    if (viewType === "Year") {
      const months = Array.from({ length: 12 }, (_, i) => ({
        label: new Date(0, i).toLocaleString("en-US", { month: "short" }),
        stockIn: 0,
        stockOut: 0,
      }));

      demoTransactions.forEach((t) => {
        const date = new Date(t.createdAt);
        if (date.getFullYear() === Number(year)) {
          const idx = date.getMonth();
          if (t.action === "IN") months[idx].stockIn += t.count;
          if (t.action === "OUT") months[idx].stockOut += t.count;
        }
      });

      grouped = months.map((m) => ({ ...m, total: m.stockIn + m.stockOut }));
    } else if (viewType === "Month") {
      const selectedMonthIndex = monthsList.indexOf(month);
      const weeks = Array.from({ length: 5 }, (_, i) => ({
        label: `Week ${i + 1}`,
        stockIn: 0,
        stockOut: 0,
      }));

      demoTransactions.forEach((t) => {
        const date = new Date(t.createdAt);
        if (
          date.getFullYear() === Number(year) &&
          date.getMonth() === selectedMonthIndex
        ) {
          const weekNum = Math.ceil(date.getDate() / 7) - 1;
          if (t.action === "IN") weeks[weekNum].stockIn += t.count;
          if (t.action === "OUT") weeks[weekNum].stockOut += t.count;
        }
      });

      grouped = weeks.map((w) => ({ ...w, total: w.stockIn + w.stockOut }));
    } else if (viewType === "Week") {
      const selectedMonthIndex = monthsList.indexOf(month);
      const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => ({
        label: d,
        stockIn: 0,
        stockOut: 0,
      }));

      demoTransactions.forEach((t) => {
        const date = new Date(t.createdAt);
        if (
          date.getFullYear() === Number(year) &&
          date.getMonth() === selectedMonthIndex
        ) {
          const dayIdx = date.getDay();
          const index = dayIdx === 0 ? 6 : dayIdx - 1;
          if (t.action === "IN") days[index].stockIn += t.count;
          if (t.action === "OUT") days[index].stockOut += t.count;
        }
      });

      grouped = days.map((d) => ({ ...d, total: d.stockIn + d.stockOut }));
    }

    return grouped;
  }, [viewType, year, month, demoTransactions]);

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
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium w-full"
              >
                {years.map((y) => (
                  <option key={y}>{y}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium w-full"
              >
                {monthsList.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-gray-50 rounded-lg px-3 py-2">
              <CalendarDays className="w-4 h-4 text-gray-500 mr-2" />
              <select
                value={viewType}
                onChange={(e) => setViewType(e.target.value)}
                className="bg-transparent outline-none text-gray-700 font-medium w-full"
              >
                <option value="Year">Year</option>
                <option value="Month">Month</option>
                <option value="Week">Week</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bar Chart: Stock In/Out */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Stock Inbound / Stock Outbound ({viewType})
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey="stockIn"
                name="Stock In"
                fill="#22c55e"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="stockOut"
                name="Stock Out"
                fill="#ef4444"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Line Chart: Total Stock */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
            Total Stock Movements ({viewType})
          </h5>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" tick={{ fill: "#6b7280", fontSize: 12 }} />
              <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="total"
                name="Total Stock"
                stroke="#3b82f6"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </main>
  );
};

export default StockChart;
