const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const categoryController = require("../controllers/category.controller")

const router = express.Router()


/**
 * @desc Get All Categories
 * @route GET /api/categories
 * @access Private
 */
router.get("/", authMiddleware.authMiddleware, categoryController.getCategories)


/**
 * @desc Create Custom Category
 * @route POST /api/categories
 * @access Private
 */
router.post("/", authMiddleware.authMiddleware, categoryController.createCategory)


/**
 * @desc Update Custom Category
 * @route PUT /api/categories/:categoryId
 * @access Private
 */
router.put("/:categoryId", authMiddleware.authMiddleware, categoryController.updateCategory)


/**
 * @desc Delete Custom Category
 * @route DELETE /api/categories/:categoryId
 * @access Private
 */
router.delete("/:categoryId", authMiddleware.authMiddleware, categoryController.deleteCategory)


module.exports = router
