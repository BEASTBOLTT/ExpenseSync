const express = require("express")
const authMiddleware = require("../middlewares/auth.middleware")
const spaceController = require("../controllers/space.controller")
const multer = require("multer")

const upload = multer({ storage: multer.memoryStorage() })

const router = express.Router()




/**
 * @desc Create Space
 * @route POST /api/spaces
 * @access Private
 */
router.post("/", authMiddleware.authMiddleware, upload.single("coverImage"), spaceController.createSpace)

/**
 * @desc Get All Spaces (user is a member of)
 * @route GET /api/spaces
 * @access Private
 */
router.get("/", authMiddleware.authMiddleware, spaceController.getSpaces)

/**
 * @desc Get Single Space
 * @route GET /api/spaces/:spaceId
 * @access Private
 */
router.get("/:spaceId", authMiddleware.authMiddleware, spaceController.getSpace)

/**
 * @desc Update Space
 * @route PUT /api/spaces/:spaceId
 * @access Private (creator only)
 */
router.put("/:spaceId", authMiddleware.authMiddleware, upload.single("coverImage"), spaceController.updateSpace)

/**
 * @desc Delete Space
 * @route DELETE /api/spaces/:spaceId
 * @access Private (creator only)
 */
router.delete("/:spaceId", authMiddleware.authMiddleware, spaceController.deleteSpace)




/**
 * @desc Add Member to Space
 * @route POST /api/spaces/:spaceId/members
 * @access Private
 */
router.post("/:spaceId/members", authMiddleware.authMiddleware, spaceController.addMember)

/**
 * @desc Remove Member from Space
 * @route DELETE /api/spaces/:spaceId/members/:memberId
 * @access Private (creator only)
 */
router.delete("/:spaceId/members/:memberId", authMiddleware.authMiddleware, spaceController.removeMember)




/**
 * @desc Add Expense to Space
 * @route POST /api/spaces/:spaceId/expenses
 * @access Private
 */
router.post("/:spaceId/expenses", authMiddleware.authMiddleware, upload.single("receipt"), spaceController.addSpaceExpense)

/**
 * @desc Get All Expenses in a Space
 * @route GET /api/spaces/:spaceId/expenses
 * @access Private
 */
router.get("/:spaceId/expenses", authMiddleware.authMiddleware, spaceController.getSpaceExpenses)

/**
 * @desc Update Space Expense
 * @route PUT /api/spaces/:spaceId/expenses/:expenseId
 * @access Private
 */
router.put("/:spaceId/expenses/:expenseId", authMiddleware.authMiddleware, spaceController.updateSpaceExpense)

/**
 * @desc Delete Space Expense
 * @route DELETE /api/spaces/:spaceId/expenses/:expenseId
 * @access Private (creator only)
 */
router.delete("/:spaceId/expenses/:expenseId", authMiddleware.authMiddleware, spaceController.deleteSpaceExpense)




/**
 * @desc Get Raw Balances
 * @route GET /api/spaces/:spaceId/balances
 * @access Private
 */
router.get("/:spaceId/balances", authMiddleware.authMiddleware, spaceController.getBalances)

/**
 * @desc Get Simplified Balances (Minimum Transactions to Settle)
 * @route GET /api/spaces/:spaceId/simplified-balances
 * @access Private
 */
router.get("/:spaceId/simplified-balances", authMiddleware.authMiddleware, spaceController.getSimplifiedBalances)



/**
 * @desc Record a Settlement
 * @route POST /api/spaces/:spaceId/settle
 * @access Private
 */
router.post("/:spaceId/settle", authMiddleware.authMiddleware, spaceController.settleUp)

/**
 * @desc Get Settlement History
 * @route GET /api/spaces/:spaceId/settlements
 * @access Private
 */
router.get("/:spaceId/settlements", authMiddleware.authMiddleware, spaceController.getSettlements)


module.exports = router
