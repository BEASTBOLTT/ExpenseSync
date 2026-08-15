import { useAuth } from "../hooks/useAuth"
import { Navigate } from "react-router"

const Protected = ({ children }) => {

    const { loading, user } = useAuth()

    if (loading) {
        return (
            <main className="h-screen flex items-center justify-center bg-[#FFF3DC]">
                <p className="text-[#5C3D1E] text-lg font-semibold">Loading...</p>
            </main>
        )
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return children
}

export default Protected
