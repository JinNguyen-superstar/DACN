/** @format */

import Discount from "../models/discountModel.js";

// Tạo mã giảm giá mới
export const createDiscount = async (req, res) => {
  try {
    const { code, description, percentage, start_date, end_date, usage_limit } =
      req.body;

    const existing = await Discount.findOne({ code });
    if (existing)
      return res.status(400).json({ message: "Mã giảm giá đã tồn tại" });

    const discount = new Discount({
      code,
      description,
      percentage,
      start_date,
      end_date,
      usage_limit,
    });

    await discount.save();
    res.status(201).json({ message: "Tạo mã giảm giá thành công", discount });
  } catch (error) {
    console.error("❌ Lỗi tạo discount:", error);
    res.status(500).json({ message: "Lỗi khi tạo discount", error: error.message });
  }
};

// Lấy toàn bộ mã giảm giá
export const getAllDiscounts = async (req, res) => {
  try {
    const discounts = await Discount.find().sort({ createdAt: -1 });
    res.status(200).json(discounts);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy danh sách discount", error: error.message });
  }
};

// Lấy thông tin 1 mã giảm giá
export const getDiscountById = async (req, res) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy discount", error: error.message });
  }
};

// Cập nhật mã giảm giá
export const updateDiscount = async (req, res) => {
  try {
    const updated = await Discount.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json({ message: "Cập nhật thành công", discount: updated });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi cập nhật discount", error: error.message });
  }
};

// Xóa mã giảm giá
export const deleteDiscount = async (req, res) => {
  try {
    const deleted = await Discount.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy discount" });
    res.status(200).json({ message: "Xóa thành công" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi xóa discount", error: error.message });
  }
};
