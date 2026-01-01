// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useUserStore } from "../stores/useUserStore";

// Components
import StockChart from "../components/StockChart";
import Setting from "../components/Setting";
import Product from "../components/Product";
import Report from "../components/Report";
import Announcement from "../components/Announcement";
import UserActivity from "../components/UserActivity";
import UserManagement from "../components/UserManagement";
import Supplier from "../components/Supplier";
import Customer from "../components/Customer";
import InboundRecord from "../components/InboundRecord";
import OutboundRecord from "../components/OutboundRecord";
import InboundStock from "../components/InboundStock";
import OutboundStock from "../components/OutboundStock";
import ReserveStock from "../components/ReserveStock";
import ProductManagement from "../components/ProductManagement";
import SuppliesMovements from "../components/SuppliesMovements";
import SuppliesManagement from "../components/SuppliesManagement";
import Assets from "../components/Assets";

import { NAV_ITEMS } from "../constants/dashboardNavItems.js";

const roleDisplayMap = {
  admin: "ADMINISTRATOR",
  staff: "INVENTORY PERSONNEL",
  personnel: "PROJECT PERSONNEL",
};

const Dashboard = () => {
  const { user, checkingAuth } = useUserStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeContent, setActiveContent] = useState("Dashboard");
  const [clock, setClock] = useState("");

  // 🔹 Auth guard
  if (checkingAuth) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-600 font-semibold">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const userFullName = user?.fullName || user?.username;
  const userRole = roleDisplayMap[user?.role] || "USER";
  const userAvatar = user?.avatar || "/default-avatar.png";

  // Clock updater
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString("en-PH", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      });
      const timeStr = now.toLocaleTimeString("en-PH", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
      setClock(`${dateStr}  ${timeStr}`);
    };
    updateClock();
    const interval = setInterval(updateClock, 60000);
    return () => clearInterval(interval);
  }, []);

  // Demo KPI counts
  const inboundStock = 0;
  const outboundStock = 0;
  const reserveStock = 0;

  const renderContent = () => {
    switch (activeContent) {
      case "Setting":
        return <Setting />;
      case "Product":
        return <Product />;
      case "Report":
        return <Report />;
      case "User Activity":
        return <UserActivity />;
      case "User Management":
        return <UserManagement />;
      case "Announcement":
        return <Announcement />;
      case "Supplier":
        return <Supplier />;
      case "Customer":
        return <Customer />;
      case "Inbound Record":
        return <InboundRecord />;
      case "Outbound Record":
        return <OutboundRecord />;
      case "Inbound Stock":
        return <InboundStock />;
      case "Outbound Stock":
        return <OutboundStock />;
      case "Reserve Stock":
        return <ReserveStock />;
      case "Product Management":
        return <ProductManagement />;
      case "Supplies Movements":
        return <SuppliesMovements />;
      case "Supplies Management":
        return <SuppliesManagement />;
      case "Assets":
        return <Assets />;
      case "Dashboard":
      default:
        return (
          <div className="space-y-6 max-w-300 mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <KpiCard label="INBOUND STOCK" value={inboundStock} color="bg-green-500" />
              <KpiCard label="OUTBOUND STOCK" value={outboundStock} color="bg-red-500" />
              <KpiCard label="RESERVE STOCK" value={reserveStock} color="bg-yellow-500" />
            </div>
            <StockChart />
          </div>
        );
    }
  };

  const KpiCard = ({ label, color, value }) => (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-6 flex flex-col items-center justify-center space-y-2">
      <div className={`text-sm font-semibold text-white px-4 py-1 rounded-full ${color}`}>{label}</div>
      <div className="text-4xl font-bold text-gray-800 pt-2">{value}</div>
      <div className="text-sm text-gray-500">Stored Records</div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-20 md:hidden" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 md:relative z-30 bg-[#010197] text-white flex flex-col transition-all duration-300 ease-in-out
          ${collapsed ? "w-20" : "w-64"}
          ${mobileOpen ? "translate-x-0 left-0 w-[60%] shadow-2xl p-6" : "-translate-x-full md:translate-x-0 md:p-4"} h-screen`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <img src="/updated logo.png" alt="Racksmart Logo" className="w-12 h-12 rounded-lg" />
            {!collapsed && <h1 className="text-xl font-bold">RACKSMART</h1>}
          </div>
          <button
            onClick={() => (mobileOpen ? setMobileOpen(false) : setCollapsed(!collapsed))}
            className="md:absolute top-6 -right-3 bg-[#ff751f] hover:bg-[#e46b1d] p-1 rounded-full shadow-md transition text-white"
          >
            {mobileOpen ? <X size={20} /> : collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
        <div className="my-3 border-t border-blue-800 opacity-60" />

        {/* Nav */}
        <nav className="flex-1 min-h-0 mt-3 overflow-y-auto scrollbar-hide overscroll-contain">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, icon, isHeader }) => (
              <li key={label}>
                {isHeader ? (
                  <span className={`block px-3 py-2 text-gray-400 uppercase font-bold text-xs ${collapsed ? "hidden" : "text-sm"}`}>
                    {label}
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      setActiveContent(label);
                      setMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left text-sm font-medium transition-colors duration-200 ${
                      activeContent === label ? "bg-white text-[#010197]" : "text-white hover:bg-blue-800 hover:text-white"
                    }`}
                  >
                    {icon && <span className="text-lg">{React.createElement(icon)}</span>}

                    {!collapsed && <span className="truncate text-sm">{label}</span>}
                  </button>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info */}
        <div className={`border-t border-blue-800 pt-4 mt-4 flex items-center ${collapsed ? "justify-center" : "gap-3 px-3"}`}>
          <img src={userAvatar} alt="Profile" className="w-10 h-10 rounded-full object-cover border-2 border-white" />
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white truncate">{userFullName}</p>
              <p className="text-xs uppercase tracking-wide text-blue-200">{userRole}</p>
            </div>
          )}
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between bg-white text-gray-800 shadow p-4 sticky top-0 z-10">
          <button onClick={() => setMobileOpen(true)} className="md:hidden p-2 rounded hover:bg-gray-100">
            <Menu className="w-5 h-5 text-gray-700" />
          </button>
          <span className="text-sm text-gray-700 font-bold">{clock}</span>
        </div>

        <div className="p-6 flex-1">{renderContent()}</div>

        <footer className="w-full text-center py-4 text-sm font-medium border-t shadow-sm bg-white text-gray-500">
          Copyright © {new Date().getFullYear()} Upright Storage Solutions PH. All Rights Reserved.
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;
