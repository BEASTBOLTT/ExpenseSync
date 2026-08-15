import { useContext, useEffect } from "react"
import { AuthContext } from "../auth.context"
import { login, register, logout, getMe } from "../services/auth.api"

export const useAuth = () => {

    const context = useContext(AuthContext)
    const { user, setUser, loading, setLoading } = context

    const handleLogin = async ({ email, password }) => {
        setLoading(true)
        try {
            const data = await login({ email, password })
            if (data) setUser(data.user || data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleRegister = async (formData) => {
        setLoading(true)
        try {
            const data = await register(formData)
            if (data) setUser(data.user || data)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = async () => {
        setLoading(true)
        try {
            await logout()
            setUser(null)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const getAndSetUser = async () => {
            try {
                const data = await getMe()
                if (data && (data.user || data.id || data._id)) {
                    setUser(data.user || data)
                }
            } catch (err) {
                console.log(err)
            } finally {
                setLoading(false)
            }
        }

        getAndSetUser()
    }, [])

    return { user, loading, handleRegister, handleLogin, handleLogout }
}
