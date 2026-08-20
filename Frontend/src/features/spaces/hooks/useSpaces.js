import { useState, useEffect, useCallback } from "react"
import { getSpaces } from "../services/space.api"

export const useSpaces = () => {

    const [spaces, setSpaces]   = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState(null)

    const fetchSpaces = useCallback(async () => {
        setLoading(true)
        setError(null)
        try {
            const data = await getSpaces()
            if (data?.spaces) {
                setSpaces(data.spaces)
            } else {
                setSpaces([])
            }
        } catch (err) {
            setError("Failed to load spaces")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        fetchSpaces()
    }, [fetchSpaces])

    return { spaces, loading, error, refresh: fetchSpaces }
}
