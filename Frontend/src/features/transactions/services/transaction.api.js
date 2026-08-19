import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function getCategories(type) {
    try {
        const response = await api.get("/api/categories", {
            params: type ? { type } : {}
        })
        return response.data
    } catch (err) {
        console.error("Error fetching categories:", err)
        return null
    }
}

export async function createTransaction(formData) {
    try {
        const response = await api.post("/api/transactions/create-transaction", formData)
        return response.data
    } catch (err) {
        console.error("Error creating transaction:", err)
        return null
    }
}

export async function getAllTransactions(filters = {}) {
    try {
        const response = await api.get("/api/transactions/get-all-transactions", { params: filters })
        return response.data
    } catch (err) {
        console.error("Error fetching transactions:", err)
        return null
    }
}

export async function deleteTransaction(transactionId) {
    try {
        const response = await api.delete(`/api/transactions/delete-transaction/${transactionId}`)
        return response.data
    } catch (err) {
        console.error("Error deleting transaction:", err)
        return null
    }
}

export async function getTransaction(transactionId) {
    try {
        const response = await api.get(`/api/transactions/get-transaction/${transactionId}`)
        return response.data
    } catch (err) {
        console.error("Error fetching transaction:", err)
        return null
    }
}

export async function updateTransaction(transactionId, formData) {
    try {
        const response = await api.put(`/api/transactions/update-transaction/${transactionId}`, formData)
        return response.data
    } catch (err) {
        console.error("Error updating transaction:", err)
        return null
    }
}
