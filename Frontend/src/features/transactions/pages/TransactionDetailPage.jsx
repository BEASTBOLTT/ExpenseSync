import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { getTransaction, deleteTransaction } from "../services/transaction.api"
import TopActions from "../../../components/TopActions"

// ── Helpers ────────────────────────────────────────────────────────────────

function formatINR(amount) {
    return new Intl.NumberFormat("en-IN").format(Math.abs(amount))
}

function formatDate(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
}

function formatTime(dateStr) {
    const d = new Date(dateStr)
    return d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
}

// ── Detail Row ─────────────────────────────────────────────────────────────

function DetailRow({ label, value, muted, text, isDivider, card }) {
    return (
        <>
            {isDivider && <div className={`mx-4 border-b ${card ? (card.includes("A0622A") ? "border-[#8B5520]" : "border-[#FFE0B0]") : "border-gray-200"}`} />}
            <div className="flex items-center justify-between px-4 py-3">
                <span className={`text-sm ${muted}`}>{label}</span>
                <span className={`text-sm font-semibold ${text}`}>{value}</span>
            </div>
        </>
    )
}

// ── Main Component ──────────────────────────────────────────────────────────

const TransactionDetailPage = () => {
    const { transactionId } = useParams()
    const navigate          = useNavigate()
    const { isDark }        = useApp()

    const [transaction, setTransaction] = useState(null)
    const [loading, setLoading]         = useState(true)
    const [confirmDelete, setConfirmDelete] = useState(false)
    const [deleting, setDeleting]       = useState(false)

    // ── Theme tokens ──────────────────────────────────────────────────────
    const bg    = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card  = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const iconBg= isDark ? "bg-[#8B5520]"   : "bg-[#FFE8C0]"
    const divider = isDark ? "border-[#8B5520]" : "border-[#FFE0B0]"

    useEffect(() => {
        const fetch = async () => {
            setLoading(true)
            const data = await getTransaction(transactionId)
            if (data?.transaction) setTransaction(data.transaction)
            setLoading(false)
        }
        fetch()
    }, [transactionId])

    const handleDelete = async () => {
        setDeleting(true)
        await deleteTransaction(transactionId)
        navigate(-1)
    }

    // ── Loading ───────────────────────────────────────────────────────────
    if (loading) {
        return (
            <div className={`w-full min-h-full px-5 py-6 ${bg} ${text}`}>
                <div className="flex items-center gap-3 mb-6">
                    <div className={`w-9 h-9 rounded-full ${card} animate-pulse`} />
                    <div className={`h-4 rounded-full w-40 ${card} animate-pulse`} />
                </div>
                <div className={`w-20 h-20 rounded-full mx-auto mb-4 ${card} animate-pulse`} />
                <div className={`h-5 rounded-full w-32 mx-auto mb-3 ${card} animate-pulse`} />
                <div className={`h-8 rounded-full w-24 mx-auto mb-8 ${card} animate-pulse`} />
                <div className={`rounded-3xl p-4 ${card} animate-pulse space-y-3`}>
                    {[1,2,3,4,5].map(i => <div key={i} className={`h-3 rounded-full ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`} />)}
                </div>
            </div>
        )
    }

    if (!transaction) {
        return (
            <div className={`w-full min-h-full px-5 py-6 flex flex-col items-center justify-center ${bg} ${text}`}>
                <span className="text-5xl mb-4">😕</span>
                <p className={`text-base font-semibold ${muted}`}>Transaction not found</p>
                <button type="button" onClick={() => navigate(-1)} className={`mt-6 px-6 py-2 rounded-full text-sm font-semibold ${card}`}>Go Back</button>
            </div>
        )
    }

    const isIncome = transaction.type === "Credit"

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 ${bg} ${text}`}>

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className={`w-9 h-9 rounded-full flex items-center justify-center font-bold transition-opacity hover:opacity-70 ${card}`}
                    >
                        ←
                    </button>
                    <h1 className="text-xl font-black">Transaction Details</h1>
                </div>
                <TopActions />
            </div>

            {/* ── Icon + Note + Amount ── */}
            <div className="flex flex-col items-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-3 ${iconBg}`}>
                    {transaction.category?.icon || "💳"}
                </div>
                <p className={`text-base font-bold mb-1 ${text}`}>
                    {transaction.note || transaction.category?.name || "Transaction"}
                </p>
                <p className={`text-3xl font-black ${isIncome ? "text-green-500" : "text-red-400"}`}>
                    {isIncome ? "+" : "-"}₹{formatINR(transaction.amount)}
                </p>
            </div>

            {/* ── Details Card ── */}
            <div className={`rounded-3xl overflow-hidden mb-6 ${card}`}>
                <div className="flex items-center justify-between px-4 py-3">
                    <span className={`text-sm ${muted}`}>Category</span>
                    <span className={`text-sm font-semibold flex items-center gap-1 ${text}`}>
                        <span>{transaction.category?.icon}</span>
                        <span>{transaction.category?.name || "—"}</span>
                    </span>
                </div>

                <div className={`mx-4 border-b ${divider}`} />
                <div className="flex items-center justify-between px-4 py-3">
                    <span className={`text-sm ${muted}`}>Type</span>
                    <span className={`text-sm font-semibold ${isIncome ? "text-green-500" : "text-red-400"}`}>
                        {isIncome ? "Income" : "Expense"}
                    </span>
                </div>

                <div className={`mx-4 border-b ${divider}`} />
                <div className="flex items-center justify-between px-4 py-3">
                    <span className={`text-sm ${muted}`}>Date</span>
                    <span className={`text-sm font-semibold ${text}`}>{formatDate(transaction.time)}</span>
                </div>

                <div className={`mx-4 border-b ${divider}`} />
                <div className="flex items-center justify-between px-4 py-3">
                    <span className={`text-sm ${muted}`}>Time</span>
                    <span className={`text-sm font-semibold ${text}`}>{formatTime(transaction.time)}</span>
                </div>

                <div className={`mx-4 border-b ${divider}`} />
                <div className="flex items-center justify-between px-4 py-3">
                    <span className={`text-sm ${muted}`}>Source</span>
                    <span className={`text-sm font-semibold capitalize ${text}`}>
                        {transaction.source?.type === "personal" ? "Personal" : transaction.source?.type || "Personal"}
                    </span>
                </div>

                {transaction.note && (
                    <>
                        <div className={`mx-4 border-b ${divider}`} />
                        <div className="flex items-center justify-between px-4 py-3">
                            <span className={`text-sm ${muted}`}>Note</span>
                            <span className={`text-sm font-semibold ${text} max-w-[60%] text-right`}>{transaction.note}</span>
                        </div>
                    </>
                )}
            </div>

            {/* ── Receipt ── */}
            {transaction.receiptUrl && (
                <div className={`rounded-3xl overflow-hidden mb-6 ${card}`}>
                    <div className="px-4 py-3">
                        <p className={`text-sm font-semibold mb-2 ${muted}`}>Receipt</p>
                        <img src={transaction.receiptUrl} alt="Receipt" className="w-full rounded-2xl object-cover max-h-48" />
                    </div>
                </div>
            )}

            {/* ── Inline Confirm Delete ── */}
            {confirmDelete && (
                <div className={`rounded-3xl p-4 mb-4 ${isDark ? "bg-[#8B2500]/40" : "bg-[#FAD4C0]"}`}>
                    <p className={`text-sm font-semibold mb-3 text-center ${text}`}>
                        Delete this transaction? This cannot be undone.
                    </p>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setConfirmDelete(false)}
                            className={`flex-1 py-2.5 rounded-2xl text-sm font-semibold ${card} ${text}`}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="flex-1 py-2.5 rounded-2xl text-sm font-semibold bg-red-500 text-white disabled:opacity-50"
                        >
                            {deleting ? "Deleting..." : "Yes, Delete"}
                        </button>
                    </div>
                </div>
            )}

            {/* ── Action Buttons ── */}
            {!confirmDelete && (
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(`/transactions/edit/${transactionId}`)}
                        className={`flex-1 py-4 rounded-3xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
                    >
                        Edit
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        className="flex-1 py-4 rounded-3xl text-sm font-bold transition-all hover:opacity-90 active:scale-95 bg-red-500 text-white"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    )
}

export default TransactionDetailPage
