import prescriptionModel from "../models/prescriptionModel.js";
import drugModel from "../models/drugModel.js";

// Tạo đơn thuốc
export const createPrescription = async (req, res) => {
    try {
        const payload = req.body;

        if (!Array.isArray(payload.items) || payload.items.length === 0) {
            return res.status(400).json({ success: false, message: "Đơn thuốc phải có ít nhất một mặt hàng" });
        }

        // Validate items
        for (const it of payload.items) {
            if (!it.medicine_id || !it.quantity) {
                return res.status(400).json({ success: false, message: "Mặt hàng không hợp lệ: cần medicine_id và quantity" });
            }

            const drug = await drugModel.findOne({ drug_id: Number(it.medicine_id) });
            if (!drug) return res.status(404).json({ success: false, message: `Không tìm thấy thuốc: ${it.medicine_id}` });

            it.name = it.name || drug.name;
        }

        const created = await prescriptionModel.create(payload);
        res.status(201).json({ success: true, message: "Tạo đơn thuốc thành công", data: created });
    } catch (error) {
        res.status(500).json({ success: false, message: "Tạo đơn thuốc thất bại", error: error.message });
    }
};

export const getAllPrescriptions = async (req, res) => {
    try {
        const prescriptions = await prescriptionModel.find().sort({ prescription_id: -1 });
        res.status(200).json({ success: true, count: prescriptions.length, data: prescriptions });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lấy danh sách đơn thuốc thất bại", error: error.message });
    }
};

export const getPrescriptionById = async (req, res) => {
    try {
        const { id } = req.params;
        const p = await prescriptionModel.findOne({ prescription_id: Number(id) });
        if (!p) return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc" });
        res.status(200).json({ success: true, data: p });
    } catch (error) {
        res.status(500).json({ success: false, message: "Lấy đơn thuốc thất bại", error: error.message });
    }
};

export const updatePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await prescriptionModel.findOneAndUpdate({ prescription_id: Number(id) }, req.body, { new: true, runValidators: true });
        if (!updated) return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc" });
        res.status(200).json({ success: true, message: "Cập nhật đơn thuốc thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Cập nhật đơn thuốc thất bại", error: error.message });
    }
};

export const deletePrescription = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await prescriptionModel.findOneAndDelete({ prescription_id: Number(id) });
        if (!deleted) return res.status(404).json({ success: false, message: "Không tìm thấy đơn thuốc" });
        res.status(200).json({ success: true, message: "Xóa đơn thuốc thành công", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Xóa đơn thuốc thất bại", error: error.message });
    }
};
