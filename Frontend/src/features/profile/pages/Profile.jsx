import { useState, useRef } from "react"
import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAuth } from "../../auth/hooks/useAuth"
import { useProfile } from "../hooks/useProfile"


// ── Popup Modal (matches AddExpenseModal style) ─────────────────────────────

function Sheet({ open, onClose, title, children, isDark }) {
    if (!open) return null
    const bg = isDark ? "bg-[#6B1A00] text-[#D4C99A]" : "bg-[#FFF3DC] text-[#5C3D1E]"
    const card = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    return (
        <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
            <div className={`w-full max-w-md rounded-4xl shadow-2xl flex flex-col max-h-[80vh] ${bg}`}>

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
                    <h2 className="text-2xl font-black">{title}</h2>
                    <button
                        type="button"
                        onClick={onClose}
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold ${card}`}
                    >
                        ✕
                    </button>
                </div>

                {/* Scrollable content */}
                <div className="overflow-y-auto flex-1 px-6 pb-6" style={{ scrollbarWidth: "none" }}>
                    {children}
                </div>

            </div>
        </div>
    )
}


// ── About content ───────────────────────────────────────────────────────────

function AboutContent({ isDark }) {
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const card  = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const pill  = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"

    const features = [
        { icon: "💸", label: "Track personal income & expenses" },
        { icon: "👥", label: "Create shared Spaces for groups" },
        { icon: "⚖️",  label: "Fair expense splitting — equal, %, or custom" },
        { icon: "🧮", label: "Auto debt simplification algorithm" },
        { icon: "🤝", label: "Settle up & track payment history" },
        { icon: "📊", label: "Visual analytics for spending habits" },
    ]

    return (
        <div className={`space-y-5 pt-2 ${text}`}>

            {/* Logo + tagline */}
            <div className={`rounded-3xl p-5 text-center ${card}`}>
                <p className="text-3xl font-black mb-1">
                    Wallet<span className={isDark ? "text-[#8B8C65]" : "text-[#A0622A]"}>Buddy</span>
                </p>
                <p className={`text-sm ${muted}`}>Your money. Your groups. One place.</p>
                <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-bold ${pill}`}>
                    Version 1.0.0
                </span>
            </div>

            {/* What it does */}
            <div>
                <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${muted}`}>What WalletBuddy does</p>
                <div className={`rounded-3xl overflow-hidden ${card}`}>
                    {features.map((f, i) => (
                        <div key={i}>
                            {i > 0 && <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />}
                            <div className="flex items-center gap-3 px-5 py-3.5">
                                <span className="text-lg">{f.icon}</span>
                                <p className={`text-sm font-medium ${text}`}>{f.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Built by */}
            <div className={`rounded-3xl p-5 ${card}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${muted}`}>Built by</p>
                <p className={`text-sm font-semibold ${text}`}>Developed as a full-stack personal project.</p>
                <p className={`text-sm mt-1 ${muted}`}>React · Node.js · MongoDB · JWT · ImageKit</p>
            </div>

            {/* Contact */}
            <div className={`rounded-3xl p-5 ${card}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${muted}`}>Contact</p>
                <p className={`text-sm ${muted}`}>devamp27@gmail.com</p>
            </div>

        </div>
    )
}


// ── Privacy Policy content ──────────────────────────────────────────────────

function PrivacyContent({ isDark }) {
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const card  = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"

    const sections = [
        {
            icon: "📋",
            title: "Data we collect",
            points: [
                "Your name, email address, and date of birth",
                "Password — stored as a bcrypt hash (never plain text)",
                "Profile picture uploaded to ImageKit CDN",
                "Transactions, space expenses, and settlement records you create",
            ]
        },
        {
            icon: "🎯",
            title: "How we use it",
            points: [
                "To power the app's core features — tracking, splitting, analytics",
                "To send email notifications: login alerts, OTPs, space invites",
                "We do NOT sell your data to third parties",
                "We do NOT use your data for advertising",
            ]
        },
        {
            icon: "🏦",
            title: "Data storage",
            points: [
                "Data is stored on MongoDB Atlas (cloud)",
                "Images are stored on ImageKit CDN",
                "Auth uses HTTP-only cookies — your token is never exposed to JavaScript",
            ]
        },
        {
            icon: "🔐",
            title: "Security",
            points: [
                "Passwords are hashed with bcrypt (10 rounds)",
                "Auth tokens are blacklisted on logout",
                "OTPs are hashed before storage and expire in 10 minutes",
                "Password reset requires OTP verification — no bypass possible",
            ]
        },
        {
            icon: "🗑️",
            title: "Data deletion",
            points: [
                "Deleting a Space permanently removes all its expenses and settlements",
                "To request full account deletion, contact the developer",
            ]
        },
    ]

    return (
        <div className={`space-y-5 pt-2 ${text}`}>

            <p className={`text-xs ${muted}`}>Last updated · September 2026</p>

            {sections.map((s, i) => (
                <div key={i}>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-3 ${muted}`}>
                        {s.icon} {s.title}
                    </p>
                    <div className={`rounded-3xl overflow-hidden ${card}`}>
                        {s.points.map((point, j) => (
                            <div key={j}>
                                {j > 0 && <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />}
                                <div className="flex items-start gap-3 px-5 py-3.5">
                                    <span className={`text-xs mt-0.5 shrink-0 ${muted}`}>•</span>
                                    <p className={`text-sm ${text}`}>{point}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <div className={`rounded-3xl p-5 ${card}`}>
                <p className={`text-xs font-bold uppercase tracking-wider mb-2 ${muted}`}>📬 Contact</p>
                <p className={`text-sm ${muted}`}>For data requests or concerns, reach us at:</p>
                <p className={`text-sm font-semibold mt-1 ${text}`}>devamp27@gmail.com</p>
            </div>

        </div>
    )
}


// ── Main Profile Page ───────────────────────────────────────────────────────

const Profile = () => {

    const { isDark, setIsDark } = useApp()
    const { user, handleLogout } = useAuth()
    const { account, updatePicture, loading: profileLoading } = useProfile()
    const navigate = useNavigate()

    const [currency, setCurrency] = useState("INR ₹")
    const [sheet, setSheet] = useState(null)   // null | "about" | "privacy"
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

                <button
                    type="button"
                    onClick={() => setSheet("about")}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>About WalletBuddy</span>
                    <span className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>→</span>
                </button>

                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />

                <button
                    type="button"
                    onClick={() => setSheet("privacy")}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Privacy Policy</span>
                    <span className={`text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>→</span>
                </button>

                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />

                <button
                    type="button"
                    onClick={() => navigate("/forgot-password")}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                    <span className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Change Password</span>
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

            {/* ── Sheet Modals ── */}
            <Sheet open={sheet === "about"} onClose={() => setSheet(null)} title="About WalletBuddy" isDark={isDark}>
                <AboutContent isDark={isDark} />
            </Sheet>

            <Sheet open={sheet === "privacy"} onClose={() => setSheet(null)} title="Privacy Policy" isDark={isDark}>
                <PrivacyContent isDark={isDark} />
            </Sheet>

        </div>
    )
}

export default Profile
