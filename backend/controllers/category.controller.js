import Supply from "../models/supplies.model.js";
import Asset from "../models/assets.model.js";

export const getInventoryCategories = async (req, res) => {
  try {
    const { inventory } = req.query;

    let categories = [];

    if (inventory === "supplies") {
      categories = await Supply.distinct("category", { archived: false });
    }

    if (inventory === "assets") {
      categories = await Asset.distinct("category", { archived: false });
    }

    res.json(categories);
  } catch (err) {
    console.error("Category Error:", err);
    res.status(500).json({ message: "Failed to load categories" });
  }
};
