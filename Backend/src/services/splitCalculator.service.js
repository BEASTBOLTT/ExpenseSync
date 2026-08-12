/**
 * @desc Split Calculator Service
 * Calculates each member's share of an expense based on the split type.
 * All calculations are done in paise (smallest unit) to avoid floating point errors,
 * then converted back. The rounding remainder is always absorbed by the first member.
 *
 * @param {Number} amount      - Total expense amount
 * @param {String} splitType   - "equal" | "exact" | "percentage" | "shares"
 * @param {Array}  members     - Array of { memberId, value? } objects
 * @returns {Array}            - Array of { memberId, amount } objects
 */

function equalSplit(amount, members) {
    const n        = members.length
    const totalPaise = Math.round(amount * 100)
    const basePaise  = Math.floor(totalPaise / n)
    const remainder  = totalPaise - basePaise * n

    return members.map((member, index) => ({
        memberId: member.memberId,
        amount: parseFloat(((basePaise + (index === 0 ? remainder : 0)) / 100).toFixed(2))
    }))
}




function exactSplit(amount, members) {
    const totalProvided = members.reduce((sum, m) => sum + m.value, 0)

    if (Math.round(totalProvided * 100) !== Math.round(amount * 100)) {
        const err = new Error(`Exact split amounts (${totalProvided}) do not sum to total amount (${amount})`)
        err.statusCode = 400
        throw err
    }

    return members.map(member => ({
        memberId: member.memberId,
        amount:   parseFloat(member.value.toFixed(2))
    }))
}




function percentageSplit(amount, members) {
    const totalPercent = members.reduce((sum, m) => sum + m.value, 0)

    if (Math.round(totalPercent) !== 100) {
        const err = new Error(`Percentages must sum to 100, got ${totalPercent}`)
        err.statusCode = 400
        throw err
    }

    const totalPaise = Math.round(amount * 100)
    const paises     = members.map(m => Math.floor((m.value / 100) * totalPaise))
    const remainder  = totalPaise - paises.reduce((sum, p) => sum + p, 0)
    paises[0]       += remainder

    return members.map((member, index) => ({
        memberId: member.memberId,
        amount:   parseFloat((paises[index] / 100).toFixed(2))
    }))
}




function sharesSplit(amount, members) {
    const totalShares = members.reduce((sum, m) => sum + m.value, 0)

    if (totalShares <= 0) {
        const err = new Error("Total shares must be greater than 0")
        err.statusCode = 400
        throw err
    }

    const totalPaise = Math.round(amount * 100)
    const paises     = members.map(m => Math.floor((m.value / totalShares) * totalPaise))
    const remainder  = totalPaise - paises.reduce((sum, p) => sum + p, 0)
    paises[0]       += remainder

    return members.map((member, index) => ({
        memberId: member.memberId,
        amount:   parseFloat((paises[index] / 100).toFixed(2))
    }))
}





function calculateSplits(amount, splitType, members) {
    switch (splitType) {
        case "equal": return equalSplit(amount, members)
        case "exact": return exactSplit(amount, members)
        case "percentage": return percentageSplit(amount, members)
        case "shares": return sharesSplit(amount, members)
        default: {
            const err = new Error("Invalid split type")
            err.statusCode = 400
            throw err
        }
    }
}



module.exports = { calculateSplits }
