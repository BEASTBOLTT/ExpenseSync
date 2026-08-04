const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const transactionController = require("../controllers/transaction.controller");




const router = express.Router();


/** 
 * @desc Create Transaction
 * @route POST /api/transactions/create-transaction
 * @access Public
 */
router.post("/create-transaction", authMiddleware.authMiddleware, transactionController.createTransaction)



/**
 * @desc Get Transactions
 * @route GET /api/transactions/get-transactions
 * @access Public
 */
router.get("/get-transaction/:transactionId", authMiddleware.authMiddleware, transactionController.getTransactions)


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