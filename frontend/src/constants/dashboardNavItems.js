import {
  LayoutDashboard,
  Settings,
  Package,
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
  ArrowLeftRight,
} from "lucide-react";

// First and last links (common for all roles)
const FIRST_LINKS = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Product", icon: Package },
];

const LAST_LINKS = [
  { label: "Transactions Tracker", icon: ArrowLeftRight },
  { label: "Setting", icon: Settings },
];

// Admin-specific middle links
const ADMIN_MIDDLE = [
  { label: "Announcement", icon: Bell },
  { label: "User Activity", icon: BarChart3 },
  { label: "User Management", icon: Users },
];

// Management-specific middle links
const MANAGEMENT_MIDDLE = [
  { label: "Supplier", icon: Truck },
  { label: "Customer", icon: Users },
  { label: "Inbound Record", icon: ClipboardList },
  { label: "Outbound Record", icon: ClipboardList },
];

// Inventory-specific middle links
const INVENTORY_MIDDLE = [
  { label: "Inbound Stock", icon: ArrowDownToLine },
  { label: "Outbound Stock", icon: ArrowUpFromLine },
  { label: "Reserve Stock", icon: Archive },
  { label: "Product Management", icon: Boxes },
  { label: "Supplies Movements", icon: RefreshCcw },
  { label: "Supplies Management", icon: Package },
  { label: "Assets", icon: Building2 },
];

// Map roles to final nav arrays
export const NAV_BY_ROLE = {
  admin: [...FIRST_LINKS, ...ADMIN_MIDDLE, ...LAST_LINKS],
  management: [...FIRST_LINKS, ...MANAGEMENT_MIDDLE, ...LAST_LINKS],
  inventory: [...FIRST_LINKS, ...INVENTORY_MIDDLE, ...LAST_LINKS],
};