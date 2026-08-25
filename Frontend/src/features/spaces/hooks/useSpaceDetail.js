import { useState, useEffect, useCallback } from "react"
import { getSpace, getSpaces, getSpaceExpenses, getBalances, getSettlements } from "../services/space.api"

export const useSpaceDetail = (spaceId) => {

    const [space, setSpace] = useState(null)
    const [expenses, setExpenses] = useState([])
    const [balances, setBalances] = useState([])
    const [settlements, setSettlements] = useState([])
    const [userBalance, setUserBalance] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchSpaceDetail = useCallback(async () => {
        if (!spaceId) return

        setLoading(true)
        setError(null)

        try {
            const [spaceData, expensesData, balancesData, settlementsData, spacesData] = await Promise.all([
                getSpace(spaceId),
                getSpaceExpenses(spaceId),
                getBalances(spaceId),
                getSettlements(spaceId),
                getSpaces()
            ])

            if (!spaceData?.space) {
                setError("Failed to load this space")
                return
            }

            setSpace(spaceData.space)
            setExpenses(expensesData?.expenses || [])
            setBalances(balancesData?.balances || [])
            setSettlements(settlementsData?.settlements || [])

            const listSpace = spacesData?.spaces?.find(item => item._id === spaceId)
            setUserBalance(listSpace?.userBalance || null)
        } catch (err) {
            console.error("Failed to load space detail:", err)
            setError("Failed to load this space")
        } finally {
            setLoading(false)
        }
    }, [spaceId])

    useEffect(() => {
        fetchSpaceDetail()
    }, [fetchSpaceDetail])

    return {
        space,
        expenses,
        balances,
        settlements,
        userBalance,
        loading,
        error,
        refresh: fetchSpaceDetail
    }
}
