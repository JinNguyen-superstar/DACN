import Order from "../models/ordersModel.js";
import orderService from "../services/ordersServices.js";

// Tạo đơn hàng mới (tự tăng order_id)
export const createOrder = async (req, res) => {
  try {
    const { customer_id, order_items, payment_method, notes, status } = req.body;

    // Lấy order cuối cùng để tự tăng ID
    const lastOrder = await Order.findOne().sort({ order_id: -1 });
    const newOrderId = lastOrder ? lastOrder.order_id + 1 : 1;

    // Tính tổng tiền
    const total_amount = order_items.reduce(
      (sum, item) => sum + item.quantity * item.price,
      0
    );

    const newOrder = new Order({
      order_id: newOrderId,
      customer_id,
      order_items,
      total_amount,
      payment_method,
      notes,
      status: status && ["Pending", "Processing", "Completed", "Cancelled"].includes(status)
        ? status
        : "Pending",
    });

    await newOrder.save();

    res.status(201).json({
      message: "✅ Tạo đơn hàng thành công",
      order: {
        order_id: newOrder.order_id,
        customer_id: newOrder.customer_id,
        order_items: newOrder.order_items,
        total_amount: newOrder.total_amount,
        status: newOrder.status,
        payment_method: newOrder.payment_method,
        notes: newOrder.notes,
        order_date: newOrder.order_date,
      },
    });
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:", error);
    res.status(500).json({ message: "Không thể tạo đơn hàng" });
  }
};

// Lấy danh sách tất cả đơn hàng (hiện order_id)
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer_id", "name email phone")
      .populate("order_items.drug_id", "drug_name price");

    const formatted = orders.map((order) => ({
      order_id: order.order_id,
      customer: order.customer_id,
      order_items: order.order_items,
      total_amount: order.total_amount,
      status: order.status,
      payment_method: order.payment_method,
      notes: order.notes,
      order_date: order.order_date,
      createdAt: order.createdAt,
    }));

    res.status(200).json(formatted);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy danh sách đơn hàng" });
  }
};

// Lấy chi tiết đơn hàng theo order_id (không dùng ObjectId)
export const getOrderByOrderId = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findOne({ order_id })
      .populate("customer_id", "name email phone")
      .populate("order_items.drug_id", "drug_name price");

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      order_id: order.order_id,
      customer: order.customer_id,
      order_items: order.order_items,
      total_amount: order.total_amount,
      status: order.status,
      payment_method: order.payment_method,
      notes: order.notes,
      order_date: order.order_date,
    });
  } catch (error) {
    console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
    res.status(500).json({ message: "Không thể lấy chi tiết đơn hàng" });
  }
};

// Cập nhật trạng thái đơn hàng (theo order_id)
export const updateOrderStatus = async (req, res) => {
  try {
    const { order_id } = req.params;
    const { status } = req.body;

    if (!["Pending", "Processing", "Completed", "Cancelled"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const order = await Order.findOneAndUpdate(
      { order_id },
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({
      message: "✅ Cập nhật trạng thái thành công",
      order,
    });
  } catch (error) {
    console.error("❌ Lỗi cập nhật trạng thái:", error);
    res.status(500).json({ message: "Không thể cập nhật trạng thái đơn hàng" });
  }
};

// Xóa đơn hàng theo order_id
export const deleteOrder = async (req, res) => {
  try {
    const { order_id } = req.params;
    const order = await Order.findOneAndDelete({ order_id });

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ message: "✅ Đã xóa đơn hàng thành công" });
  } catch (error) {
    console.error("❌ Lỗi xóa đơn hàng:", error);
    res.status(500).json({ message: "Không thể xóa đơn hàng" });
  }
};

// Lấy top sellers theo thời gian (gọi service)
export const getTopSellers = async (req, res) => {
  try {
    const { period } = req.params; // week | month | year
    const data = await orderService.getTopSellers(period);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Lỗi thống kê top sellers:", error);
    res.status(400).json({ message: error.message });
  }
};
