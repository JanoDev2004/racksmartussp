import OutboundRecord from "../models/outboundRecord.model.js";
import Product from "../models/products.model.js";

/**
 * ✅ CREATE OUTBOUND RECORD (PACKING LIST ➜ DISPATCH)
 * - NO STOCK UPDATE HERE
 * - STATUS = Pending
 * - packingNumber is provided by client
 */
export const createOutboundRecord = async (req, res) => {
  try {
    const {
      packingNumber,
      consignee,
      address,
      contactPerson,
      date,
      referenceDocs,
      purchaseOrderNo,
      deliveryReceipt,
      serviceInvoice,
      remarks,
      preparedBy,
      items,
    } = req.body;

    if (!packingNumber || !consignee || !items || items.length === 0) {
      return res
        .status(400)
        .json({ message: "Packing Number, Consignee, and items are required" });
    }

    // Check if packingNumber already exists
    const existing = await OutboundRecord.findOne({ packingNumber });
    if (existing) {
      return res
        .status(400)
        .json({ message: "Packing Number already exists" });
    }

    const outbound = await OutboundRecord.create({
      packingNumber,
      consignee,
      address,
      contactPerson,
      date,
      referenceDocs,
      purchaseOrderNo,
      deliveryReceipt,
      serviceInvoice,
      remarks,
      preparedBy,
      items: items.map((i) => ({
        itemCode: i.itemCode,
        itemDescription: i.itemDescription,
        dimension: i.dimension,
        qty: i.qty,
        uom: i.uom,
      })),
      status: "Pending",
    });

    res.status(201).json({ success: true, outbound });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * ✅ GET ALL OUTBOUND RECORDS
 */
export const getOutboundRecords = async (req, res) => {
  try {
    const records = await OutboundRecord.find().sort({ createdAt: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ GET PENDING OUTBOUND RECORDS (FOR DROPDOWN)
 */
export const getPendingOutboundRecords = async (req, res) => {
  try {
    const records = await OutboundRecord.find(
      { status: "Pending" },
      {
        packingNumber: 1,
        consignee: 1,
        items: 1,
      }
    ).sort({ createdAt: -1 });

    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ✅ CONFIRM OUTBOUND RECORD (DISPATCH CONFIRMED)
 * - Deduct stock
 * - Marks packing list as Dispatched
 */
export const confirmOutboundRecord = async (req, res) => {
  try {
    const { packingNumber, items } = req.body; // updated

    if (!packingNumber || !items || items.length === 0) {
      return res.status(400).json({
        message: "Packing Number and items are required",
      });
    }

    const outbound = await OutboundRecord.findOne({
      packingNumber,
      status: "Pending",
    });

    if (!outbound) {
      return res.status(404).json({
        message: "Pending packing list not found",
      });
    }

    // 🔥 DEDUCT STOCK
    for (const item of items) {
      const product = await Product.findOne({ itemCode: item.itemCode });

      if (!product) {
        return res.status(404).json({
          message: `Product with code ${item.itemCode} not found`,
        });
      }

      if (product.quantity < item.actualQty) {
        return res.status(400).json({
          message: `Insufficient stock for product ${item.itemCode}`,
        });
      }

      product.quantity -= item.actualQty;
      await product.save();
    }

    outbound.status = "Confirmed";
    outbound.confirmedAt = new Date();
    outbound.actualItems = items;

    await outbound.save();

    res.json({
      success: true,
      message: "Outbound record confirmed successfully",
      outbound,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};
