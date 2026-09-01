import axios from "axios"

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true
})

export async function register(formData) {
    try {
        const response = await api.post("/api/auth/register", formData)
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function login({ email, password }) {
    try {
        const response = await api.post("/api/auth/login", { email, password })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function logout() {
    try {
        const response = await api.post("/api/auth/logout")
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function getMe() {
    try {
        const response = await api.get("/api/auth/user")
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function forgotPassword({ email }) {
    try {
        const response = await api.post("/api/auth/forgot-password", { email })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function verifyOtp({ email, otp }) {
    try {
        const response = await api.post("/api/auth/verify-otp", { email, otp })
        return response.data
    } catch (err) {
        console.log(err)
    }
}

export async function resetPassword({ resetToken, newPassword, confirmPassword }) {
    try {
        const response = await api.post("/api/auth/reset-password", { resetToken, newPassword, confirmPassword })
        return response.data
    } catch (err) {
        console.log(err)
    }
}
