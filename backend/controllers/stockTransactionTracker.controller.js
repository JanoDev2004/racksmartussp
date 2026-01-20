import InboundRecord from "../models/inboundRecord.model.js";
import OutboundRecord from "../models/outboundRecord.model.js";

/**
 * 📊 STOCK TRANSACTION TRACKER
 * - Combines INBOUND + OUTBOUND
 * - Only CONFIRMED / POSTED records
 * - Shows who performed the action
 */
export const getStockTransactionsTracker = async (req, res) => {
  try {
    const { stakeholder, product, startDate, endDate, transactionType } = req.query;

    /* =====================
       INBOUND TRANSACTIONS
    ====================== */
    const inboundFilter = { status: "Posted" };

    if (startDate || endDate) {
      inboundFilter.confirmedAt = {};
      if (startDate) inboundFilter.confirmedAt.$gte = new Date(startDate);
      if (endDate) inboundFilter.confirmedAt.$lte = new Date(endDate);
    }

    const inboundRecords = await InboundRecord.find(inboundFilter)
      .populate("confirmedBy", "username fullName role")
      .lean();

    const inboundTransactions = inboundRecords.flatMap((record) =>
      record.items.map((item) => ({
        type: "INBOUND",
        referenceNo: record.containerNumber,
        stakeholder: record.supplier,
        productCode: item.itemCode,
        productDescription: item.itemDescription,
        qty: item.qty,
        uom: item.uom,
        performedBy: record.confirmedBy,
        performedAt: record.confirmedAt,
      }))
    );

    /* =====================
       OUTBOUND TRANSACTIONS
    ====================== */
    const outboundFilter = { status: "Confirmed" };

    if (startDate || endDate) {
      outboundFilter.confirmedAt = {};
      if (startDate) outboundFilter.confirmedAt.$gte = new Date(startDate);
      if (endDate) outboundFilter.confirmedAt.$lte = new Date(endDate);
    }

    const outboundRecords = await OutboundRecord.find(outboundFilter)
      .populate("confirmedBy", "username fullName role")
      .lean();

    const outboundTransactions = outboundRecords.flatMap((record) =>
      record.items.map((item) => ({
        type: "OUTBOUND",
        referenceNo: record.packingNumber,
        stakeholder: record.consignee,
        productCode: item.itemCode,
        productDescription: item.itemDescription,
        qty: item.qty,
        uom: item.uom,
        performedBy: record.confirmedBy,
        performedAt: record.confirmedAt,
      }))
    );

    /* =====================
       MERGE + FILTER
    ====================== */
    let transactions = [...inboundTransactions, ...outboundTransactions];

    // Filter by transactionType if provided
    if (transactionType) {
      transactions = transactions.filter(
        (t) => t.type.toLowerCase() === transactionType.toLowerCase()
      );
    }

    if (stakeholder) {
      transactions = transactions.filter((t) =>
        t.stakeholder?.toLowerCase().includes(stakeholder.toLowerCase())
      );
    }

    if (product) {
      transactions = transactions.filter((t) =>
        t.productDescription?.toLowerCase().includes(product.toLowerCase())
      );
    }

    transactions.sort((a, b) => new Date(b.performedAt) - new Date(a.performedAt));

    res.json(transactions);
  } catch (error) {
    console.error("Stock Transaction Error:", error);
    res.status(500).json({ message: error.message });
  }
};
