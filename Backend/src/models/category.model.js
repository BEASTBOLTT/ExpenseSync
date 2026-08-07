const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        trim: true
    },
    icon: {
        type: String,
        default: "📦"
    },
    type: {
        type: String,
        enum: ["income", "expense"],
        required: [true, "Category type is required"]
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
    }
}, {
    timestamps: true
})

const categoryModel = mongoose.model("Category", categorySchema)

module.exports = categoryModel
