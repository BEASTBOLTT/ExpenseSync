import { useState } from "react"
import { useNavigate, useParams } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useSpaceDetail } from "../hooks/useSpaceDetail"
import { deleteSpaceExpense } from "../services/space.api"
import { AddExpenseModal, SettlementModal } from "../components/SpaceModal"
import TopActions from "../../../components/TopActions"

function formatINR(amount = 0) {
    return `₹${Math.abs(Number(amount)).toLocaleString("en-IN")}`
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
}

function initials(name) {
    return (name || "?").split(" ").filter(Boolean).map(part => part[0]).join("").toUpperCase().slice(0, 2)
}

function MemberBadge({ member, isDark }) {
    return (
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 ${isDark ? "bg-[#6B1A00] text-[#D4C99A] border-[#FFDDB3]" : "bg-[#5C3D1E] text-white border-[#FFF3DC]"}`}>
            {member.isMock ? "🧑‍🎤" : initials(member.name)}
        </div>
    )
}

const SpaceDetailPage = () => {

    const { isDark } = useApp()
    const navigate = useNavigate()
    const { spaceId } = useParams()
    const { space, expenses, balances, settlements, userBalance, loading, error, refresh } = useSpaceDetail(spaceId)
    const [activeTab, setActiveTab] = useState("expenses")
    const [modal, setModal] = useState(null)

    const closeAndRefresh = async () => {
        setModal(null)
        await refresh()
    }

    const handleDelete = async (expenseId) => {
        if (!window.confirm("Delete this space expense? This cannot be undone.")) return
        const data = await deleteSpaceExpense(spaceId, expenseId)
        if (data?.status === "success") refresh()
    }

    const bg     = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card   = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const pulse  = isDark ? "bg-[#8B5520]"   : "bg-[#FFE8C0]"
    const text   = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted  = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const divider = isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"
    const activeTabClass = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"

    if (loading) {
        return (
            <div className={`w-full min-h-full px-5 py-6 ${bg}`}>
                <div className={`h-10 w-36 rounded-full mb-6 animate-pulse ${card}`} />
                <div className={`h-44 rounded-3xl mb-6 animate-pulse ${card}`} />
                <div className={`h-28 rounded-3xl mb-6 animate-pulse ${card}`} />
                <div className={`h-12 rounded-full mb-6 animate-pulse ${card}`} />
                <div className={`h-48 rounded-3xl animate-pulse ${card}`} />
            </div>
        )
    }

    if (error || !space) {
        return (
            <div className={`w-full min-h-full px-5 py-6 flex flex-col items-center justify-center gap-3 ${bg} ${text}`}>
                <span className="text-5xl">🏕️</span>
                <p className="text-base font-bold">{error || "Space not found"}</p>
                <button onClick={() => navigate("/spaces")} className={`px-5 py-2.5 rounded-full text-sm font-bold ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>Back to spaces</button>
            </div>
        )
    }

    const balanceAmount = userBalance?.netBalance || 0
    const balanceStatus = userBalance?.status || "settled"
    const balanceText = balanceStatus === "get" ? `+${formatINR(balanceAmount)}` : balanceStatus === "owe" ? `−${formatINR(balanceAmount)}` : "All settled"
    const memberById = Object.fromEntries(space.members.map(member => [member._id, member]))
    const maxBalance = Math.max(...balances.map(item => Math.abs(item.netBalance)), 1)

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-28 ${bg} ${text}`}>
            <div className="max-w-6xl mx-auto">

                {/* ── Top Bar ── */}
                <div className="flex items-center justify-between mb-6">
                    <button type="button" onClick={() => navigate("/spaces")} className={`flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-70 ${text}`}>
                        <span className="text-lg">←</span> My Spaces
                    </button>
                    <TopActions />
                </div>

                {/* ── Cover ── */}
                <div className={`h-44 sm:h-52 rounded-3xl overflow-hidden flex items-center justify-center mb-5 shadow-sm ${pulse}`}>
                    {space.coverImage ? (
                        <img src={space.coverImage} alt={space.name} className="w-full h-full object-cover" />
                    ) : (
                        <span className="text-6xl sm:text-7xl">{space.icon || "📦"}</span>
                    )}
                </div>

                {/* ── Space Title + Members ── */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
                    <div>
                        <h1 className="text-3xl font-black mb-2">{space.name}</h1>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"}`}>{space.type}</span>
                    </div>
                    <button type="button" onClick={() => navigate(`/spaces/${spaceId}/members`)} className={`flex items-center gap-2 self-start sm:self-auto rounded-3xl px-3 py-2 shadow-sm transition-opacity hover:opacity-80 ${card}`}>
                        <div className="flex -space-x-2">
                            {space.members.slice(0, 4).map(member => <MemberBadge key={member._id} member={member} isDark={isDark} />)}
                        </div>
                        <span className={`text-sm font-bold ${text}`}>Manage</span>
                    </button>
                </div>

                {/* ── Your Balance ── */}
                <div className={`rounded-3xl p-5 mb-6 flex items-center justify-between gap-4 ${card}`}>
                    <div>
                        <p className={`text-xs font-semibold mb-1 ${muted}`}>Your balance</p>
                        <p className={`text-3xl font-black ${balanceStatus === "get" ? "text-green-500" : balanceStatus === "owe" ? "text-red-400" : text}`}>{balanceText}</p>
                    </div>
                    <button type="button" onClick={() => setModal({ type: "settle" })} className={`shrink-0 px-5 py-3 rounded-full text-sm font-bold ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>Settle Up →</button>
                </div>

                {/* ── Tabs ── */}
                <div className={`flex rounded-full p-1 mb-5 ${card}`}>
                    {[{ key: "expenses", label: "Expenses" }, { key: "balances", label: "Balances" }, { key: "settlements", label: "Settlements" }].map(tab => (
                        <button key={tab.key} type="button" onClick={() => setActiveTab(tab.key)} className={`flex-1 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all ${activeTab === tab.key ? activeTabClass : muted}`}>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className={`rounded-3xl overflow-hidden ${card}`}>
                    {activeTab === "expenses" && (expenses.length === 0 ? (
                        <p className={`px-5 py-10 text-center text-sm ${muted}`}>No expenses in this space yet</p>
                    ) : expenses.map((expense, index) => {
                        const payer = memberById[expense.paidBy]
                        return (
                            <div key={expense._id}>
                                {index > 0 && <div className={`mx-5 border-b ${divider}`} />}
                                <div className="flex items-center gap-3 px-5 py-4">
                                    <MemberBadge member={payer || { name: "?" }} isDark={isDark} />
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-bold truncate ${text}`}>{expense.description}</p>
                                        <p className={`text-xs mt-1 ${muted}`}>{payer?.name || "Unknown"} paid · {expense.splitType} split · {formatDate(expense.date)}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-sm font-black ${text}`}>{formatINR(expense.amount)}</span>
                                        {expense.canManage && <div className="flex gap-1"><button type="button" onClick={() => setModal({ type: "edit", expense })} className={`w-7 h-7 rounded-full text-xs ${pulse}`}>✎</button><button type="button" onClick={() => handleDelete(expense._id)} className="w-7 h-7 rounded-full text-xs bg-red-500/20 text-red-500">✕</button></div>}
                                    </div>
                                </div>
                            </div>
                        )
                    }))}

                    {activeTab === "balances" && (balances.length === 0 ? (
                        <p className={`px-5 py-10 text-center text-sm ${muted}`}>No balances to show yet</p>
                    ) : balances.map((balance, index) => {
                        const isPositive = balance.netBalance > 0
                        const width = `${Math.max((Math.abs(balance.netBalance) / maxBalance) * 100, 4)}%`
                        return (
                            <div key={balance.memberId}>
                                {index > 0 && <div className={`mx-5 border-b ${divider}`} />}
                                <div className="flex items-center gap-3 px-5 py-4">
                                    <MemberBadge member={balance} isDark={isDark} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between gap-3 mb-2">
                                            <p className={`text-sm font-bold truncate ${text}`}>{balance.name}</p>
                                            <span className={`text-xs font-bold ${isPositive ? "text-green-500" : balance.netBalance < 0 ? "text-red-400" : muted}`}>{isPositive ? "+" : balance.netBalance < 0 ? "−" : ""}{formatINR(balance.netBalance)}</span>
                                        </div>
                                        <div className={`h-2 rounded-full overflow-hidden ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                                            <div style={{ width }} className={`h-full rounded-full ${isPositive ? "bg-green-500" : balance.netBalance < 0 ? "bg-red-400" : "bg-[#8B8C65]"}`} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    }))}

                    {activeTab === "settlements" && (settlements.length === 0 ? (
                        <p className={`px-5 py-10 text-center text-sm ${muted}`}>No settlements recorded yet</p>
                    ) : settlements.map((settlement, index) => (
                        <div key={settlement._id}>
                            {index > 0 && <div className={`mx-5 border-b ${divider}`} />}
                            <div className="flex items-center gap-3 px-5 py-4">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>🤝</div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-bold truncate ${text}`}>{settlement.fromMember.name} → {settlement.toMember.name}</p>
                                    <p className={`text-xs mt-1 ${muted}`}>{formatDate(settlement.date)}{settlement.note ? ` · ${settlement.note}` : ""}</p>
                                </div>
                                <span className="text-sm font-black text-green-500 shrink-0">{formatINR(settlement.amount)}</span>
                            </div>
                        </div>
                    )))}
                </div>

            </div>

            <button type="button" onClick={() => setModal({ type: "add" })} className={`fixed bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center text-2xl font-light shadow-lg transition-opacity hover:opacity-80 active:scale-95 z-40 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>+</button>

            {modal?.type === "add" && <AddExpenseModal spaceId={spaceId} members={space.members} onClose={() => setModal(null)} onSaved={closeAndRefresh} isDark={isDark} />}
            {modal?.type === "edit" && <AddExpenseModal spaceId={spaceId} members={space.members} expense={modal.expense} onClose={() => setModal(null)} onSaved={closeAndRefresh} isDark={isDark} />}
            {modal?.type === "settle" && <SettlementModal spaceId={spaceId} members={space.members} onClose={() => setModal(null)} onSaved={closeAndRefresh} isDark={isDark} />}
        </div>
    )
}

export default SpaceDetailPage
