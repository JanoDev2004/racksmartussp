import ReserveStock from "../models/reserveStock.model.js";
import Product from "../models/products.model.js";

/* ===== RESERVE STOCK ===== */
export const reserveStock = async (req, res) => {
  const { packageName, reservedBy, items } = req.body;

  if (!packageName || !reservedBy || !items?.length) {
    return res.status(400).json({ message: "Package name, reserved by, and items are required" });
  }

  try {
    // Check if packageName already exists
    const existing = await ReserveStock.findOne({ packageName });
    if (existing) {
      return res.status(400).json({ message: "Package name already exists" });
    }

    // Validate and deduct stock
    const mappedItems = [];
    for (const item of items) {
      const product = await Product.findOne({ itemCode: item.itemCode });
      if (!product) {
        return res.status(404).json({ message: `Product not found for code ${item.itemCode}` });
      }

      const availableQty = product.quantity - product.reservedQuantity;
      if (availableQty < item.qty) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.itemDescription}. Available: ${availableQty}`
        });
      }
      
      // Increase reserved quantity
      product.reservedQuantity += item.qty;

      // Deduct actual quantity
      product.quantity -= item.qty;
      await product.save();

      mappedItems.push({
        productId: product._id,
        itemCode: product.itemCode,
        itemDescription: product.itemDescription,
        qty: item.qty,
        uom: product.uom,
      });
    }

    // Create reserve record
    const reserve = await ReserveStock.create({
      packageName,
      reservedBy,
      items: mappedItems,
    });

    res.status(201).json(reserve);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== RELEASE RESERVED STOCK ===== */
export const releaseReserveStock = async (req, res) => {
  try {
    const reserve = await ReserveStock.findById(req.params.id);

    if (!reserve) {
      return res.status(404).json({ message: "Reserved package not found" });
    }

    if (reserve.status === "RELEASED") {
      return res.status(400).json({ message: "Already released" });
    }

    // 🔥 RESTORE BOTH quantity AND reservedQuantity
    for (const item of reserve.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: {
          quantity: item.qty,           // ⬅ restore actual stock
          reservedQuantity: -item.qty,  // ⬅ remove reservation
        },
      });
    }

    reserve.status = "RELEASED";
    await reserve.save();

    res.json({ message: "Reserved stock released successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET ALL RESERVED PACKAGES ===== */
export const getReservedPackages = async (req, res) => {
  try {
    const packages = await ReserveStock.find({ status: "RESERVED" })
      .sort({ createdAt: -1 });

    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET ALL RELEASED PACKAGES ===== */
export const getReleasedPackages = async (req, res) => {
  try {
    const packages = await ReserveStock.find({ status: "RELEASED" })
      .sort({ createdAt: -1 });

    res.json(packages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET SINGLE RESERVED PACKAGE ===== */
export const getReservedPackageById = async (req, res) => {
  try {
    const reserve = await ReserveStock.findById(req.params.id);
    if (!reserve) return res.status(404).json({ message: "Reserved package not found" });
    res.json(reserve);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};