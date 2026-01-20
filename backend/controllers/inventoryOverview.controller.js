import Product from "../models/products.model.js";
import Supply from "../models/supplies.model.js";
import Asset from "../models/assets.model.js";

export const getInventoryOverview = async (req, res) => {
  try {
    const { inventory, category, startDate, endDate } = req.query;

    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    let result = [];

    // ================= PRODUCTS =================
    if (!inventory || inventory === "products") {
      const products = await Product.find({
        archived: false,
        ...dateFilter
      }).lean();

      result.push(
        ...products.map(p => ({
          inventoryType: "Product",
          itemCode: p.itemCode,
          itemDescription: p.itemDescription,
          segment: p.segment,
          dimension: p.dimension,
          quantity: p.quantity,
          uom: p.uom,
          accountTo: p.accountTo,
          createdAt: p.createdAt
        }))
      );
    }

    // ================= SUPPLIES =================
    if (!inventory || inventory === "supplies") {
      const supplyQuery = {
        archived: false,
        ...dateFilter
      };

      if (category) supplyQuery.category = category;

      const supplies = await Supply.find(supplyQuery).lean();

      result.push(
        ...supplies.map(s => ({
          inventoryType: "Supply",
          category: s.category,
          itemCode: s.itemCode,
          itemDescription: s.itemDescription,
          brand: s.brand,
          color: s.color,
          quantity: s.quantity,
          uom: s.uom,
          location: s.location,
          createdAt: s.createdAt
        }))
      );
    }

    // ================= ASSETS =================
    if (!inventory || inventory === "assets") {
      const assetQuery = {
        archived: false,
        ...dateFilter
      };

      if (category) assetQuery.category = category;

      const assets = await Asset.find(assetQuery).lean();

      result.push(
        ...assets.map(a => ({
          inventoryType: "Asset",
          category: a.category,
          itemDescription: a.itemDescription,
          segment: a.segment,
          brand: a.brand,
          serialNo: a.serialNo,
          quantity: a.quantity,
          acquisitionDate: a.acquisitionDate,
          createdAt: a.createdAt
        }))
      );
    }

    res.json(result);
  } catch (err) {
    console.error("Inventory Overview Error:", err);
    res.status(500).json({ message: "Failed to load inventory overview" });
  }
};
