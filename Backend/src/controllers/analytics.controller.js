const accountModel = require("../models/account.model")
const transactionModel = require("../models/transaction.model")


/**
 * @desc Get Summary (total income, total expense, net balance)
 * @route GET /api/analytics/summary
 * @access Private
 * @query startDate, endDate, source (personal | space)
 */
async function getSummary(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const { startDate, endDate, source } = req.query

    const match = { account: account._id }

    if (startDate || endDate) {
        match.time = {}
        if (startDate) match.time.$gte = new Date(startDate)
        if (endDate)   match.time.$lte = new Date(endDate)
    }

    if (source) match["source.type"] = source

    const result = await transactionModel.aggregate([
        { $match: match },
        {
            $group: {
                _id:   "$type",
                total: { $sum: "$amount" }
            }
        }
    ])

    let totalIncome  = 0
    let totalExpense = 0

    for (const entry of result) {
        if (entry._id === "Credit") totalIncome  = entry.total
        if (entry._id === "Debit")  totalExpense = entry.total
    }

    const netBalance = Math.round((totalIncome - totalExpense) * 100) / 100

    return res.status(200).json({
        message: "Summary fetched successfully",
        status: "success",
        summary: {
            totalIncome:  Math.round(totalIncome  * 100) / 100,
            totalExpense: Math.round(totalExpense * 100) / 100,
            netBalance
        }
    })
}


/**
 * @desc Get Spending by Category
 * @route GET /api/analytics/by-category
 * @access Private
 * @query startDate, endDate, type (Debit | Credit) — defaults to Debit
 */
async function getByCategory(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const { startDate, endDate, type = "Debit" } = req.query

    const match = { account: account._id, type }

    if (startDate || endDate) {
        match.time = {}
        if (startDate) match.time.$gte = new Date(startDate)
        if (endDate)   match.time.$lte = new Date(endDate)
    }

    const result = await transactionModel.aggregate([
        { $match: match },
        {
            $group: {
                _id:   "$category",
                total: { $sum: "$amount" },
                count: { $sum: 1 }
            }
        },
        {
            $lookup: {
                from:         "categories",
                localField:   "_id",
                foreignField: "_id",
                as:           "category"
            }
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },

        {
            $project: {
                _id:   0,
                total: 1,
                count: 1,
                category: {
                    _id:  "$category._id",
                    name: "$category.name",
                    icon: "$category.icon"
                }
            }
        },
        { $sort: { total: -1 } }
    ])

    return res.status(200).json({
        message: "Category breakdown fetched successfully",
        status: "success",
        breakdown: result
    })
}


/**
 * @desc Get Monthly Trends (income + expense per month)
 * @route GET /api/analytics/trends
 * @access Private
 * @query months (default: 6), source (personal | space)
 */
async function getTrends(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const months = parseInt(req.query.months) || 6
    const source = req.query.source

    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - (months - 1))
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const match = {
        account: account._id,
        time:    { $gte: startDate }
    }

    if (source) match["source.type"] = source

    const result = await transactionModel.aggregate([
        { $match: match },
        {
            $group: {
                _id: {
                    year:  { $year:  "$time" },
                    month: { $month: "$time" },
                    type:  "$type"
                },
                total: { $sum: "$amount" }
            }
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }
    ])

    // Reshape into a clean array: [{ year, month, income, expense }]
    const monthMap = {}

    for (const entry of result) {
        const key = `${entry._id.year}-${String(entry._id.month).padStart(2, "0")}`

        if (!monthMap[key]) {
            monthMap[key] = { year: entry._id.year, month: entry._id.month, income: 0, expense: 0 }
        }

        if (entry._id.type === "Credit") monthMap[key].income  = Math.round(entry.total * 100) / 100
        if (entry._id.type === "Debit")  monthMap[key].expense = Math.round(entry.total * 100) / 100
    }

    const trends = Object.values(monthMap)

    return res.status(200).json({
        message: "Trends fetched successfully",
        status: "success",
        months,
        trends
    })
}


module.exports = { getSummary, getByCategory, getTrends }
