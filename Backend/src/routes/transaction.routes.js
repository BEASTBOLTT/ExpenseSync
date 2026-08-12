const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller");
const multer = require("multer")

const upload = multer({ storage: multer.memoryStorage() })



const router = express.Router();


/** 
 * @desc Create Transaction
 * @route POST /api/transactions/create-transaction
 * @access Public
 */
router.post("/create-transaction", authMiddleware.authMiddleware, upload.single("receipt"), transactionController.createTransaction)



/**
 * @desc Get Single Transaction
 * @route GET /api/transactions/get-transaction/:transactionId
 * @access Private
 */
router.get("/get-transaction/:transactionId", authMiddleware.authMiddleware, transactionController.getTransactions)


/**
 * @desc Get All Transactions
 * @route GET /api/transactions/get-all-transactions
 * @access Private
 * @query type, category, startDate, endDate (all optional)
 */
router.get("/get-all-transactions", authMiddleware.authMiddleware, transactionController.getAllTransactions)


/**
 * @desc Update Transaction
 * @route PUT /api/transactions/update-transaction/:transactionId
 * @access Public
 */
router.put("/update-transaction/:transactionId", authMiddleware.authMiddleware, transactionController.updateTransaction)

/**
 * @desc Delete Transaction
 * @route DELETE /api/transactions/delete-transaction/:transactionId
 * @access Public
 */
router.delete("/delete-transaction/:transactionId", authMiddleware.authMiddleware, transactionController.deleteTransaction)







module.exports = router