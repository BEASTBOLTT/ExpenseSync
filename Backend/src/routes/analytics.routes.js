const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const analyticsController = require("../controllers/analytics.controller")

const router = express.Router()


/**
 * @desc Get Summary (total income, expense, net balance)
 * @route GET /api/analytics/summary
 * @access Private
 */
router.get("/summary", authMiddleware.authMiddleware, analyticsController.getSummary)


/**
 * @desc Get Spending Breakdown by Category
 * @route GET /api/analytics/by-category
 * @access Private
 */
router.get("/by-category", authMiddleware.authMiddleware, analyticsController.getByCategory)


/**
 * @desc Get Monthly Trends
 * @route GET /api/analytics/trends
 * @access Private
 */
router.get("/trends", authMiddleware.authMiddleware, analyticsController.getTrends)


module.exports = router
