const categoryModel = require("../models/category.model")


/**
 * @desc Get All Categories (defaults + user's own)
 * @route GET /api/categories
 * @access Private
 */
async function getCategories(req, res) {
    const { type } = req.query

    const filter = {
        $or: [
            { isDefault: true },
            { userId: req.user._id }
        ]
    }

    if (type) filter.type = type

    const categories = await categoryModel.find(filter).sort({ isDefault: -1, name: 1 })

    return res.status(200).json({
        message: "Categories fetched successfully",
        status: "success",
        count: categories.length,
        categories
    })
}


/**
 * @desc Create Custom Category
 * @route POST /api/categories
 * @access Private
 */
async function createCategory(req, res) {
    const { name, icon, type } = req.body

    const isExists = await categoryModel.findOne({
        name: name,
        userId: req.user._id
    })

    if (isExists) {
        return res.status(422).json({
            message: "Category with this name already exists",
            status: "failed"
        })
    }

    const category = await categoryModel.create({
        name,
        icon,
        type,
        isDefault: false,
        userId: req.user._id
    })

    return res.status(201).json({
        message: "Category created successfully",
        status: "success",
        category
    })
}


/**
 * @desc Update Custom Category
 * @route PUT /api/categories/:categoryId
 * @access Private
 */
async function updateCategory(req, res) {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
            status: "failed"
        })
    }

    if (category.isDefault) {
        return res.status(403).json({
            message: "Default categories cannot be modified",
            status: "failed"
        })
    }

    if (category.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not authorized to update this category",
            status: "failed"
        })
    }

    const updatedCategory = await categoryModel.findByIdAndUpdate(
        categoryId,
        {
            name:  req.body.name  ?? category.name,
            icon:  req.body.icon  ?? category.icon,
            type:  req.body.type  ?? category.type,
        },
        { returnDocument: 'after' }
    )

    return res.status(200).json({
        message: "Category updated successfully",
        status: "success",
        category: updatedCategory
    })
}


/**
 * @desc Delete Custom Category
 * @route DELETE /api/categories/:categoryId
 * @access Private
 */
async function deleteCategory(req, res) {
    const { categoryId } = req.params
    const category = await categoryModel.findById(categoryId)

    if (!category) {
        return res.status(404).json({
            message: "Category not found",
            status: "failed"
        })
    }

    if (category.isDefault) {
        return res.status(403).json({
            message: "Default categories cannot be deleted",
            status: "failed"
        })
    }

    if (category.userId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
            message: "You are not authorized to delete this category",
            status: "failed"
        })
    }

    await categoryModel.findByIdAndDelete(categoryId)

    return res.status(200).json({
        message: "Category deleted successfully",
        status: "success"
    })
}


module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
}
