import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAuth } from "../../auth/hooks/useAuth"
import { useTransactions, groupTransactionsByDate } from "../hooks/useTransactions"
import TopActions from "../../../components/TopActions"

// ── Helpers ────────────────────────────────────────────────────────────────

function formatINR(amount) {
    return new Intl.NumberFormat("en-IN").format(Math.abs(amount))
}

function formatTime(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
}

function getMonthLabel(date) {
    const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
    return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

function getGroupTotal(txs) {
    let total = 0
    for (const tx of txs) {
        total += tx.type === "Credit" ? tx.amount : -tx.amount
    }
    return total
}

// ── Skeleton ───────────────────────────────────────────────────────────────

function SkeletonRow({ card }) {
    return (
        <div className={`flex items-center gap-3 px-4 py-3 animate-pulse`}>
            <div className={`w-10 h-10 rounded-full shrink-0 ${card}`} />
            <div className="flex-1 space-y-2">
                <div className={`h-3 rounded-full w-2/3 ${card}`} />
                <div className={`h-2 rounded-full w-1/3 ${card}`} />
            </div>
            <div className={`h-3 rounded-full w-16 ${card}`} />
        </div>
    )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TransactionsPage = () => {
    const { isDark } = useApp()
    const { user } = useAuth()
    const navigate = useNavigate()
    const monthInputRef = useRef(null)

    const {
        transactions,
        loading,
        filter,
        setFilter,
        selectedMonth,
        setSelectedMonth,
        fetchTransactions
    } = useTransactions()

    // Fetch on mount and when filter/month changes
    useEffect(() => {
        fetchTransactions()
    }, [fetchTransactions])

    // ── Theme tokens ─────────────────────────────────────────────────────
    const bg    = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card  = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const iconBg= isDark ? "bg-[#8B5520]"   : "bg-[#FFE8C0]"

    const activePill   = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"
    const inactivePill = isDark ? "border border-[#8B5520] text-[#8B8C65]" : "border border-[#FFDDB3] text-[#6B4E2E]"

    // ── Avatar ────────────────────────────────────────────────────────────
    const name     = user?.name || user?.username || "User"
    const initials = name.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
    const userImg  = typeof user?.picture === "string" ? user.picture : user?.picture?.url || user?.profilePic || user?.avatar

    // ── Groups ─────────────────────────────────────────────────────────────
    const groups = groupTransactionsByDate(transactions)

    // ── Month input value (YYYY-MM) ────────────────────────────────────────
    const monthValue = selectedMonth
        ? `${selectedMonth.getFullYear()}-${String(selectedMonth.getMonth() + 1).padStart(2, "0")}`
        : ""

    const handleMonthChange = (e) => {
        if (!e.target.value) {
            setSelectedMonth(null)
            fetchTransactions(filter, null)
            return
        }
        const [year, month] = e.target.value.split("-").map(Number)
        const newMonth = new Date(year, month - 1, 1)
        setSelectedMonth(newMonth)
        fetchTransactions(filter, newMonth)
    }

    const handleClearMonth = () => {
        setSelectedMonth(null)
        fetchTransactions(filter, null)
    }

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter)
        fetchTransactions(newFilter, selectedMonth)
    }

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-24 ${bg} ${text}`}>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-3xl font-black">Transactions</h1>
                <TopActions />
            </div>

            {/* ── Filter Pills ── */}
            <div
                className="flex gap-2 mb-6 overflow-x-auto pb-1"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
                {["All", "Income", "Expense"].map(f => (
                    <button
                        key={f}
                        type="button"
                        onClick={() => handleFilterChange(f)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-all ${filter === f ? activePill : inactivePill}`}
                    >
                        {f}
                    </button>
                ))}

                {/* Month pill */}
                <div className="relative shrink-0 flex items-center gap-1">
                    <button
                        type="button"
                        onClick={() => monthInputRef.current?.showPicker?.() || monthInputRef.current?.click()}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedMonth ? activePill : inactivePill}`}
                    >
                        📅 {selectedMonth ? getMonthLabel(selectedMonth) : "All Time"}
                    </button>
                    {selectedMonth && (
                        <button
                            type="button"
                            onClick={handleClearMonth}
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${inactivePill}`}
                            title="Show all time"
                        >
                            ✕
                        </button>
                    )}
                    <input
                        ref={monthInputRef}
                        type="month"
                        value={monthValue}
                        onChange={handleMonthChange}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                </div>
            </div>

            {/* ── Content ── */}
            {loading ? (
                <div className={`rounded-3xl overflow-hidden ${card}`}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i}>
                            {i > 1 && <div className={`mx-4 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />}
                            <SkeletonRow card={isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"} />
                        </div>
                    ))}
                </div>
            ) : Object.keys(groups).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                    <span className="text-5xl">💸</span>
                    <p className={`text-base font-semibold ${muted}`}>
                        {selectedMonth ? "No transactions this month" : "No transactions yet"}
                    </p>
                    <p className={`text-sm ${muted}`}>Tap + to add one</p>
                </div>
            ) : (
                Object.entries(groups).map(([dateLabel, txs]) => {
                    const groupTotal = getGroupTotal(txs)
                    const totalPositive = groupTotal > 0
                    const allSameType = txs.every(t => t.type === "Credit") || txs.every(t => t.type === "Debit")

                    return (
                        <div key={dateLabel} className="mb-5">
                            {/* Group header */}
                            <div className="flex items-center justify-between mb-2 px-1">
                                <span className={`text-sm font-bold ${text}`}>{dateLabel}</span>
                                <span className={`text-sm font-semibold ${allSameType
                                    ? txs[0].type === "Credit" ? "text-green-500" : "text-red-400"
                                    : totalPositive ? "text-green-500" : "text-red-400"
                                }`}>
                                    {groupTotal >= 0 ? "+" : "-"}₹{formatINR(groupTotal)}
                                </span>
                            </div>

                            {/* Card */}
                            <div className={`rounded-3xl overflow-hidden ${card}`}>
                                {txs.map((tx, idx) => (
                                    <div key={tx._id}>
                                        {idx > 0 && (
                                            <div className={`mx-4 border-b ${isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"}`} />
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => navigate(`/transactions/${tx._id}`)}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-opacity hover:opacity-80"
                                        >
                                            {/* Icon */}
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${iconBg}`}>
                                                {tx.category?.icon || "💳"}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${text}`}>
                                                    {tx.note || tx.category?.name || "Transaction"}
                                                </p>
                                                <p className={`text-xs mt-0.5 ${muted}`}>
                                                    {formatTime(tx.time)} · {tx.source?.type === "personal" ? "Personal" : "Space"}
                                                </p>
                                            </div>

                                            {/* Amount */}
                                            <span className={`text-sm font-bold shrink-0 ${tx.type === "Credit" ? "text-green-500" : "text-red-400"}`}>
                                                {tx.type === "Credit" ? "+" : "-"}₹{formatINR(tx.amount)}
                                            </span>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )
                })
            )}

            {/* ── FAB ── */}
            <button
                type="button"
                onClick={() => navigate("/transactions/add-expense")}
                className={`fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold shadow-lg transition-transform active:scale-95 z-50 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
            >
                +
            </button>
        </div>
    )
}

export default TransactionsPage
