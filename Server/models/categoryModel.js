import mongoose from "mongoose";

/* Category model
    category_id - ID số tự động tăng (1, 2, 3...)
    name - tên danh mục
    description - mô tả danh mục
    createdAt - ngày tạo
    updatedAt - ngày cập nhật
 */
const categorySchema = new mongoose.Schema(
    {
        category_id: {
            type: Number,
            unique: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

// Auto-increment category_id trước khi save
categorySchema.pre("save", async function (next) {
    if (!this.category_id) {
        const lastCategory = await this.constructor
            .findOne({}, { category_id: 1 })
            .sort({ category_id: -1 });
        this.category_id = lastCategory ? lastCategory.category_id + 1 : 1;
    }
    next();
});

const categoryModel = mongoose.model("Category", categorySchema);

export default categoryModel;
