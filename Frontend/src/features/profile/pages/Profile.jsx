import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAuth } from "../../auth/hooks/useAuth"
import { useProfile } from "../hooks/useProfile"

const Profile = () => {

    const { isDark, setIsDark } = useApp()
    const { user, handleLogout } = useAuth()
    const { account, updatePicture, loading: profileLoading } = useProfile()
    const navigate = useNavigate()

    const [currency, setCurrency] = useState("INR ₹")
    const fileInputRef = useRef(null)

    const name = account?.name || user?.name || user?.username || "User"
    const email = account?.email || user?.email || ""
    const initials = name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"

    const userImg = account?.picture || (typeof user?.picture === 'string' ? user.picture : user?.picture?.url) || user?.profilePic || user?.avatar

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (file) {
            await updatePicture(file)
        }
    }

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>

            {/* Hidden File Input for Picture Update */}
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
            />

            {/* Top Bar */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Profile</h1>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold overflow-hidden shrink-0 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>
                    {userImg ? (
                        <img src={userImg} alt={name} className="w-full h-full object-cover" />
                    ) : (
                        initials
                    )}
                </div>
            </div>

            {/* Avatar + Info */}
            <div className="flex flex-col items-center mb-8">
                <div className="relative mb-3">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden shadow-md ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>
                        {userImg ? (
                            <img src={userImg} alt={name} className="w-full h-full object-cover" />
                        ) : (
                            initials
                        )}
                    </div>
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={profileLoading}
                        className={`absolute bottom-0 right-0 w-7 h-7 rounded-full flex items-center justify-center text-xs shadow-md transition-colors ${
                            isDark
                                ? "bg-[#D4C99A] text-[#6B1A00] hover:bg-[#c4b98a]"
                                : "bg-[#5C3D1E] text-white hover:bg-[#4a3018]"
                        }`}
                        title="Change profile picture"
                    >
                        📷
                    </button>
                </div>
                <h2 className="text-xl font-bold mb-0.5">{name}</h2>
                <p className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>{email}</p>
                <button
                    type="button"
                    onClick={() => navigate("/profile/edit")}
                    className={`mt-4 px-6 py-2 rounded-full text-sm font-semibold border transition-colors ${
                        isDark
                            ? "border-[#D4C99A] text-[#D4C99A] hover:bg-[#D4C99A] hover:text-[#6B1A00]"
                            : "border-[#5C3D1E] text-[#5C3D1E] hover:bg-[#5C3D1E] hover:text-white"
                    }`}
                >
                    Edit Profile
                </button>
            </div>

            {/* Preferences Section */}
            <h3 className="text-lg font-bold mb-3">Preferences</h3>
            <div className={`rounded-3xl overflow-hidden mb-6 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🌙</span>
                        <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Dark mode</span>
                    </div>
                    <div
                        onClick={() => setIsDark(!isDark)}
                        className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 shrink-0 ${isDark ? "bg-[#D4C99A]" : "bg-[#5C3D1E]"}`}
                    >
                        <div
                            className={`w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center text-[10px] ${
                                isDark ? "translate-x-6 bg-[#6B1A00] text-[#D4C99A]" : "translate-x-0 bg-[#FFF3DC] text-[#5C3D1E]"
                            }`}
                        >
                            {isDark ? "🌙" : "☀️"}
                        </div>
                    </div>
                </div>

                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />

                {/* Currency */}
                <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                        <span className="text-xl">🔄</span>
                        <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Currency</span>
                    </div>
                    <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className={`text-sm font-semibold rounded-lg px-2 py-1 outline-none border-none ${isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"}`}
                    >
                        <option value="INR ₹">INR ₹</option>
                        <option value="USD $">USD $</option>
                        <option value="EUR €">EUR €</option>
                    </select>
                </div>

            </div>

            {/* App Section */}
            <h3 className="text-lg font-bold mb-3">App</h3>
            <div className={`rounded-3xl overflow-hidden mb-6 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>

                <div className="flex items-center justify-between px-5 py-4 cursor-pointer">
                    <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>About WalletBuddy</span>
                    <span className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>→</span>
                </div>

                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />

                <div className="flex items-center justify-between px-5 py-4 cursor-pointer">
                    <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Privacy Policy</span>
                    <span className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>→</span>
                </div>

                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />

                <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <div className="flex items-center gap-3">
                        <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Change Password</span>
                    </div>
                    <span className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>→</span>
                </button>

            </div>

            {/* Log Out */}
            <button
                type="button"
                onClick={handleLogout}
                className={`w-full py-4 rounded-3xl text-sm font-semibold transition-colors cursor-pointer ${isDark ? "bg-[#8B2500]/40 text-red-400 hover:bg-[#8B2500]/60" : "bg-[#FAD4C0] text-red-500 hover:bg-[#F5C0A8]"}`}
            >
                Log Out
            </button>

        </div>
    )
}

export default Profile
