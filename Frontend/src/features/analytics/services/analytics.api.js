import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

// GET /api/analytics/summary?startDate&endDate&source
export async function getSummary({ startDate, endDate, source } = {}) {
    try {
        const params = {}
        if (startDate) params.startDate = startDate
        if (endDate) params.endDate = endDate
        if (source) params.source = source
        const response = await api.get("/api/analytics/summary", { params })
        return response.data
    } catch (err) {
        console.error("Error fetching summary:", err)
        return null
    }
}

// GET /api/analytics/by-category?startDate&endDate&type
export async function getByCategory({ startDate, endDate, type = "Debit" } = {}) {
    try {
        const params = { type }
        if (startDate) params.startDate = startDate
        if (endDate)   params.endDate   = endDate
        const response = await api.get("/api/analytics/by-category", { params })
        return response.data
    } catch (err) {
        console.error("Error fetching category breakdown:", err)
        return null
    }
}

// GET /api/analytics/trends?months&source
export async function getTrends({ months = 6, source } = {}) {
    try {
        const params = { months }
        if (source) params.source = source
        const response = await api.get("/api/analytics/trends", { params })
        return response.data
    } catch (err) {
        console.error("Error fetching trends:", err)
        return null
    }
}
