import BorrowRecord from "../models/borrowRecord.model.js";
import Supply from "../models/supplies.model.js";

/* ===== BORROW SUPPLIES (OUTBOUND) ===== */
export const borrowSupplies = async (req, res) => {
  const { borrower, items, remarks } = req.body;

  if (!borrower || !items?.length) {
    return res.status(400).json({ message: "Invalid borrow request" });
  }

  try {
    // 1️⃣ Map itemCode → supplyId and validate stock
    const mappedItems = [];

    for (const item of items) {
      const supply = await Supply.findOne({ itemCode: item.itemCode }); // 🔹 find by itemCode

      if (!supply) {
        return res.status(404).json({ message: `Supply not found for code ${item.itemCode}` });
      }

      if (supply.quantity < item.qty) {
        return res
          .status(400)
          .json({ message: `Insufficient stock for ${supply.itemDescription}` });
      }

      // Deduct stock
      supply.quantity -= item.qty;
      await supply.save();

      // Add to mappedItems
      mappedItems.push({
        supplyId: supply._id,
        itemCode: supply.itemCode,
        itemDescription: supply.itemDescription,
        qty: item.qty,
        uom: item.uom,
      });
    }

    // 2️⃣ Save borrow record
    const record = await BorrowRecord.create({
      borrower,
      remarks: remarks || "",
      items: mappedItems,
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== RETURN SUPPLIES (INBOUND) ===== */
export const returnSupplies = async (req, res) => {
  try {
    const record = await BorrowRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: "Borrow record not found" });
    }

    if (record.status === "RETURNED") {
      return res.status(400).json({ message: "Already returned" });
    }

    // 1️⃣ Restore quantities
    for (const item of record.items) {
      await Supply.findByIdAndUpdate(item.supplyId, {
        $inc: { quantity: item.qty },
      });
    }

    // 2️⃣ Update record status
    record.status = "RETURNED";
    await record.save();

    res.json({ message: "Supplies returned successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET ACTIVE BORROW RECORDS ===== */
export const getBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ status: "BORROWED" })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ===== GET RETURNED BORROW RECORDS ===== */
export const getReturnedBorrowRecords = async (req, res) => {
  try {
    const records = await BorrowRecord.find({ status: "RETURNED" })
      .sort({ createdAt: -1 });

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
