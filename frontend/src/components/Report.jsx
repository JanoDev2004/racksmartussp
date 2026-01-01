import React, { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const Report = () => {
  const demoProducts = [
    { _id: "1", code: "P001", category: "Electronics", action: "IN", count: 5, client: "Client A", personnel: "User1", createdAt: new Date() },
    { _id: "2", code: "P002", category: "Furniture", action: "OUT", count: 2, client: "Client B", personnel: "User2", createdAt: new Date() },
    { _id: "3", code: "P003", category: "Electronics", action: "IN", count: 3, client: "Client C", personnel: "User3", createdAt: new Date() },
  ];

  const demoSupplies = [
    { _id: "1", code: "S001", category: "PPE", action: "IN", count: 10, borrower: "John Doe", personnel: "User1", createdAt: new Date() },
    { _id: "2", code: "S002", category: "Tools", action: "OUT", count: 1, borrower: "Jane Smith", personnel: "User2", createdAt: new Date() },
  ];

  const [productTransactions] = useState(demoProducts);
  const [suppliesTransactions] = useState(demoSupplies);

  const formatDate = (date) => {
    const d = new Date(date);
    return `${d.getHours()}:${d.getMinutes()} ${d.toLocaleString("en-US", { month: "short" })} ${d.getDate()}, ${d.getFullYear()}`;
  };

  const downloadPDF = (transactions, title, columns) => {
    const doc = new jsPDF("l", "mm", "a4");
    const pageWidth = doc.internal.pageSize.getWidth();

    autoTable(doc, {
      head: [columns],
      body: transactions.map(tx => columns.map(col => tx[col.toLowerCase()] || formatDate(tx.createdAt))),
      startY: 25,
      styles: { fontSize: 8, cellPadding: 2, halign: "center" },
      headStyles: { fillColor: [2,1,150], textColor: 255, fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245,245,245] },
      didDrawPage: () => {
        doc.setFontSize(13);
        doc.text(title, pageWidth / 2, 15, { align: "center" });
      },
    });

    doc.save(`${title.replaceAll(" ", "_")}_${new Date().toISOString().slice(0,10)}.pdf`);
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">

      {/* ================= HEADER CONTAINER ================= */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h1 className="text-xl font-semibold text-gray-800">
          RACKSMART – Generate Reports
        </h1>
        <p className="text-gray-500 text-sm">
          Filter & download PDF1s reporting all product and supplies transactions.
        </p>

        {/* Instruction Box */}
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            <li>Select the specific date range and transaction type to generate accurate and focused reports.</li>
<li>Review the filtered data on the screen before proceeding to download the PDF document.</li>
<li>Use these reports for auditing inventory accuracy and tracking supply consumption trends.</li>
          </ul>
        </div>
      </div>

      {/* Products Transactions */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">Products Transactions</h5>
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-175 w-full text-sm border-collapse">
            <thead className="bg-[#010197] text-white uppercase tracking-wide sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">CODE</th>
                <th className="p-3 text-left">CATEGORY</th>
                <th className="p-3 text-left">ACTION</th>
                <th className="p-3 text-left">COUNT</th>
                <th className="p-3 text-left">CLIENT</th>
                <th className="p-3 text-left">ACCOUNT USER</th>
                <th className="p-3 text-left">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {productTransactions.map((tx, idx) => (
                <tr key={tx._id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                  <td className="p-3">{tx.code}</td>
                  <td className="p-3">{tx.category}</td>
                  <td className={`p-3 font-semibold ${tx.action === "IN" ? "text-green-600" : "text-red-600"}`}>{tx.action}</td>
                  <td className="p-3">{tx.count}</td>
                  <td className="p-3">{tx.client}</td>
                  <td className="p-3">{tx.personnel}</td>
                  <td className="p-3">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => downloadPDF(productTransactions, "RackSmart Products Transaction Report", ["CODE","CATEGORY","ACTION","COUNT","CLIENT","ACCOUNT USER","TIMESTAMP"])}
            className="flex items-center mt-2 gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
        >
          Download PDF
        </button>
      </div>

      {/* Supplies Transactions */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h5 className="text-gray-700 font-bold border-b border-gray-200 pb-1 mb-4">Supplies Transactions</h5>
        <div className="overflow-x-auto border border-gray-200 rounded-xl shadow-sm">
          <table className="min-w-175 w-full text-sm border-collapse">
            <thead className="bg-[#010197] text-white uppercase tracking-wide sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left">CODE</th>
                <th className="p-3 text-left">CATEGORY</th>
                <th className="p-3 text-left">ACTION</th>
                <th className="p-3 text-left">COUNT</th>
                <th className="p-3 text-left">BORROWER</th>
                <th className="p-3 text-left">ACCOUNT USER</th>
                <th className="p-3 text-left">TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              {suppliesTransactions.map((tx, idx) => (
                <tr key={tx._id} className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-gray-100`}>
                  <td className="p-3">{tx.code}</td>
                  <td className="p-3">{tx.category}</td>
                  <td className={`p-3 font-semibold ${tx.action === "IN" ? "text-green-600" : "text-red-600"}`}>{tx.action}</td>
                  <td className="p-3">{tx.count}</td>
                  <td className="p-3">{tx.borrower}</td>
                  <td className="p-3">{tx.personnel}</td>
                  <td className="p-3">{formatDate(tx.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          onClick={() => downloadPDF(suppliesTransactions, "RackSmart Supplies Transaction Report", ["CODE","CATEGORY","ACTION","COUNT","BORROWER","ACCOUNT USER","TIMESTAMP"])}
            className="flex items-center mt-2 gap-2 bg-[#1800ad] hover:bg-[#15008f] text-white px-6 py-2 rounded-md font-bold text-sm transition shadow-md active:scale-95"
        >
          Download PDF
        </button>
      </div>
    </main>
  );
};

export default Report;
