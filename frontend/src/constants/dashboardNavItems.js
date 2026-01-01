// src/constants/dashboardNavItems.js
import {
  LayoutDashboard,
  Settings,
  Package,
  FileText,
  Bell,
  Users,
  Truck,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  Archive,
  Boxes,
  RefreshCcw,
  Building2,
  BarChart3,
} from "lucide-react";

export const NAV_ITEMS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Setting", icon: Settings },
  { label: "Product", icon: Package },
  { label: "Report", icon: FileText },

  { label: "ADMIN", isHeader: true },

  { label: "Announcement", icon: Bell },
  { label: "User Activity", icon: BarChart3 },
  { label: "User Management", icon: Users },

  { label: "MANAGEMENT", isHeader: true },

  { label: "Supplier", icon: Truck },
  { label: "Customer", icon: Users },
  { label: "Inbound Record", icon: ClipboardList },
  { label: "Outbound Record", icon: ClipboardList },

  { label: "INVENTORY", isHeader: true },

  { label: "Inbound Stock", icon: ArrowDownToLine },
  { label: "Outbound Stock", icon: ArrowUpFromLine },
  { label: "Reserve Stock", icon: Archive },
  { label: "Product Management", icon: Boxes },
  { label: "Supplies Movements", icon: RefreshCcw },
  { label: "Supplies Management", icon: Package },
  { label: "Assets", icon: Building2 },
];
