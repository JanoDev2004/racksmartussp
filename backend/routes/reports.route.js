import express from "express";
import { getInventoryOverview } from "../controllers/inventoryOverview.controller.js";
import { getInventoryCategories } from "../controllers/category.controller.js";
import { getActionLogs } from "../controllers/actionLogManagement.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStockTransactionsTracker } from "../controllers/stockTransactionTracker.controller.js";

const router = express.Router();

router.get("/inventory-overview", getInventoryOverview);
router.get("/inventory-categories", getInventoryCategories);
router.get("/stock-transactions-tracker", getStockTransactionsTracker);

// ===== ACTION LOGS =====
router.get("/action-logs", protectRoute, getActionLogs);

export default router;
