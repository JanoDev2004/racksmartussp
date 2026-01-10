import InboundRecord from "../models/inboundRecord.model.js";
import Product from "../models/products.model.js";

/**
 * ✅ CREATE INBOUND (PO ➜ PACKING LIST)
 * - NO STOCK UPDATE HERE
 * - STATUS = PENDING
 * - containerNumber is provided by client
 */
export const createInboundRecord = async (req, res) => {
  try {
    const { containerNumber, poNumber, supplier, deliveryDate, preparedBy, items } = req.body;

    if (!containerNumber || !poNumber || !items || items.length === 0) {
      return res.status(400).json({ message: "Container Number, PO Number and items are required" });
    }

    // Check if containerNumber already exists
    const existing = await InboundRecord.findOne({ containerNumber });
    if (existing) {
      return res.status(400).json({ message: "Container Number already exists" });
    }

    const inbound = await InboundRecord.create({
      containerNumber,
      poNumber,
      supplier,
      deliveryDate,
      preparedBy,
      items: items.map((i) => ({
        itemCode: i.itemCode,
        itemDescription: i.itemDescription,
        dimension: i.dimension,
        qty: i.qty,
        uom: i.uom,
      })),
      status: "Pending", // ✅ match enum
    });

    res.status(201).json({ success: true, inbound });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ GET ALL INBOUND RECORDS
 */
export const getInboundRecords = async (req, res) => {
  try {
    const records = await InboundRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ GET PENDING PACKING LISTS (FOR INVENTORY DROPDOWN)
 */
export const getPendingPackingLists = async (req, res) => {
  try {
    const records = await InboundRecord.find(
      { status: "Pending" },
      {
        containerNumber: 1,
        poNumber: 1,
        supplier: 1,
        items: 1,
      }
    ).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * ✅ CONFIRM INBOUND (PHYSICAL COUNT VERIFIED)
 * - Updates stock
 * - Marks PL as CONFIRMED
 */
export const confirmInboundRecord = async (req, res) => {
  try {
    const { containerNumber, items } = req.body; // updated

    if (!containerNumber || !items || items.length === 0) {
      return res.status(400).json({
        message: "Container number and items are required",
      });
    }

    const inbound = await InboundRecord.findOne({
      containerNumber,
      status: "Pending",
    });

    if (!inbound) {
      return res.status(404).json({
        message: "Pending packing list not found",
      });
    }

    // 🔥 STOCK-IN AFTER PHYSICAL COUNT
    for (const item of items) {
      await Product.findOneAndUpdate(
        { itemCode: item.itemCode },
        { $inc: { quantity: item.actualQty } }, // must use actualQty
        { new: true }
      );
    }

    inbound.status = "Posted";
    inbound.confirmedAt = new Date();
    inbound.actualItems = items;

    await inbound.save();

    res.json({
      success: true,
      message: "Inbound confirmed successfully",
      inbound,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
