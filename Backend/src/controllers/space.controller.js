const accountModel = require("../models/account.model")
const transactionModel = require("../models/transaction.model")
const { spaceModel, spaceExpenseModel, settlementModel } = require("../models/space.models")
const { calculateSplits } = require("../services/splitCalculator.service")
const { simplifyDebts } = require("../services/debtSimplifier.service")
const uploadFile = require("../services/imgStorage.service")




/**
 * @desc Create Space
 * @route POST /api/spaces
 * @access Private
 */
async function createSpace(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const { name, type, icon } = req.body

    let coverImageUrl = null
    if (req.file) {
        const image = await uploadFile(req.file.buffer)
        coverImageUrl = image.url
    }

    const space = await spaceModel.create({
        name,
        type,
        icon: icon || "📦",
        coverImage: coverImageUrl,
        createdBy: account._id,
        members: [{
            accountId: account._id,
            name:      account.name,
            isMock:    false
        }]
    })

    return res.status(201).json({
        message: "Space created successfully",
        status: "success",
        space
    })
}


/**
 * @desc Get All Spaces (that the user is a member of) — with current user's balance per space
 * @route GET /api/spaces
 * @access Private
 */
async function getSpaces(req, res) {
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const spaces = await spaceModel.find({
        "members.accountId": account._id
    }).sort({ createdAt: -1 })

    if (spaces.length === 0) {
        return res.status(200).json({
            message: "Spaces fetched successfully",
            status: "success",
            count: 0,
            spaces: []
        })
    }

    const spaceIds = spaces.map(s => s._id)

    // Bulk fetch expenses + settlements for ALL spaces in one round-trip each
    const [ allExpenses, allSettlements ] = await Promise.all([
        spaceExpenseModel.find({ spaceId: { $in: spaceIds } }),
        settlementModel.find({ spaceId: { $in: spaceIds } })
    ])

    const spacesWithBalance = spaces.map(space => {
        // Find this user's member document inside the space
        const myMember = space.members.find(
            m => m.accountId?.toString() === account._id.toString()
        )

        if (!myMember) {
            return { ...space.toObject(), userBalance: { netBalance: 0, status: "settled" } }
        }

        const myMemberId = myMember._id.toString()

        const spaceExpenses    = allExpenses.filter(e => e.spaceId.toString() === space._id.toString())
        const spaceSettlements = allSettlements.filter(s => s.spaceId.toString() === space._id.toString())

        let net = 0

        for (const expense of spaceExpenses) {
            // Positive: I paid for this expense
            if (expense.paidBy.toString() === myMemberId) net += expense.amount
            // Negative: my share of this expense
            for (const split of expense.splits) {
                if (split.memberId.toString() === myMemberId) net -= split.amount
            }
        }

        for (const settlement of spaceSettlements) {
            // I received money (someone paid me back)
            if (settlement.toMember.toString() === myMemberId)   net += settlement.amount
            // I paid money (I settled with someone)
            if (settlement.fromMember.toString() === myMemberId) net -= settlement.amount
        }

        net = Math.round(net * 100) / 100

        return {
            ...space.toObject(),
            userBalance: {
                netBalance: Math.abs(net),
                status: net > 0 ? "get" : net < 0 ? "owe" : "settled"
            }
        }
    })

    return res.status(200).json({
        message: "Spaces fetched successfully",
        status: "success",
        count: spacesWithBalance.length,
        spaces: spacesWithBalance
    })
}


/**
 * @desc Get Single Space
 * @route GET /api/spaces/:spaceId
 * @access Private
 */
async function getSpace(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    return res.status(200).json({
        message: "Space fetched successfully",
        status: "success",
        space
    })
}


/**
 * @desc Update Space
 * @route PUT /api/spaces/:spaceId
 * @access Private (creator only)
 */
async function updateSpace(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    if (space.createdBy.toString() !== account._id.toString()) {
        return res.status(403).json({
            message: "Only the creator can update this space",
            status: "failed"
        })
    }

    let coverImageUrl = space.coverImage
    if (req.file) {
        const image = await uploadFile(req.file.buffer)
        coverImageUrl = image.url
    }

    const updatedSpace = await spaceModel.findByIdAndUpdate(
        spaceId,
        {
            name:       req.body.name ?? space.name,
            type:       req.body.type ?? space.type,
            coverImage: coverImageUrl,
        },
        { returnDocument: "after" }
    )

    return res.status(200).json({
        message: "Space updated successfully",
        status: "success",
        space: updatedSpace
    })
}


