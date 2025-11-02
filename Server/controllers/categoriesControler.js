import categoryModel from "../models/categoryModel.js";
import drugModel from "../models/drugModel.js";
import mongoose from "mongoose";

// Thêm category mới
export const addCategory = async (req, res) => {
    try {
        const newCategory = await categoryModel.create(req.body);
        res.status(201).json({
            success: true,
            message: "Thêm danh mục thành công",
            data: newCategory,
        });
    } catch (error) {
        // Xử lý lỗi duplicate name
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục đã tồn tại",
            });
        }
        res.status(500).json({
            success: false,
            message: "Thêm danh mục thất bại",
            error: error.message,
        });
    }
};

// Lấy tất cả categories
export const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryModel.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục thất bại",
            error: error.message,
        });
    }
};

// Lấy category theo ID
export const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findOne({
            category_id: Number(id),
        });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại",
            });
        }

        res.status(200).json({
            success: true,
            data: category,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục thất bại",
            error: error.message,
        });
    }
};

// Lấy category kèm số lượng drugs
export const getCategoryWithDrugCount = async (req, res) => {
    try {
        const categories = await categoryModel.aggregate([
            {
                $lookup: {
                    from: "drugs", // Collection name trong MongoDB
                    localField: "_id",
                    foreignField: "category_id",
                    as: "drugs",
                },
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    drugCount: { $size: "$drugs" },
                },
            },
            {
                $sort: { createdAt: -1 },
            },
        ]);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Lấy danh mục thất bại",
            error: error.message,
        });
    }
};

// Cập nhật category
export const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedCategory = await categoryModel.findOneAndUpdate(
            { category_id: Number(id) },
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!updatedCategory) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại",
            });
        }

        res.status(200).json({
            success: true,
            message: "Cập nhật danh mục thành công",
            data: updatedCategory,
        });
    } catch (error) {
        // Xử lý lỗi duplicate name
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "Tên danh mục đã tồn tại",
            });
        }
        res.status(500).json({
            success: false,
            message: "Cập nhật danh mục thất bại",
            error: error.message,
        });
    }
};

// Xóa category
export const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        // Kiểm tra xem có drug nào đang dùng category này không
        const drugsWithCategory = await drugModel.countDocuments({
            category_id: Number(id),
        });

        if (drugsWithCategory > 0) {
            return res.status(400).json({
                success: false,
                message: `Cannot delete category. ${drugsWithCategory} drug(s) are using this category`,
                drugCount: drugsWithCategory,
            });
        }

        const deletedCategory = await categoryModel.findOneAndDelete({
            category_id: Number(id),
        });

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Danh mục không tồn tại",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data: deletedCategory,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message,
        });
    }
};

// Xóa category và tất cả drugs liên quan
export const deleteCategoryWithDrugs = async (req, res) => {
    try {
        const { id } = req.params;

        // Đếm số drugs sẽ bị xóa
        const drugCount = await drugModel.countDocuments({
            category_id: Number(id),
        });

        // Xóa tất cả drugs thuộc category này
        await drugModel.deleteMany({ category_id: Number(id) });

        // Xóa category
        const deletedCategory = await categoryModel.findOneAndDelete({
            category_id: Number(id),
        });

        if (!deletedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "Category and associated drugs deleted successfully",
            data: {
                category: deletedCategory,
                deletedDrugsCount: drugCount,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete category with drugs",
            error: error.message,
        });
    }
};

// Tìm kiếm category theo tên
export const searchCategories = async (req, res) => {
    try {
        const { name } = req.query;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Search name is required",
            });
        }

        const categories = await categoryModel.find({
            name: { $regex: name, $options: "i" },
        });

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to search categories",
            error: error.message,
        });
    }
};

// Xóa tất cả categories (CHỈ DÙNG CHO DEVELOPMENT!)
export const deleteAllCategories = async (req, res) => {
    try {
        const result = await categoryModel.deleteMany({});
        res.status(200).json({
            success: true,
            message: `Deleted ${result.deletedCount} categories`,
            deletedCount: result.deletedCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete all categories",
            error: error.message,
        });
    }
};
