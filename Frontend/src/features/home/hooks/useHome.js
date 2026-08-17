import { useState, useEffect, useCallback } from "react"
import { getSummary, getRecentTransactions, getSpaces } from "../services/home.api"

export const useHome = () => {

    const [summary, setSummary] = useState(null)
    const [transactions, setTransactions] = useState([])
    const [spaces, setSpaces] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchAll = useCallback(async () => {
        setLoading(true)
        try {
            const [summaryData, txData, spacesData] = await Promise.all([
                getSummary(),
                getRecentTransactions(5),
                getSpaces()
            ])

            if (summaryData?.summary){
                setSummary(summaryData.summary)
            }
            if (txData?.transactions){
                setTransactions(txData.transactions)
            }
            if (spacesData?.spaces){
                setSpaces(spacesData.spaces)
            }
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
        refetch: fetchAll
    }
}
