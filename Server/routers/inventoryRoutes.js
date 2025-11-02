import { Router } from "express";
import {
    addInventory,
    getAllInventories,
    getInventoryById,
    getInventoriesByMedicine,
    searchInventories,
    updateInventory,
    deleteInventory,
    deleteAllInventories,
} from "../controllers/inventoryController.js";

const router = Router();

// Thêm inventory
router.post("/add", addInventory);

// Lấy tất cả
router.get("/", getAllInventories);

// Tìm kiếm
router.get("/search", searchInventories);

// Lấy theo medicine_id
router.get("/medicine/:medicineId", getInventoriesByMedicine);

// Lấy theo inventory_id
router.get("/:id", getInventoryById);

// Cập nhật
router.put("/:id", updateInventory);

// Xóa tất cả (DEV)
router.delete("/all", deleteAllInventories);

// Xóa theo id
router.delete("/:id", deleteInventory);

export default router;
