import { useState, useEffect, useCallback } from "react"
import { getAccount, updateProfilePicture } from "../services/profile.api"

export const useProfile = () => {
    const [account, setAccount] = useState(null)
    const [loading, setLoading] = useState(true)

    const fetchAccount = useCallback(async () => {
        setLoading(true)
        try {
            const data = await getAccount()
            if (data && data.account) {
                setAccount(data.account)
            }
        } catch (err) {
            console.error("Failed to load profile account:", err)
        } finally {
            setLoading(false)
        }
    }, [])

    const updatePicture = async (file) => {
        if (!file) return null
        setLoading(true)
        try {
            const formData = new FormData()
            formData.append("picture", file)
            const data = await updateProfilePicture(formData)
            if (data && data.account) {
                setAccount(data.account)
                return data.account
            }
        } catch (err) {
            console.error("Failed to update profile picture:", err)
        } finally {
            setLoading(false)
        }
        return null
    }

    useEffect(() => {
        fetchAccount()
    }, [fetchAccount])

    return {
        account,
        loading,
        fetchAccount,
        updatePicture
    }
}
