import mongoose from "mongoose";

/* Đơn Thuốc Model
    prescription_id: Số tự động tăng
    patient_id: Mã bệnh nhân (tham chiếu patient_id trong collection Patient), số nguyên
    doctor_id: Mã bác sĩ (tham chiếu doctor_id trong collection Doctor), số nguyên
    date: Ngày lập đơn thuốc, kiểu Date
    items: Mảng thuốc kê (medicine_id, name, dosage, quantity, instructions)
    notes: Ghi chú, chuỗi ký tự
    createdAt: Ngày tạo, kiểu Date
    updatedAt: Ngày cập nhật
*/

const itemSchema = new mongoose.Schema(
    {
        medicine_id: { type: Number, required: true },
        name: { type: String, required: true, trim: true },
        dosage: { type: String, default: "" },
        quantity: { type: Number, required: true, min: 1 },
        instructions: { type: String, default: "" },
    },
    { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
    {
        prescription_id: { type: Number, unique: true },
        patient_id: { type: Number, required: true },
        doctor_id: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        items: { type: [itemSchema], default: [] },
        notes: { type: String, default: "" },
    },
    { timestamps: true }
);

// Auto-increment prescription_id trước khi save
prescriptionSchema.pre("save", async function (next) {
    if (!this.prescription_id) {
        const last = await this.constructor.findOne({}, { prescription_id: 1 }).sort({ prescription_id: -1 });
        this.prescription_id = last ? last.prescription_id + 1 : 1;
    }
    next();
});

const prescriptionModel = mongoose.model("Prescription", prescriptionSchema);

export default prescriptionModel;
