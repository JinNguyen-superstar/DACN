// services/orderService.js
import Order from "../models/ordersModel.js";
import Drug from "../models/drugModel.js";

const orderService = {
  /**
   * Lấy top thuốc bán chạy trong một khoảng thời gian
   * @param {"week" | "month" | "year"} period
   */
  async getTopSellers(period) {
    let startDate;

    const now = new Date();

    if (period === "week") {
      // Lấy ngày đầu tuần (Thứ 2)
      const day = now.getDay(); // 0 = CN, 1 = Thứ 2
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      startDate = new Date(now.setDate(diff));
    } else if (period === "month") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (period === "year") {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      throw new Error("Invalid period");
    }

    // Dùng aggregation để tính tổng số lượng từng thuốc
    const topSellers = await Order.aggregate([
      { $match: { createdAt: { $gte: startDate } } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.drugId",
          totalSold: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
        },
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: "drugs",
          localField: "_id",
          foreignField: "_id",
          as: "drug",
        },
      },
      { $unwind: "$drug" },
      {
        $project: {
          _id: 0,
          drugId: "$drug._id",
          name: "$drug.name",
          totalSold: 1,
          totalRevenue: 1,
        },
      },
    ]);

    return topSellers;
  },
};

export default orderService;
