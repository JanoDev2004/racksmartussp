import React from 'react';

// Page header data for all components
const PAGE_DATA = {
  "Setting": {
    title: "RACKSMART – Account Settings",
    description: "Edit your details, upload/delete avatar, and change password.",
    guidelines: null
  },
  "Product": {
    title: "RACKSMART – Product Directory",
    description: "Manage all product information efficiently.",
    guidelines: [
      "Monitor current stock quantities across all categories to prevent overstocking or shortages.",
      "Check the real-time availability of items before processing new inbound or outbound orders.",
      "Verify product specifications and SKU details to ensure data consistency throughout the directory."
    ]
  },
  "Report": {
    title: "RACKSMART – Generate Reports",
    description: "Filter & download PDFs reporting all product and supplies transactions.",
    guidelines: [
      "Select the specific date range and transaction type to generate accurate and focused reports.",
      "Review the filtered data on the screen before proceeding to download the PDF document.",
      "Use these reports for auditing inventory accuracy and tracking supply consumption trends."
    ]
  },
  "Announcement": {
    title: "RACKSMART – Announcement Center",
    description: "Create and manage announcements visible to specific user roles.",
    guidelines: [
      "Use clear and concise titles for announcements.",
      "Assign announcements to the proper user roles.",
      "Ensure the content is accurate and relevant."
    ]
  },
  "User Activity": {
    title: "RACKSMART – Activity Logs",
    description: "Monitor system changes and user actions. Detailed audit trail for security.",
    guidelines: [
      "Use the filters below to locate specific actions by employee or date range.",
      "Reports generated reflect the currently filtered view."
    ]
  },
  "User Management": {
    title: "RACKSMART – Manage User Account",
    description: "Create, edit, and manage user accounts and permissions.",
    guidelines: null
  },
  "Supplier": {
    title: "RACKSMART – Supplier Directory",
    description: "Manage all supplier transactions efficiently.",
    guidelines: [
      "Keep supplier contact information updated for seamless communication.",
      "Verify tax identification numbers and business permits for compliance.",
      "Document all transactions and lead times to monitor supplier performance.",
      "Categorize suppliers correctly to streamline the procurement process."
    ]
  },
  "Customer": {
    title: "RACKSMART – Customer Directory",
    description: "Manage customer profiles and sales history.",
    guidelines: [
      "Keep customer records accurate for billing and delivery.",
      "Review sales history to understand buying behavior.",
      "Protect customer data and follow privacy policies."
    ]
  },
  "Inbound Record": {
    title: "RACKSMART – Inbound Record",
    description: "Record and track incoming inventory shipments.",
    guidelines: [
      "Verify packing list details before recording inbound items.",
      "Ensure all quantities match physical delivery.",
      "Update inventory immediately after verification."
    ]
  },
  "Outbound Record": {
    title: "RACKSMART – Outbound Record",
    description: "Record and track outgoing inventory shipments.",
    guidelines: null
  },
  "Inbound Stock": {
    title: "RACKSMART – Inbound Stock Verification",
    description: "Verify physical count before updating inventory.",
    guidelines: null
  },
  "Outbound Stock": {
    title: "RACKSMART – Outbound Stock Verification",
    description: "Verify outbound shipments and update inventory.",
    guidelines: [
      "Double-check quantities before confirming outbound shipments.",
      "Ensure proper documentation for all outbound transactions.",
      "Update inventory records immediately after verification."
    ]
  },
  "Reserve Stock": {
    title: "RACKSMART – Reserved Stock",
    description: "Reserve stock items in packages and release when not needed.",
    guidelines: [
      "Ensure reserved items are physically tagged or separated to avoid accidental dispatch.",
      "Set an expiration date for reservations to return unclaimed items back to active stock.",
      "Monitor the 'Reserved' status vs 'Available' stock to maintain accurate inventory planning."
    ]
  },
  "Product Management": {
    title: "RACKSMART – Product Management",
    description: "Manage inventory items and stock records.",
    guidelines: [
      "Verify stock levels before approving inbound and outbound transactions.",
      "Keep product descriptions and SKUs consistent for accurate reporting.",
      "Archive obsolete products to maintain a clean inventory list."
    ]
  },
  "Supplies Movements": {
    title: "RACKSMART – Supplies Movements",
    description: "Tracking of IN and OUT supply movements.",
    guidelines: [
      "Monitor the chronological flow of supplies to identify peaks in stock usage.",
      "Filter movement records by date or transaction type to reconcile inventory balances.",
      "Audit 'In' and 'Out' entries regularly to ensure all physical transfers are digitally logged."
    ]
  },
  "Supplies Management": {
    title: "RACKSMART – Supplies Management",
    description: "Add and manage active and archived supplies",
    guidelines: [
      "Ensure all office and operational supplies are categorized for easy tracking and replenishment.",
      "Set minimum stock levels for essential supplies to receive alerts before items run out.",
      "Review and archive obsolete or fully consumed supplies to keep the inventory list organized."
    ]
  },
  "Assets": {
    title: "RACKSMART – Asset Management",
    description: "Manage company assets and equipment.",
    guidelines: [
      "Track asset locations and assignments.",
      "Schedule regular maintenance for equipment.",
      "Monitor asset depreciation and replacement cycles."
    ]
  }
};

const PageHeader = ({ pageName }) => {
  const pageInfo = PAGE_DATA[pageName];

  if (!pageInfo) {
    return null;
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow mb-6">
      <h1 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
        {pageInfo.title}
      </h1>
      <p className="text-gray-500 text-sm">
        {pageInfo.description}
      </p>

      {pageInfo.guidelines && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg shadow mt-4">
          <p className="text-blue-900 text-sm font-bold">Guidelines:</p>
          <ul className="list-disc list-inside text-blue-900 text-sm space-y-1">
            {pageInfo.guidelines.map((guideline, index) => (
              <li key={index}>{guideline}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PageHeader;