import { useState, useEffect, useCallback } from "react"
import { getSummary, getRecentTransactions, getSpaces } from "../services/home.api"

export const useHome = () => {

    const [summary, setSummary] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [spaces, setSpaces] = useState([])
    const [loading, setLoading] = useState(true)
    // "all" = all-time balance (default), "month" = current month only
    const [balanceMode, setBalanceMode] = useState("all")

    const fetchSummary = useCallback(async (mode) => {
        const activeMode = mode ?? balanceMode
        let params = {}

        if (activeMode === "month") {
            const now = new Date()
            const start = new Date(now.getFullYear(), now.getMonth(), 1)
            start.setHours(0, 0, 0, 0)
            const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            end.setHours(23, 59, 59, 999)
            params = { startDate: start.toISOString(), endDate: end.toISOString() }
        }

        const summaryData = await getSummary(params)
        if (summaryData?.summary) setSummary(summaryData.summary)
    }, [balanceMode])

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [summaryData, txData, spacesData] = await Promise.all([
                getSummary(), // always all-time on initial load
                getRecentTransactions(5),
                getSpaces()
            ])

            if (summaryData?.summary) setSummary(summaryData.summary)
            if (txData?.transactions)  setTransactions(txData.transactions)
            if (spacesData?.spaces)    setSpaces(spacesData.spaces)
        } catch (err) {
            console.error("Error loading home data:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchAll()
    }, [fetchAll])

    return {
        summary,
        transactions,
        spaces,
        loading,
        balanceMode,
        setBalanceMode,
        fetchSummary,
        refetch: fetchAll
    }
}
