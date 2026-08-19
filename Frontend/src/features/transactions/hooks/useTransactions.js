import { useState, useCallback } from "react"
import { getAllTransactions } from "../services/transaction.api"

/**
 * Groups an array of transactions into an object keyed by human-readable date labels.
 * Keys: "Today", "Yesterday", or formatted date like "9 Aug".
 * Transactions must already be sorted descending by time.
 * @param {Array} transactions
 * @returns {Object}
 */
export function groupTransactionsByDate(transactions) {
    const groups = {}
    const now = new Date()
    const todayStr    = now.toDateString()
    const yesterdayDate = new Date(now)
    yesterdayDate.setDate(now.getDate() - 1)
    const yesterdayStr = yesterdayDate.toDateString()

    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]

    for (const tx of transactions) {
        const txDate = new Date(tx.time)
        const txDateStr = txDate.toDateString()

        let label
        if (txDateStr === todayStr) {
            label = "Today"
        } else if (txDateStr === yesterdayStr) {
            label = "Yesterday"
        } else {
            label = `${txDate.getDate()} ${monthNames[txDate.getMonth()]}`
        }

        if (!groups[label]) groups[label] = []
        groups[label].push(tx)
    }

    return groups
}

export const useTransactions = () => {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading]           = useState(false)
    const [filter, setFilter]             = useState("All")
    const [selectedMonth, setSelectedMonth] = useState(new Date())

    const fetchTransactions = useCallback(async (overrideFilter, overrideMonth) => {
        const activeFilter = overrideFilter ?? filter
        const activeMonth  = overrideMonth  ?? selectedMonth

        setLoading(true)
        try {
            const params = {}

            if (activeFilter === "Income")  params.type = "Credit"
            if (activeFilter === "Expense") params.type = "Debit"

            const start = new Date(activeMonth.getFullYear(), activeMonth.getMonth(), 1)
            const end   = new Date(activeMonth.getFullYear(), activeMonth.getMonth() + 1, 0, 23, 59, 59, 999)

            params.startDate = start.toISOString()
            params.endDate   = end.toISOString()

            const data = await getAllTransactions(params)
            if (data?.transactions) {
                setTransactions(data.transactions)
            } else {
                setTransactions([])
            }
        } catch (err) {
            console.error("Failed to fetch transactions:", err)
            setTransactions([])
        } finally {
            setLoading(false)
        }
    }, [filter, selectedMonth])

    return {
        transactions,
        loading,
        filter,
        setFilter,
        selectedMonth,
        setSelectedMonth,
        fetchTransactions
    }
}
