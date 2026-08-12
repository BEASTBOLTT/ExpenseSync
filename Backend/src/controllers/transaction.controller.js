const transactionModel = require("../models/transaction.model")
const accountModel = require("../models/account.model")
const uploadFile = require("../services/imgStorage.service")


/** 
 * @desc Create Transaction
 * @route POST /api/transactions
 * @access Public
 */
async function createTransaction(req, res) {
    const account = await accountModel.findOne({user: req.user._id})
    
        if (!account) {
            return res.status(404).json({
                message: "Account not found",
                status: "failed"
            })
        }

        const { type, category, time, amount, note } = req.body

        let receiptUrl = null
        if (req.file) {
            const image = await uploadFile(req.file.buffer)
            receiptUrl = image.url
        }

        const transaction = await transactionModel.create({
            account: account._id,
            type,
            category,
            amount,
            time,
            note,
            receiptUrl,
            source: { type: "personal" }
        })

        return res.status(201).json({
            message: "Transaction created successfully",
            status: "success",
            transaction: transaction
        })
}

/**
 * @desc Get Single Transaction
 * @route GET /api/transactions/get-transaction/:transactionId
 * @access Private
 */
async function getTransactions(req, res) {
    const transactionId = req.params.transactionId;
    const transaction = await transactionModel
        .findById(transactionId)
        .populate("category", "name icon")


    if (!transaction) {
        return res.status(404).json({
            message: "Transaction not found",
            status: "failed"
        })
    }

    return res.status(200).json({
        message: "Transaction fetched successfully",
        status: "success",
        transaction: transaction
    })
}


/**
 * @desc Get All Transactions
 * @route GET /api/transactions/get-all-transactions
 * @access Private
 */
async function getAllTransactions(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const { type, category, startDate, endDate } = req.query

    const filter = { account: account._id }

    if (type)     filter.type = type
    if (category) filter.category = category
    if (startDate || endDate) {
        filter.time = {}
        if (startDate) filter.time.$gte = new Date(startDate)
        if (endDate)   filter.time.$lte = new Date(endDate)
    }

    const transactions = await transactionModel
        .find(filter)
        .populate("category", "name icon")
        .sort({ time: -1 })

    return res.status(200).json({
        message: "Transactions fetched successfully",
        status: "success",
        count: transactions.length,
        transactions
    })
}


/**
 * @desc Update Transaction
 * @route PUT /api/transactions/:transactionId
 * @access Public
 */
async function updateTransaction(req, res) {
    const transactionId = req.params.transactionId;
    const transaction = await transactionModel.findById(transactionId)

    if (!transaction) {
        return res.status(404).json({
            message: "Transaction not found",
            status: "failed"
        })
    }

    const updatedTransaction = await transactionModel.findByIdAndUpdate(
        transactionId,
        {
            type:     req.body.type     ?? transaction.type,
            category: req.body.category ?? transaction.category,
            time:     req.body.time     ?? transaction.time,
            amount:   req.body.amount   ?? transaction.amount,
            note:     req.body.note     ?? transaction.note,
        },
        { returnDocument: 'after' }
    )

    return res.status(200).json({
        message: "Transaction updated successfully",
        status: "success",
        transaction: updatedTransaction
    })
}


/**
 * @desc Delete Transaction
 * @route DELETE /api/transactions/:transactionId
 * @access Public
 */
async function deleteTransaction(req, res) {
    const transactionId = req.params.transactionId;
    const deletedTransaction = await transactionModel.findByIdAndDelete(transactionId)

    if (!deletedTransaction) {
        return res.status(404).json({
            message: "Transaction not found",
            status: "failed"
        })
    }

    return res.status(200).json({
        message: "Transaction deleted successfully",
        status: "success",
        transaction: deletedTransaction
    })
}


module.exports = {
    createTransaction,
    getTransactions,
    getAllTransactions,
    updateTransaction,
    deleteTransaction
}