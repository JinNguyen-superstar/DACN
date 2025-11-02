import { Router } from "express";
import {
    addDrug,
    getAllDrugs,
    getDrugById,
    getDrugByCode,
    updateDrug,
    deleteDrug,
    searchDrugs,
    getDrugsByCategory,
    getLowStockDrugs,
    updateStock,
    deleteAllDrugs,
} from "../controllers/drugControler.js";

const router = Router();

// Thêm thuốc mới
router.post("/add", addDrug);

// Lấy tất cả thuốc
router.get("/", getAllDrugs);

// Tìm kiếm thuốc theo tên
router.get("/search", searchDrugs);

// Lấy thuốc sắp hết hàng
router.get("/low-stock", getLowStockDrugs);

// Lấy thuốc theo category
router.get("/category/:categoryId", getDrugsByCategory);

// Lấy thuốc theo mã thuốc
router.get("/code/:code", getDrugByCode);

// Lấy thuốc theo ID
router.get("/:id", getDrugById);

// Cập nhật thuốc
router.put("/:id", updateDrug);

// Cập nhật số lượng tồn kho
router.patch("/:id/stock", updateStock);

// Xóa tất cả drugs (DEVELOPMENT ONLY!)
router.delete("/all", deleteAllDrugs);

// Xóa thuốc
router.delete("/:id", deleteDrug);

export default router;
