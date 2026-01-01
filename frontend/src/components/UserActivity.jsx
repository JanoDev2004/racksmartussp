import React, { useState } from "react";
import { 
  FileText, 
  Download, 
  UserPlus, 
  UserCog, 
  UserMinus, 
  PlusCircle, 
  RefreshCcw, 
  CheckCircle2, 
  AlertCircle,
  Calendar
} from "lucide-react";

const UserActivity = () => {
  // --- Demo Logs ---
  const [demoLogs] = useState([
    { id: 1, dateTime: "2021-08-30T15:20", role: "Admin", userName: "Juan Dela Cruz", event: "User created", additional: "New staff 'Maria Santos' added" },
    { id: 2, dateTime: "2021-08-30T15:19", role: "Management", userName: "David Conor", event: "Inbound record created", additional: "Reference No: INB-9921" },
    { id: 3, dateTime: "2021-08-30T15:18", role: "Inventory", userName: "Anna Reyes", event: "Outbound complete successfully", additional: "Package ID: PKG-001" },
    { id: 4, dateTime: "2021-08-30T15:17", role: "Admin", userName: "Juan Dela Cruz", event: "User details changes", additional: "Changed password for user 'Alex'" },
    { id: 5, dateTime: "2021-08-30T15:15", role: "Management", userName: "Maria Santos", event: "Outbound record updated", additional: "Qty changed from 10 to 15" },
    { id: 6, dateTime: "2021-08-29T10:12", role: "Admin", userName: "Juan Dela Cruz", event: "User deleted", additional: "Removed access for 'John Doe'" },
  ]);

  const [selectedUser, setSelectedUser] = useState("All Employees");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const usernames = ["All Employees", ...new Set(demoLogs.map((l) => l.userName))];

  // --- Filtering Logic ---
  const filteredLogs = demoLogs.filter((log) => {
    const matchUser = selectedUser === "All Employees" || log.userName === selectedUser;
    const logDate = new Date(log.dateTime).toISOString().split('T')[0];
    const matchStart = startDate === "" || logDate >= startDate;
    const matchEnd = endDate === "" || logDate <= endDate;
    return matchUser && matchStart && matchEnd;
  });

  const getEventStyle = (event) => {
    switch (event) {
      case "User created": return { icon: <UserPlus size={14} />, color: "text-green-600 bg-green-50" };
      case "User details changes": return { icon: <UserCog size={14} />, color: "text-blue-600 bg-blue-50" };
      case "User deleted": return { icon: <UserMinus size={14} />, color: "text-red-600 bg-red-50" };
      case "Inbound record created":
      case "Outbound record created": return { icon: <PlusCircle size={14} />, color: "text-cyan-600 bg-cyan-50" };
      case "Inbound record updated":
      case "Outbound record updated": return { icon: <RefreshCcw size={14} />, color: "text-orange-600 bg-orange-50" };
      case "Inbound complete successfully":
      case "Outbound complete successfully": return { icon: <CheckCircle2 size={14} />, color: "text-emerald-600 bg-emerald-50" };
      default: return { icon: <AlertCircle size={14} />, color: "text-gray-600 bg-gray-50" };
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      {/* Header Container */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Activity Logs
        </h1>
        <p className="text-gray-500 text-sm">
          Monitor system changes and user actions. Detailed audit trail for security.
        </p>

        {/* Instruction Box (Matching UserManagement style) */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Use the filters below to locate specific actions by employee or date range.</li>
            <li>Reports generated reflect the currently filtered view.</li>
          </ul>
        </div>
      </div>

      {/* Main Content Container */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">
          Activity Records
        </h5>

        {/* Filters and Actions Row */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
            {/* Employee Filter */}
            <div className="flex flex-col">
              <label className="text-[14px] font-bold text-gray-400  mb-1">Employee</label>
              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              >
                {usernames.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Date Start */}
            <div className="flex flex-col">
              <label className="text-[14px] font-bold text-gray-400  mb-1">Start Date</label>
              <div className="relative">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none"
                />
              </div>
            </div>

            {/* Date End */}
            <div className="flex flex-col">
              <label className="text-[14px] font-bold text-gray-400  mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none"
              />
            </div>
          </div>

          {/* Export Actions (Moved next to filters) */}
          <div className="flex items-center gap-2 border-l-0 lg:border-l lg:pl-4 border-gray-200">
            <select className="border border-gray-300 rounded-md px-3 py-1.5 text-sm outline-none bg-gray-50">
              <option>PDF Report</option>
            </select>
            <button className="flex items-center gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-4 py-1.5 rounded-md font-bold text-sm transition shadow-sm">
              <Download size={16} /> Download
            </button>
          </div>
        </div>

        {/* Table inside the same container */}
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-[#010197] text-white uppercase tracking-wide">
              <tr>
                <th className="p-3 text-left">Date and Time</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Username</th>
                <th className="p-3 text-left">Event</th>
                <th className="p-3 text-left">Additional Info</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-10 text-gray-500 italic">
                    No activities found for the selected filters.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const style = getEventStyle(log.event);
                  const formattedDate = new Date(log.dateTime).toLocaleString('en-GB', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                  });
                  
                  return (
                    <tr key={log.id} className="odd:bg-white even:bg-gray-50 hover:bg-blue-50 transition">
                      <td className="p-4 text-gray-600 whitespace-nowrap font-medium">
                        {formattedDate}
                      </td>
                      <td className="p-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase
                          ${log.role === 'Admin' ? 'border-blue-200 text-blue-600 bg-blue-50' : 
                            log.role === 'Management' ? 'border-orange-200 text-orange-600 bg-orange-50' : 
                            'border-green-200 text-green-600 bg-green-50'}`}>
                          {log.role}
                        </span>
                      </td>
                      <td className="p-4 font-semibold text-gray-700">{log.userName}</td>
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold ${style.color}`}>
                          {style.icon}
                          {log.event}
                        </div>
                      </td>
                      <td className="p-4 text-gray-500 italic text-xs">{log.additional}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default UserActivity;