import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function getAccount() {
    try {
        const response = await api.get("/api/accounts/get-account")
        return response.data
    } catch (err) {
        console.log("Error fetching account:", err)
        return null
    }
}

export async function updateProfilePicture(formData) {
    try {
        const response = await api.put("/api/accounts/update-account", formData)
        return response.data
    } catch (err) {
        console.log("Error updating profile picture:", err)
        return null
    }
}
