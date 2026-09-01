import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function getSummary(params = {}) {
    try {
        const response = await api.get("/api/analytics/summary", { params })
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