/**
 * @desc Delete Space
 * @route DELETE /api/spaces/:spaceId
 * @access Private (creator only)
 */
async function deleteSpace(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    if (space.createdBy.toString() !== account._id.toString()) {
        return res.status(403).json({
            message: "Only the creator can delete this space",
            status: "failed"
        })
    }

    await spaceModel.findByIdAndDelete(spaceId)
    await spaceExpenseModel.deleteMany({ spaceId })
    await settlementModel.deleteMany({ spaceId })

    return res.status(200).json({
        message: "Space deleted successfully",
        status: "success"
    })
}



/**
 * @desc Add Member to Space (real or mock)
 * @route POST /api/spaces/:spaceId/members
 * @access Private
 * @body { name, isMock, email? }
 *   - isMock: true  → only name required
 *   - isMock: false → email required to look up the account
 */
async function addMember(req, res) {
    const { spaceId } = req.params
    const { name, isMock, email } = req.body

    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    
    if (isMock === true || isMock === "true") {
        space.members.push({ name, isMock: true, accountId: null })
        await space.save()

        return res.status(201).json({
            message: "Mock member added successfully",
            status: "success",
            space
        })
    }

    
    if (!email) {
        return res.status(400).json({
            message: "Email is required to add a real member",
            status: "failed"
        })
    }

    const memberAccount = await accountModel.findOne({ email })

    if (!memberAccount) {
        return res.status(404).json({
            message: "No account found with that email",
            status: "failed"
        })
    }

    const alreadyMember = space.members.some(
        m => m.accountId?.toString() === memberAccount._id.toString()
    )

    if (alreadyMember) {
        return res.status(422).json({
            message: "This user is already a member of the space",
            status: "failed"
        })
    }

    space.members.push({
        accountId: memberAccount._id,
        name:      memberAccount.name,
        isMock:    false
    })

    await space.save()

    return res.status(201).json({
        message: "Member added successfully",
        status: "success",
        space
    })
}


/**
 * @desc Remove Member from Space
 * @route DELETE /api/spaces/:spaceId/members/:memberId
 * @access Private (creator only)
 */
