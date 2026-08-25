import { useState, useCallback } from "react"
import { getSummary, getByCategory, getTrends } from "../services/analytics.api"



function rangeForPeriod(period) {
    const now = new Date()

    if (period === "this-month") {
        const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
        return { startDate: start.toISOString(), endDate: end.toISOString() }
    }

    if (period === "last-3m") {
        const start = new Date(now)
        start.setMonth(start.getMonth() - 3)
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        return { startDate: start.toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString() }
    }

    if (period === "last-6m") {
        const start = new Date(now)
        start.setMonth(start.getMonth() - 6)
        start.setDate(1)
        start.setHours(0, 0, 0, 0)
        return { startDate: start.toISOString(), endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString() }
    }

    // "all" — no date filter
    return {}
}

function trendsMonthsForPeriod(period) {
    if (period === "last-3m") return 3
    if (period === "last-6m") return 6
    if (period === "all") return 12
    return 1  // this-month
}



export const useAnalytics = () => {

    const [period, setPeriod] = useState("this-month")  // this-month | last-3m | last-6m | custom
    const [source, setSource] = useState("all")          // all | personal | space
    const [customRange, setCustomRange] = useState({ startDate: "", endDate: "" })

    const [summary, setSummary] = useState(null)
    const [breakdown, setBreakdown] = useState([])
    const [trends, setTrends] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchAll = useCallback(async (p = period, s = source, custom = customRange) => {
        setLoading(true)
        try {
            const { startDate, endDate } = p === "custom" ? custom : rangeForPeriod(p)
            const sourceParam = s === "all" ? undefined : s
            const trendMonths = trendsMonthsForPeriod(p)

            const [summaryData, breakdownData, trendsData] = await Promise.all([
                getSummary({ startDate, endDate, source: sourceParam }),
                getByCategory({ startDate, endDate }),
                getTrends({ months: trendMonths, source: sourceParam })
            ])

            if (summaryData?.summary) setSummary(summaryData.summary)
            if (breakdownData?.breakdown) setBreakdown(breakdownData.breakdown)
            if (trendsData?.trends) setTrends(trendsData.trends)
        } finally {
            setLoading(false)
        }
    }, [period, source, customRange])

    const handlePeriodChange = (p) => {
        setPeriod(p)
        fetchAll(p, source, customRange)
    }

    const handleSourceChange = (s) => {
        setSource(s)
        fetchAll(period, s, customRange)
    }

    const handleCustomRange = (range) => {
        setCustomRange(range)
        fetchAll("custom", source, range)
    }

    return {
        period, source, customRange,
        summary, breakdown, trends, loading,
        fetchAll,
        handlePeriodChange,
        handleSourceChange,
        handleCustomRange
    }
}
