// controllers/actionLogManagement.controller.js
import ActionLog from "../models/actionLog.model.js";
import Product from "../models/products.model.js";
import Supply from "../models/supplies.model.js";
import Asset from "../models/assets.model.js";
import User from "../models/user.model.js";

/**
 * Create a new action log
 * @param {String} userId - ID of the user performing the action
 * @param {String} itemType - "Product", "Supply", "Asset"
 * @param {String} itemId - ID of the item affected
 * @param {String} action - "add", "update", "delete", "archive", "borrow", "return"
 * @param {String} description - Optional description
 */
export const createActionLog = async ({
  userId,
  itemType,
  itemId,
  action,
  description,
}) => {
  try {
    return await ActionLog.create({
      user: userId,
      itemType,
      itemId,
      action: action.toLowerCase(),
      description,
    });
  } catch (err) {
    console.error("Failed to create action log:", err.message);
    throw err;
  }
};

/**
 * Get action logs with optional filters
 * @param {Object} req.query - Filters: itemType, startDate, endDate
 */
export const getActionLogs = async (req, res) => {
  try {
    let { itemType, action, startDate, endDate } = req.query;

    const query = {};

    // Filter by item type if provided
    if (itemType) {
      itemType = itemType.charAt(0).toUpperCase() + itemType.slice(1).toLowerCase();
      query.itemType = itemType;
    }

    // Filter by action if provided
    if (action) {
      query.action = action.toLowerCase(); // ensure lowercase matches stored value
    }

    // Filter by date range
    if (startDate) query.createdAt = { $gte: new Date(startDate) };
    if (endDate) {
      query.createdAt = query.createdAt
        ? { ...query.createdAt, $lte: new Date(endDate) }
        : { $lte: new Date(endDate) };
    }

    const logs = await ActionLog.find(query)
      .populate("user", "username fullName role")
      .sort({ createdAt: -1 });

    res.json(logs);
  } catch (err) {
    console.error("Failed to get action logs:", err.message);
    res.status(500).json({ message: err.message });
  }
};


/* ===========================
   Helper functions to log CRUD actions
=========================== */

/**
 * Log product actions
 */
export const logProductAction = async ({ userId, product, action }) => {
  try {
    const description = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } product "${product.itemDescription || "Unnamed"}" (${
      product.itemCode || "No Code"
    })`;
    await createActionLog({
      userId,
      itemType: "Product",
      itemId: product._id,
      action,
      description,
    });
  } catch (err) {
    console.error("Failed to log product action:", err.message);
  }
};

/**
 * Log supply actions
 */
export const logSupplyAction = async ({ userId, supply, action }) => {
  try {
    const description = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } supply "${supply.itemDescription || "Unnamed"}" (${
      supply.itemCode || "No Code"
    })`;
    await createActionLog({
      userId,
      itemType: "Supply",
      itemId: supply._id,
      action,
      description,
    });
  } catch (err) {
    console.error("Failed to log supply action:", err.message);
  }
};

/**
 * Log asset actions
 */
export const logAssetAction = async ({ userId, asset, action }) => {
  try {
    const description = `${
      action.charAt(0).toUpperCase() + action.slice(1)
    } asset "${asset.itemDescription || "Unnamed"}" (${
      asset.serialNo || asset._id
    })`;
    await createActionLog({
      userId,
      itemType: "Asset",
      itemId: asset._id,
      action,
      description,
    });
  } catch (err) {
    console.error("Failed to log asset action:", err.message);
  }
};
