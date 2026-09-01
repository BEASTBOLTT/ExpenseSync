import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function getSpaces() {
    try {
        const response = await api.get("/api/spaces")
        return response.data
    } catch (err) {
        console.error("Error fetching spaces:", err)
        return null
    }
}

export async function getSpace(spaceId) {
    try {
        const response = await api.get(`/api/spaces/${spaceId}`)
        return response.data
    } catch (err) {
        console.error("Error fetching space:", err)
        return null
    }
}

export async function createSpace(formData) {
    try {
        const response = await api.post("/api/spaces", formData)
        return response.data
    } catch (err) {
        console.error("Error creating space:", err)
        return null
    }
}

export async function deleteSpace(spaceId) {
    try {
        const response = await api.delete(`/api/spaces/${spaceId}`)
        return response.data
    } catch (err) {
        console.error("Error deleting space:", err)
        return null
    }
}

export async function getSpaceExpenses(spaceId) {
    try {
        const response = await api.get(`/api/spaces/${spaceId}/expenses`)
        return response.data
    } catch (err) {
        console.error("Error fetching space expenses:", err)
        return null
    }
}

export async function getBalances(spaceId) {
    try {
        const response = await api.get(`/api/spaces/${spaceId}/balances`)
        return response.data
    } catch (err) {
        console.error("Error fetching space balances:", err)
        return null
    }
}

export async function getSettlements(spaceId) {
    try {
        const response = await api.get(`/api/spaces/${spaceId}/settlements`)
        return response.data
    } catch (err) {
        console.error("Error fetching settlements:", err)
        return null
    }
}

export async function addMember(spaceId, member) {
    try {
        const response = await api.post(`/api/spaces/${spaceId}/members`, member)
        return response.data
    } catch (err) {
        console.error("Error adding space member:", err)
        return null
    }
}

export async function removeMember(spaceId, memberId) {
    try {
        const response = await api.delete(`/api/spaces/${spaceId}/members/${memberId}`)
        return response.data
    } catch (err) {
        console.error("Error removing space member:", err)
        return null
    }
}

export async function getExpenseCategories() {
    try {
        const response = await api.get("/api/categories", { params: { type: "expense" } })
        return response.data
    } catch (err) {
        console.error("Error fetching expense categories:", err)
        return null
    }
}

export async function createSpaceExpense(spaceId, formData) {
    try {
        const response = await api.post(`/api/spaces/${spaceId}/expenses`, formData)
        return response.data
    } catch (err) {
        console.error("Error creating space expense:", err)
        return null
    }
}

export async function updateSpaceExpense(spaceId, expenseId, formData) {
    try {
        const response = await api.put(`/api/spaces/${spaceId}/expenses/${expenseId}`, formData)
        return response.data
    } catch (err) {
        console.error("Error updating space expense:", err)
        return null
    }
}

export async function deleteSpaceExpense(spaceId, expenseId) {
    try {
        const response = await api.delete(`/api/spaces/${spaceId}/expenses/${expenseId}`)
        return response.data
    } catch (err) {
        console.error("Error deleting space expense:", err)
        return null
    }
}

export async function getSimplifiedBalances(spaceId) {
    try {
        const response = await api.get(`/api/spaces/${spaceId}/simplified-balances`)
        return response.data
    } catch (err) {
        console.error("Error fetching simplified balances:", err)
        return null
    }
}

export async function settleUp(spaceId, settlement) {
    try {
        const response = await api.post(`/api/spaces/${spaceId}/settle`, settlement)
        return response.data
    } catch (err) {
        console.error("Error recording settlement:", err)
        return null
    }
}
