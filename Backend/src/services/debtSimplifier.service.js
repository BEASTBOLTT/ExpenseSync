/**
 * @desc Debt Simplification Service (Cash Flow Minimization)
 * Given an array of net balances per member, computes the minimum number
 * of transactions needed to settle all debts in the group.
 *
 * Algorithm: Greedy matching of largest debtor with largest creditor.
 * Time complexity: O(n²) — efficient enough for typical group sizes.
 *
 * @param  {Array} balances  - Array of { memberId, name, netBalance }
 *                             netBalance > 0 = is owed, < 0 = owes
 * @returns {Array}          - Array of { from: { memberId, name }, to: { memberId, name }, amount }
 */
function simplifyDebts(balances) {

    
    const EPSILON = 0.001

    const creditors = balances
        .filter(b => b.netBalance > EPSILON)
        .map(b => ({ ...b }))
        .sort((a, b) => b.netBalance - a.netBalance)   // largest credit first

    const debtors = balances
        .filter(b => b.netBalance < -EPSILON)
        .map(b => ({ ...b }))
        .sort((a, b) => a.netBalance - b.netBalance)   // largest debt first (most negative)

    const transactions = []

    while (debtors.length > 0 && creditors.length > 0) {
        const debtor   = debtors[0]
        const creditor = creditors[0]

        
        const amount = Math.round(
            Math.min(Math.abs(debtor.netBalance), creditor.netBalance) * 100
        ) / 100

        if (amount > 0) {
            transactions.push({
                from:   { memberId: debtor.memberId,   name: debtor.name },
                to:     { memberId: creditor.memberId, name: creditor.name },
                amount
            })
        }

        debtor.netBalance   += amount
        creditor.netBalance -= amount

        if (Math.abs(debtor.netBalance)   < EPSILON) debtors.shift()
        if (Math.abs(creditor.netBalance) < EPSILON) creditors.shift()
    }

    return transactions
}

module.exports = { simplifyDebts }
