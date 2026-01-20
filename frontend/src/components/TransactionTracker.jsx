import React, { useState } from "react";
import { Download, Search, Filter, BarChart3, Package, Activity, Truck, User } from "lucide-react";
import PageHeader from "./PageHeader";
import InventoryTab from "./tabs/InventoryTab";
import ActionManagementTab from "./tabs/ActionManagementTab";
import StockTransactionTrackerTab from "./tabs/StockTransactionTrackerTab";
import PersonnelActivityTab from "./tabs/PersonnelActivityTab";

const TransactionTracker = () => {
  const [activeTab, setActiveTab] = useState("inventory");

  const tabs = [
    { id: "inventory", label: "Inventory Overview", icon: BarChart3 },
    { id: "action-management", label: "Action Management", icon: Activity },
    { id: "stock-transaction-tracker", label: "Transaction Tracker", icon: Truck },
    { id: "personnel-activity", label: "Personnel Activity", icon: User },
  ];

  const renderActiveTab = () => {
    switch (activeTab) {
      case "inventory":
        return <InventoryTab />;
      case "action-management":
        return <ActionManagementTab />;
      case "stock-transaction-tracker":
        return <StockTransactionTrackerTab />;
      case "personnel-activity":
        return <PersonnelActivityTab />;
      default:
        return null;
    }
  };

  return (
    <main className="px-4 md:px-6 py-6 font-sans bg-gray-100 min-h-screen">
      <PageHeader pageName="Report" />

      <div className="bg-white rounded-xl shadow mb-6">
        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
        {/* Active Tab Content */}
        <div className="p-6">{renderActiveTab()}</div>
      </div>
    </main>
  );
};

export default TransactionTracker;
