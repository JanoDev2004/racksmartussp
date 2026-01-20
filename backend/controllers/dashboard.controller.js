import InboundRecord from "../models/inboundRecord.model.js";
import OutboundRecord from "../models/outboundRecord.model.js";
import ReserveStock from "../models/reserveStock.model.js";

// GET /api/dashboard/pending
export const getPendingKPIs = async (req, res) => {
  try {
    // Number of pending inbound records
    const pendingInboundCount = await InboundRecord.countDocuments({ status: "Pending" });

    // Number of pending outbound records
    const pendingOutboundCount = await OutboundRecord.countDocuments({ status: "Pending" });

    // Total reserved stock (sum of items.qty where status is RESERVED)
    // Number of reserved packages
    const reservedStockCount = await ReserveStock.countDocuments({ status: "RESERVED" });

    res.status(200).json({
      pendingInbound: pendingInboundCount,
      pendingOutbound: pendingOutboundCount,
      reservedStock: reservedStockCount,
    });
  } catch (error) {
    console.error("Error fetching pending KPIs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// GET /api/dashboard/graph?period=week|month|year
export const getGraphData = async (req, res) => {
  try {
    const { period } = req.query;
    if (!['week', 'month', 'year'].includes(period)) {
      return res.status(400).json({ message: "Invalid period. Must be 'week', 'month', or 'year'" });
    }

    const now = new Date();
    let startDate;
    let groupBy;

    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 4 * 7 * 24 * 60 * 60 * 1000); // last 4 weeks
        groupBy = { $dateToString: { format: "%Y-%U", date: "$createdAt" } }; // Year-Week
        break;
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 11, 1); // last 12 months
        groupBy = { $dateToString: { format: "%Y-%m", date: "$createdAt" } }; // Year-Month
        break;
      case 'year':
        startDate = new Date(now.getFullYear() - 4, 0, 1); // last 5 years
        groupBy = { $dateToString: { format: "%Y", date: "$createdAt" } }; // Year
        break;
    }

    // inbound = sum of qty for Posted
    const inboundData = await InboundRecord.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "Posted" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: groupBy,
          stockIn: { $sum: "$items.qty" },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // outbound = sum of qty for Confirmed
    const outboundData = await OutboundRecord.aggregate([
      { $match: { createdAt: { $gte: startDate }, status: "Confirmed" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: groupBy,
          stockOut: { $sum: "$items.qty" },
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // merge
    const dataMap = new Map();

    inboundData.forEach(item => {
      dataMap.set(item._id, {
        period: item._id,
        stockIn: item.stockIn,
        stockOut: 0
      });
    });

    outboundData.forEach(item => {
      const existing = dataMap.get(item._id) || {
        period: item._id,
        stockIn: 0,
        stockOut: 0
      };
      existing.stockOut = item.stockOut;
      dataMap.set(item._id, existing);
    });

    const graphData = Array.from(dataMap.values()).sort((a, b) => a.period.localeCompare(b.period));

    res.status(200).json(graphData);
  } catch (error) {
    console.error("Error fetching graph data:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
