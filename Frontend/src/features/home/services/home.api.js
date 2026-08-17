import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

// Current month date range helpers
function getMonthStart() {
    const d = new Date()
    d.setDate(1)
    d.setHours(0, 0, 0, 0)
    return d.toISOString()
}

function getMonthEnd() {
    const d = new Date()
    d.setHours(23, 59, 59, 999)
    return d.toISOString()
}

export async function getSummary() {
    try {
        const response = await api.get("/api/analytics/summary", {
            params: {
                startDate: getMonthStart(),
                endDate: getMonthEnd()
            }
        })
        return response.data
    } catch (err) {
        console.error("Error fetching summary:", err)
        return null
    }
}

export async function getRecentTransactions(limit = 5) {
    try {
        const response = await api.get("/api/transactions/get-all-transactions")
        // Slice the top N since the backend returns sorted by time desc
        const data = response.data
        if (data && data.transactions) {
            return { ...data, transactions: data.transactions.slice(0, limit) }
        }
        return data
    } catch (err) {
        console.error("Error fetching transactions:", err)
        return null
    }
}

export async function getSpaces() {
    try {
        const response = await api.get("/api/spaces")
        return response.data
    } catch (err) {
        console.error("Error fetching spaces:", err)
        return null
    }
}
