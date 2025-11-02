import { Router } from "express";
import {
    addCategory,
    getAllCategories,
    getCategoryById,
    getCategoryWithDrugCount,
    updateCategory,
    deleteCategory,
    deleteCategoryWithDrugs,
    searchCategories,
    deleteAllCategories,
} from "../controllers/categoriesControler.js";

const router = Router();

// Thêm category mới
router.post("/add", addCategory);

// Lấy tất cả categories
router.get("/", getAllCategories);

// Tìm kiếm category theo tên
router.get("/search", searchCategories);

// Lấy categories kèm số lượng drugs
router.get("/with-count", getCategoryWithDrugCount);

// Lấy category theo ID
router.get("/:id", getCategoryById);

// Cập nhật category
router.put("/:id", updateCategory);

// Xóa tất cả categories (DEVELOPMENT ONLY!)
router.delete("/all", deleteAllCategories);

// Xóa category (nếu không có drug nào dùng)
router.delete("/:id", deleteCategory);

// Xóa category và tất cả drugs liên quan (NGUY HIỂM!)
router.delete("/:id/force", deleteCategoryWithDrugs);

export default router;
