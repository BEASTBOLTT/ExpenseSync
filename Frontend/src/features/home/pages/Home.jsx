import { Link, useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAuth } from "../../auth/hooks/useAuth"
import { useHome } from "../hooks/useHome"
import TopActions from "../../../components/TopActions"

// Greeting based on time of day
function getGreeting() {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
}

// Format INR currency
function formatINR(amount = 0) {
    return `₹${Math.abs(amount).toLocaleString("en-IN")}`
}

// Format transaction date
function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

// Member initials badge
function MemberBadge({ name, isDark }) {
    const initials = (name || "?").split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)
    return (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 ${isDark ? "bg-[#6B1A00] text-[#D4C99A] border-[#A0622A]" : "bg-[#5C3D1E] text-white border-[#FFDDB3]"}`}>
            {initials}
        </div>
    )
}

const Home = () => {

    const { isDark } = useApp()
    const { user } = useAuth()
    const { summary, transactions, spaces, loading } = useHome()
    const navigate = useNavigate()

    const firstName = (user?.name || "there").split(" ")[0]
    const currentMonth = new Date().toLocaleString("en-IN", { month: "long" })

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between mb-6">
                <p className="text-xl font-semibold">
                    {getGreeting()},&nbsp;
                    <span className="font-black">{firstName}</span>
                    &nbsp;👋
                </p>
                <TopActions />
            </div>

            {/* ── Balance + Quick Actions Grid ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                {/* Net Balance Card */}
                <div className={`rounded-3xl p-6 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>
                    <p className={`text-xs font-semibold mb-1 ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                        Net balance · {currentMonth}
                    </p>
                    {loading ? (
                        <div className={`h-10 w-40 rounded-xl animate-pulse ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`} />
                    ) : (
                        <p className={`text-4xl font-black mb-4 ${summary?.netBalance >= 0 ? (isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]") : "text-red-400"}`}>
                            {summary?.netBalance >= 0 ? "+" : "−"}&nbsp;{formatINR(summary?.netBalance || 0)}
                        </p>
                    )}
                    <div className="grid grid-cols-2 gap-3">
                        <div className={`rounded-2xl p-3 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>Income</p>
                            <p className={`text-lg font-bold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>
                                {loading ? "—" : formatINR(summary?.totalIncome || 0)}
                            </p>
                        </div>
                        <div className={`rounded-2xl p-3 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                            <p className={`text-xs font-medium mb-1 ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>Expense</p>
                            <p className={`text-lg font-bold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>
                                {loading ? "—" : formatINR(summary?.totalExpense || 0)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className={`rounded-3xl p-5 grid grid-cols-2 gap-4 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>

                    {/* Add Expense */}
                    <button
                        onClick={() => navigate("/transactions/add-expense")}
                        className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${isDark ? "bg-[#8B5520] hover:bg-[#7a4918]" : "bg-[#FFE8C0] hover:bg-[#FFD9A0]"}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isDark ? "bg-[#6B1A00]" : "bg-[#5C3D1E]"}`}>
                            ➕
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Add Expense</span>
                    </button>

                    {/* Add Income */}
                    <button
                        onClick={() => navigate("/transactions/add-income")}
                        className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${isDark ? "bg-[#8B5520] hover:bg-[#7a4918]" : "bg-[#FFE8C0] hover:bg-[#FFD9A0]"}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isDark ? "bg-[#6B1A00]" : "bg-[#5C3D1E]"}`}>
                            💰
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Add Income</span>
                    </button>

                    {/* New Space */}
                    <button
                        onClick={() => navigate("/spaces/create")}
                        className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${isDark ? "bg-[#8B5520] hover:bg-[#7a4918]" : "bg-[#FFE8C0] hover:bg-[#FFD9A0]"}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isDark ? "bg-[#6B1A00]" : "bg-[#5C3D1E]"}`}>
                            👥
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>New Space</span>
                    </button>

                    {/* Analytics */}
                    <button
                        onClick={() => navigate("/analytics")}
                        className={`flex flex-col items-center gap-2 rounded-2xl p-4 transition-colors ${isDark ? "bg-[#8B5520] hover:bg-[#7a4918]" : "bg-[#FFE8C0] hover:bg-[#FFD9A0]"}`}
                    >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isDark ? "bg-[#6B1A00]" : "bg-[#5C3D1E]"}`}>
                            📊
                        </div>
                        <span className={`text-xs font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>Analytics</span>
                    </button>

                </div>

            </div>

            {/* ── Recent Transactions ── */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Recent Transactions</h2>
                <Link to="/transactions" className={`text-sm font-semibold ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                    See all →
                </Link>
            </div>

            <div className={`rounded-3xl overflow-hidden mb-6 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>
                {loading ? (
                    [1, 2, 3].map(i => (
                        <div key={i} className="flex items-center gap-3 px-5 py-4">
                            <div className={`w-10 h-10 rounded-full animate-pulse shrink-0 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`} />
                            <div className="flex-1">
                                <div className={`h-3 w-32 rounded animate-pulse mb-1 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`} />
                                <div className={`h-2 w-20 rounded animate-pulse ${isDark ? "bg-[#7a4918]" : "bg-[#FFD9A0]"}`} />
                            </div>
                        </div>
                    ))
                ) : transactions.length === 0 ? (
                    <p className={`px-5 py-8 text-center text-sm ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                        No transactions yet
                    </p>
                ) : (
                    transactions.map((tx, index) => (
                        <div key={tx._id}>
                            <div className="flex items-center justify-between px-5 py-4">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                                        {tx.category?.icon || (tx.type === "Credit" ? "💰" : "💸")}
                                    </div>
                                    <div>
                                        <p className={`text-sm font-semibold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>
                                            {tx.note || tx.category?.name || "Transaction"}
                                        </p>
                                        <p className={`text-xs ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                                            {formatDate(tx.time)} · {tx.category?.name || (tx.source?.type === "space" ? "Space" : "Personal")}
                                        </p>
                                    </div>
                                </div>
                                <span className={`text-sm font-bold shrink-0 ${tx.type === "Credit" ? "text-green-500" : "text-red-400"}`}>
                                    {tx.type === "Credit" ? "+" : "−"}{formatINR(tx.amount)}
                                </span>
                            </div>
                            {index < transactions.length - 1 && (
                                <div className={`mx-5 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />
                            )}
                        </div>
                    ))
                )}
            </div>

            {/* ── Your Spaces ── */}
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-bold">Your Spaces</h2>
                <Link to="/spaces" className={`text-sm font-semibold ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                    See all →
                </Link>
            </div>

            {loading ? (
                <div className="flex gap-4">
                    {[1, 2].map(i => (
                        <div key={i} className={`w-44 h-40 rounded-3xl shrink-0 animate-pulse ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`} />
                    ))}
                </div>
            ) : spaces.length === 0 ? (
                <div className={`rounded-3xl px-5 py-8 text-center text-sm ${isDark ? "bg-[#A0622A] text-[#8B8C65]" : "bg-[#FFDDB3] text-[#6B4E2E]"}`}>
                    No spaces yet.{" "}
                    <button onClick={() => navigate("/spaces/create")} className="font-bold underline">
                        Create one
                    </button>
                </div>
            ) : (
                /* Desktop: horizontal grid  |  Mobile/tablet: vertical stack */
                <div className="lg:grid lg:grid-cols-3 lg:gap-4 flex flex-col gap-4 pb-2">
                    {spaces.map(space => (
                        <button
                            key={space._id}
                            onClick={() => navigate(`/spaces/${space._id}`)}
                            className={`rounded-3xl p-4 text-left transition-colors ${isDark ? "bg-[#A0622A] hover:bg-[#8B5520]" : "bg-[#FFDDB3] hover:bg-[#FFE8C0]"}`}
                        >
                            {/* Space emoji / cover */}
                            <div className="flex justify-center mb-3">
                                {space.coverImage ? (
                                    <img src={space.coverImage} alt={space.name} className="w-16 h-16 rounded-2xl object-cover" />
                                ) : (
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                                        {space.icon || "📦"}
                                    </div>
                                )}
                            </div>

                            <p className={`text-sm font-bold mb-2 ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>
                                {space.name}
                            </p>

                            {/* Member avatars */}
                            <div className="flex items-center gap-1 flex-wrap">
                                {space.members.slice(0, 3).map((m, i) => (
                                    <MemberBadge key={m._id || i} name={m.name} isDark={isDark} />
                                ))}
                                {space.members.length > 3 && (
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold ${isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"}`}>
                                        +{space.members.length - 3}
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

        </div>
    )
}

export default Home
