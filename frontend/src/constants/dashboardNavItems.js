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

// Common for all roles
export const COMMON_NAV = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Setting", icon: Settings },
  { label: "Product", icon: Package },
  { label: "Report", icon: FileText },
];

// Admin-specific
export const ADMIN_NAV = [
  { label: "Announcement", icon: Bell },
  { label: "User Activity", icon: BarChart3 },
  { label: "User Management", icon: Users },
];

// Management-specific
export const MANAGEMENT_NAV = [
  { label: "Supplier", icon: Truck },
  { label: "Customer", icon: Users },
  { label: "Inbound Record", icon: ClipboardList },
  { label: "Outbound Record", icon: ClipboardList },
];

// Inventory-specific
export const INVENTORY_NAV = [
  { label: "Inbound Stock", icon: ArrowDownToLine },
  { label: "Outbound Stock", icon: ArrowUpFromLine },
  { label: "Reserve Stock", icon: Archive },
  { label: "Product Management", icon: Boxes },
  { label: "Supplies Movements", icon: RefreshCcw },
  { label: "Supplies Management", icon: Package },
  { label: "Assets", icon: Building2 },
];

// Map roles to nav arrays
export const NAV_BY_ROLE = {
  admin: [...COMMON_NAV, ...ADMIN_NAV],
  management: [...COMMON_NAV, ...MANAGEMENT_NAV],
  inventory: [...COMMON_NAV, ...INVENTORY_NAV],
};
