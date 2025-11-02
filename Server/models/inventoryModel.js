import mongoose from "mongoose";

/* Kho Model
  inventory_id: Số tự động tăng
  medicine_id: Mã thuốc (tham chiếu drug_id trong collection Drug), số nguyên
  name: Tên kho, chuỗi ký tự
  batch_number: Số lô, chuỗi ký tự
  expiration_date: Ngày hết hạn, kiểu Date
  cost_price: Giá vốn, số thực
  createdAt: Ngày tạo
  updatedAt: Ngày cập nhật
*/

const inventorySchema = new mongoose.Schema(
  {
    inventory_id: {
      type: Number,
      unique: true,
    },
    medicine_id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    batch_number: {
      type: String,
      required: true,
      trim: true,
    },
    expiration_date: {
      type: Date,
      required: true,
    },
    cost_price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Auto-increment inventory_id trước khi save
inventorySchema.pre("save", async function (next) {
  if (!this.inventory_id) {
    const last = await this.constructor.findOne({}, { inventory_id: 1 }).sort({ inventory_id: -1 });
    this.inventory_id = last ? last.inventory_id + 1 : 1;
  }
  next();
});

const inventoryModel = mongoose.model("Inventory", inventorySchema);

export default inventoryModel;