async function removeMember(req, res) {
    const { spaceId, memberId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    if (space.createdBy.toString() !== account._id.toString()) {
        return res.status(403).json({
            message: "Only the creator can remove members",
            status: "failed"
        })
    }

    const member = space.members.id(memberId)

    if (!member) {
        return res.status(404).json({
            message: "Member not found in this space",
            status: "failed"
        })
    }

    if (member.accountId?.toString() === space.createdBy.toString()) {
        return res.status(403).json({
            message: "The creator cannot be removed from the space",
            status: "failed"
        })
    }

    // Block removal if the member has splits in any expense
    // Removing them would cause their old memberId to become orphaned,
    // breaking balance calculations
    const hasSplits = await spaceExpenseModel.exists({
        spaceId,
        "splits.memberId": member._id
    })

    if (hasSplits) {
        return res.status(422).json({
            message: "Cannot remove a member who has existing expense splits. Settle all debts first.",
            status: "failed"
        })
    }

    member.deleteOne()
    await space.save()

    return res.status(200).json({
        message: "Member removed successfully",
        status: "success",
        space
    })
}




/**
 * @desc Add Expense to Space
 * @route POST /api/spaces/:spaceId/expenses
 * @access Private
 */
async function addSpaceExpense(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const { paidBy, amount, description, category, date, splitType } = req.body
    const members = typeof req.body.members === "string"
        ? JSON.parse(req.body.members)
        : req.body.members


    const paidByMember = space.members.id(paidBy)

    if (!paidByMember) {
        return res.status(404).json({
            message: "paidBy member not found in this space",
            status: "failed"
        })
    }

    const splits = calculateSplits(amount, splitType, members)

    let receiptUrl = null
    if (req.file) {
        const image = await uploadFile(req.file.buffer)
        receiptUrl = image.url
    }

    const spaceExpense = await spaceExpenseModel.create({
        spaceId,
        createdBy: account._id,
        paidBy,
        amount,
        description,
        category,
        date,
        receiptUrl,
        splitType,
        splits
    })

    
    for (const split of splits) {
        const member = space.members.id(split.memberId)

        if (!member || member.isMock || !member.accountId) continue

        const memberAccount = await accountModel.findById(member.accountId)

        if (!memberAccount) continue

        await transactionModel.create({
            account:  memberAccount._id,
            type:     "Debit",
            category: category,
            amount:   split.amount,
            time:     date,
            note:     description,
            source: {
                type:           "space",
                spaceId:        space._id,
                spaceExpenseId: spaceExpense._id
            }
        })
    }

    return res.status(201).json({
        message: "Space expense added successfully",
        status: "success",
        spaceExpense
    })
}


/**
 * @desc Get All Expenses in a Space
 * @route GET /api/spaces/:spaceId/expenses
 * @access Private
 */
async function getSpaceExpenses(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const expenses = await spaceExpenseModel
        .find({ spaceId })
        .populate("category", "name icon")
        .sort({ date: -1 })

    const expensesWithPermissions = expenses.map(expense => ({
        ...expense.toObject(),
        canManage: expense.createdBy
            ? expense.createdBy.toString() === account._id.toString()
            : space.createdBy.toString() === account._id.toString()
    }))

    return res.status(200).json({
        message: "Space expenses fetched successfully",
        status: "success",
        count: expensesWithPermissions.length,
        expenses: expensesWithPermissions
    })
}


/**
 * @desc Update Space Expense (creator only, non-financial fields)
 * @route PUT /api/spaces/:spaceId/expenses/:expenseId
 * @access Private
 */
async function updateSpaceExpense(req, res) {
    const { spaceId, expenseId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const expense = await spaceExpenseModel.findById(expenseId)

    if (!expense || expense.spaceId.toString() !== spaceId) {
        return res.status(404).json({
            message: "Space expense not found",
            status: "failed"
        })
    }

    const isCreator = expense.createdBy
        ? expense.createdBy.toString() === account._id.toString()
        : space.createdBy.toString() === account._id.toString()

    if (!isCreator) {
        return res.status(403).json({
            message: "Only the expense creator can update this space expense",
            status: "failed"
        })
    }

    let receiptUrl = expense.receiptUrl
    if (req.file) {
        const image = await uploadFile(req.file.buffer)
        receiptUrl = image.url
    }

    const updatedExpense = await spaceExpenseModel.findByIdAndUpdate(
        expenseId,
        {
            description: req.body.description ?? expense.description,
            category: req.body.category ?? expense.category,
            date: req.body.date ?? expense.date,
            receiptUrl,
        },
        { returnDocument: "after" }
    )

    await transactionModel.updateMany(
        { "source.spaceExpenseId": expense._id },
        {
            category: updatedExpense.category,
            time:     updatedExpense.date,
            note:     updatedExpense.description
        }
    )

    return res.status(200).json({
        message: "Space expense updated successfully",
        status: "success",
        expense: updatedExpense
    })
}


/**
 * @desc Delete Space Expense
 * @route DELETE /api/spaces/:spaceId/expenses/:expenseId
 * @access Private
 */
async function deleteSpaceExpense(req, res) {
    const { spaceId, expenseId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const expense = await spaceExpenseModel.findById(expenseId)

    if (!expense || expense.spaceId.toString() !== spaceId) {
        return res.status(404).json({
            message: "Space expense not found",
            status: "failed"
        })
    }

    const isCreator = expense.createdBy
        ? expense.createdBy.toString() === account._id.toString()
        : space.createdBy.toString() === account._id.toString()

    if (!isCreator) {
        return res.status(403).json({
            message: "Only the expense creator can delete this space expense",
            status: "failed"
        })
    }

    await expense.deleteOne()

    // Remove auto-posted personal transactions linked to this expense
    await transactionModel.deleteMany({
        "source.spaceExpenseId": expense._id
    })

    return res.status(200).json({
        message: "Space expense deleted successfully",
        status: "success"
    })
}





/**
 * @desc Get Raw Balances for a Space
 * @route GET /api/spaces/:spaceId/balances
 * @access Private
 */
async function getBalances(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const expenses    = await spaceExpenseModel.find({ spaceId })
    const settlements = await settlementModel.find({ spaceId })

    const balanceMap = {}
    for (const member of space.members) {
        balanceMap[member._id.toString()] = {
            memberId:   member._id,
            name:       member.name,
            isMock:     member.isMock,
            netBalance: 0
        }
    }

    
    for (const expense of expenses) {
        const payerId = expense.paidBy.toString()
        if (balanceMap[payerId]) {
            balanceMap[payerId].netBalance += expense.amount
        }

        for (const split of expense.splits) {
            const memberId = split.memberId.toString()
            if (balanceMap[memberId]) {
                balanceMap[memberId].netBalance -= split.amount
            }
        }
    }

    
    for (const settlement of settlements) {
        const fromId = settlement.fromMember.toString()
        const toId   = settlement.toMember.toString()

        if (balanceMap[fromId]) balanceMap[fromId].netBalance += settlement.amount
        if (balanceMap[toId])   balanceMap[toId].netBalance   -= settlement.amount
    }

    
    const balances = Object.values(balanceMap).map(b => ({
        ...b,
        netBalance: Math.round(b.netBalance * 100) / 100
    }))

    return res.status(200).json({
        message: "Balances fetched successfully",
        status: "success",
        balances
    })
}


/**
 * @desc Get Simplified Balances (Minimum Transactions to Settle)
 * @route GET /api/spaces/:spaceId/simplified-balances
 * @access Private
 */
async function getSimplifiedBalances(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const expenses    = await spaceExpenseModel.find({ spaceId })
    const settlements = await settlementModel.find({ spaceId })


    const balanceMap = {}
    for (const member of space.members) {
        balanceMap[member._id.toString()] = {
            memberId:   member._id,
            name:       member.name,
            isMock:     member.isMock,
            netBalance: 0
        }
    }

    for (const expense of expenses) {
        const payerId = expense.paidBy.toString()
        if (balanceMap[payerId]) {
            balanceMap[payerId].netBalance += expense.amount
        }

        for (const split of expense.splits) {
            const memberId = split.memberId.toString()
            if (balanceMap[memberId]) {
                balanceMap[memberId].netBalance -= split.amount
            }
        }
    }

    for (const settlement of settlements) {
        const fromId = settlement.fromMember.toString()
        const toId   = settlement.toMember.toString()

        if (balanceMap[fromId]) balanceMap[fromId].netBalance += settlement.amount
        if (balanceMap[toId])   balanceMap[toId].netBalance   -= settlement.amount
    }

    const balances = Object.values(balanceMap).map(b => ({
        ...b,
        netBalance: Math.round(b.netBalance * 100) / 100
    }))


    const transactions = simplifyDebts(balances)

    return res.status(200).json({
        message: "Simplified balances fetched successfully",
        status: "success",
        transactions
    })
}





/**
 * @desc Record a Settlement between two members
 * @route POST /api/spaces/:spaceId/settle
 * @access Private
 */
async function settleUp(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const { fromMember, toMember, amount, note } = req.body

    const fromExists = space.members.id(fromMember)
    const toExists   = space.members.id(toMember)

    if (!fromExists || !toExists) {
        return res.status(404).json({
            message: "One or both members not found in this space",
            status: "failed"
        })
    }

    if (fromMember === toMember) {
        return res.status(400).json({
            message: "fromMember and toMember cannot be the same",
            status: "failed"
        })
    }

    const settlement = await settlementModel.create({
        spaceId,
        fromMember,
        toMember,
        amount,
        note: note || null
    })

    return res.status(201).json({
        message: "Settlement recorded successfully",
        status: "success",
        settlement
    })
}


/**
 * @desc Get Settlement History for a Space
 * @route GET /api/spaces/:spaceId/settlements
 * @access Private
 */
async function getSettlements(req, res) {
    const { spaceId } = req.params
    const account = await accountModel.findOne({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    const space = await spaceModel.findById(spaceId)

    if (!space) {
        return res.status(404).json({
            message: "Space not found",
            status: "failed"
        })
    }

    const isMember = space.members.some(
        m => m.accountId?.toString() === account._id.toString()
    )

    if (!isMember) {
        return res.status(403).json({
            message: "You are not a member of this space",
            status: "failed"
        })
    }

    const settlements = await settlementModel.find({ spaceId }).sort({ date: -1 })


    const settlementsWithNames = settlements.map(s => {
        const from = space.members.id(s.fromMember)
        const to   = space.members.id(s.toMember)

        return {
            _id:        s._id,
            amount:     s.amount,
            note:       s.note,
            date:       s.date,
            fromMember: { memberId: s.fromMember, name: from?.name || "Unknown" },
            toMember:   { memberId: s.toMember,   name: to?.name   || "Unknown" }
        }
    })

    return res.status(200).json({
        message: "Settlements fetched successfully",
        status: "success",
        count: settlementsWithNames.length,
        settlements: settlementsWithNames
    })
}


module.exports = {
    createSpace,
    getSpaces,
    getSpace,
    updateSpace,
    deleteSpace,
    addMember,
    removeMember,
    addSpaceExpense,
    getSpaceExpenses,
    updateSpaceExpense,
    deleteSpaceExpense,
    getBalances,
    getSimplifiedBalances,
    settleUp,
    getSettlements
}
