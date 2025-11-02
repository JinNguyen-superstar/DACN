import inventoryModel from "../models/inventoryModel.js";

// Thêm bản ghi kho (inventory)
export const addInventory = async (req, res) => {
    try {
        const newInventory = await inventoryModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "Thêm bản ghi kho thành công",
            data: newInventory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to add inventory",
            error: error.message,
        });
    }
};

// Lấy tất cả bản ghi kho
export const getAllInventories = async (req, res) => {
    try {
        const inventories = await inventoryModel.find().sort({ inventory_id: 1 });
        res.status(200).json({
            success: true,
            count: inventories.length,
            data: inventories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to get inventories",
            error: error.message,
        });
    }
};

// Lấy inventory theo ID (inventory_id)
export const getInventoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const inventory = await inventoryModel.findOne({ inventory_id: Number(id) });

        if (!inventory) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi kho" });
        }

    res.status(200).json({ success: true, data: inventory });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get inventory", error: error.message });
    }
};

// Lấy inventory theo medicine_id
export const getInventoriesByMedicine = async (req, res) => {
    try {
        const { medicineId } = req.params;
        const inventories = await inventoryModel.find({ medicine_id: Number(medicineId) });
    res.status(200).json({ success: true, count: inventories.length, data: inventories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to get inventories by medicine", error: error.message });
    }
};

// Tìm kiếm inventory theo tên hoặc batch_number
export const searchInventories = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ success: false, message: "Thiếu tham số truy vấn 'q'" });
        }

        const inventories = await inventoryModel.find({
            $or: [
                { name: { $regex: q, $options: "i" } },
                { batch_number: { $regex: q, $options: "i" } },
            ],
        });

    res.status(200).json({ success: true, count: inventories.length, data: inventories });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to search inventories", error: error.message });
    }
};

// Cập nhật inventory
export const updateInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await inventoryModel.findOneAndUpdate({ inventory_id: Number(id) }, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            return res.status(404).json({ success: false, message: "Inventory not found" });
        }

    res.status(200).json({ success: true, message: "Cập nhật bản ghi kho thành công", data: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to update inventory", error: error.message });
    }
};

// Xóa inventory
export const deleteInventory = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await inventoryModel.findOneAndDelete({ inventory_id: Number(id) });

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bản ghi kho" });
        }

    res.status(200).json({ success: true, message: "Xóa bản ghi kho thành công", data: deleted });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete inventory", error: error.message });
    }
};

// Xóa tất cả inventories (CHỈ DÙNG CHO DEVELOPMENT)
export const deleteAllInventories = async (req, res) => {
    try {
        const result = await inventoryModel.deleteMany({});
    res.status(200).json({ success: true, message: `Đã xóa ${result.deletedCount} bản ghi kho`, deletedCount: result.deletedCount });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to delete all inventories", error: error.message });
    }
};
