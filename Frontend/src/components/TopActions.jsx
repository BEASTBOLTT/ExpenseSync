import { useNavigate } from "react-router"
import { useApp } from "../hooks/useApp"
import { useAuth } from "../features/auth/hooks/useAuth"

/**
 * Shared top-right actions bar: dark mode toggle + profile avatar.
 * Drop this into any page's top bar. Excluded from Profile page.
 */
const TopActions = () => {

    const { isDark, setIsDark } = useApp()
    const { user } = useAuth()
    const navigate = useNavigate()

    const name     = user?.name || user?.username || "User"
    const initials = name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
    const userImg  = typeof user?.picture === "string"
        ? user.picture
        : user?.picture?.url || user?.profilePic || user?.avatar

    return (
        <div className="flex items-center gap-3 shrink-0">

            {/* Dark mode pill toggle */}
            <div
                onClick={() => setIsDark(!isDark)}
                className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 ${isDark ? "bg-[#D4C99A]" : "bg-[#5C3D1E]"}`}
            >
                <div className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] ${isDark ? "translate-x-6 bg-[#6B1A00] text-[#D4C99A]" : "translate-x-0 bg-[#FFF3DC] text-[#5C3D1E]"}`}>
                    {isDark ? "🌙" : "☀️"}
                </div>
            </div>

            {/* Profile avatar → /profile */}
            <div
                onClick={() => navigate("/profile")}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 cursor-pointer ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
            >
                {userImg ? (
                    <img src={userImg} alt={name} className="w-full h-full object-cover" />
                ) : (
                    initials
                )}
            </div>

        </div>
    )
}

export default TopActions
