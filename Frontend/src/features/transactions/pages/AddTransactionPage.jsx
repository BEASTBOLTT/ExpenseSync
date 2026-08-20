import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAddTransaction } from "../hooks/useAddTransaction"
import { getTransaction, updateTransaction } from "../services/transaction.api"

// mode prop: "expense" | "income" — sets the initial active tab (ignored in edit mode)
const AddTransactionPage = ({ mode = "expense" }) => {

    const { isDark } = useApp()
    const navigate   = useNavigate()
    const { transactionId } = useParams()

    const isEditMode = Boolean(transactionId)

    // Tab: "expense" | "income"
    const [tab, setTab] = useState(mode)
    const transactionType = tab === "expense" ? "Debit" : "Credit"

    const {
        categories,
        loadingCategories,
        submitting,
        error,
        submitTransaction
    } = useAddTransaction(transactionType)

    const [form, setForm] = useState({
        category: "",
        amount: "",
        date: new Date().toISOString().slice(0, 10),       // YYYY-MM-DD
        time: new Date().toTimeString().slice(0, 5),        // HH:MM
        note: "",
        receipt: null
    })

    const [loadingEdit, setLoadingEdit]       = useState(false)
    const [editSubmitting, setEditSubmitting] = useState(false)
    const [editError, setEditError]           = useState(null)

    // Pre-fill form when in edit mode
    useEffect(() => {
        if (!isEditMode) return
        const fetchAndFill = async () => {
            setLoadingEdit(true)
            const data = await getTransaction(transactionId)
            if (data?.transaction) {
                const tx     = data.transaction
                const txDate = new Date(tx.time)
                const txTab  = tx.type === "Credit" ? "income" : "expense"
                setTab(txTab)
                setForm({
                    category: tx.category?._id || tx.category || "",
                    amount:   String(tx.amount),
                    date:     txDate.toISOString().slice(0, 10),
                    time:     txDate.toTimeString().slice(0, 5),
                    note:     tx.note || "",
                    receipt:  null
                })
            }
            setLoadingEdit(false)
        }
        fetchAndFill()
    }, [transactionId, isEditMode])

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

    // Reset selected category when tab changes (disabled in edit mode)
    const switchTab = (newTab) => {
        if (isEditMode) return
        setTab(newTab)
        set("category", "")
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.category || !form.amount || !form.date || !form.time) return

        // Merge date + time → ISO string
        const isoTime = new Date(`${form.date}T${form.time}:00`).toISOString()

        if (isEditMode) {
            setEditSubmitting(true)
            setEditError(null)
            try {
                const formData = new FormData()
                formData.append("category", form.category)
                formData.append("amount",   Number(form.amount))
                formData.append("time",     isoTime)
                if (form.note)    formData.append("note",    form.note)
                if (form.receipt) formData.append("receipt", form.receipt)

                const data = await updateTransaction(transactionId, formData)
                if (data?.status === "success") {
                    navigate(`/transactions/${transactionId}`)
                } else {
                    setEditError("Failed to update transaction. Please try again.")
                }
            } catch {
                setEditError("Something went wrong. Please try again.")
            } finally {
                setEditSubmitting(false)
            }
        } else {
            const result = await submitTransaction({
                category: form.category,
                amount:   Number(form.amount),
                time:     isoTime,
                note:     form.note,
                receipt:  form.receipt
            })
            if (result) navigate("/transactions")
        }
    }

    // ── Theme tokens ──────────────────────────────────────────
    const bg    = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card  = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const field = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#5C3D1E]/10 text-[#5C3D1E]"
    const label = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const ph    = isDark ? "placeholder-[#8B8C65]" : "placeholder-[#a07855]"

    const activeTab   = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"
    const inactiveTab = isDark ? "text-[#8B8C65]"               : "text-[#6B4E2E]"

    const activeCat   = isDark ? "bg-[#D4C99A] text-[#6B1A00] border-[#D4C99A]" : "bg-[#5C3D1E] text-white border-[#5C3D1E]"
    const inactiveCat = isDark ? "bg-[#8B5520] text-[#D4C99A] border-transparent" : "bg-[#FFE8C0] text-[#5C3D1E] border-transparent"

    const isSubmitting = isEditMode ? editSubmitting : submitting
    const displayError = isEditMode ? editError      : error
    const canSubmit    = form.category && form.amount && form.date && form.time && !isSubmitting

    if (loadingEdit) {
        return (
            <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4">
                <div className={`w-full max-w-xl rounded-[2rem] p-6 flex flex-col gap-4 ${bg} ${text}`}>
                    <div className={`h-8 rounded-full w-40 ${card} animate-pulse`} />
                    <div className={`h-12 rounded-full ${card} animate-pulse`} />
                    <div className={`h-36 rounded-3xl ${card} animate-pulse`} />
                    <div className={`h-10 rounded-full ${card} animate-pulse`} />
                </div>
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <div className={`w-full max-w-xl rounded-[2rem] p-6 my-4 shadow-2xl ${bg} ${text}`}>

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-5">
                <h1 className="text-2xl font-black">{isEditMode ? "Edit transaction" : "Add transaction"}</h1>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-opacity hover:opacity-70 ${card}`}
                >
                    ✕
                </button>
            </div>

            {/* ── Expense / Income Toggle ── */}
            <div className={`flex rounded-full p-1 mb-5 ${card} ${isEditMode ? "opacity-50 pointer-events-none" : ""}`}>
                <button
                    type="button"
                    onClick={() => switchTab("expense")}
                    disabled={isEditMode}
                    className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "expense" ? activeTab : inactiveTab}`}
                >
                    Expense
                </button>
                <button
                    type="button"
                    onClick={() => switchTab("income")}
                    disabled={isEditMode}
                    className={`flex-1 py-2.5 rounded-full text-sm font-bold transition-all ${tab === "income" ? activeTab : inactiveTab}`}
                >
                    Income
                </button>
            </div>

            <form onSubmit={handleSubmit}>

                {/* ── Amount ── */}
                <div className={`rounded-3xl p-6 mb-5 flex flex-col items-center ${card}`}>
                    <p className={`text-xs font-semibold mb-3 ${label}`}>Amount</p>
                    <div className="flex items-center gap-3">
                        <span className={`text-3xl font-black ${label}`}>₹</span>
                        <input
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0"
                            value={form.amount}
                            onChange={e => set("amount", e.target.value)}
                            className={`text-4xl font-black w-40 bg-transparent outline-none text-center ${label} placeholder-current`}
                            required
                        />
                    </div>
                </div>

                {/* ── Category ── */}
                <div className="mb-5">
                    <p className={`text-sm font-semibold mb-3 ${label}`}>Category</p>
                    {loadingCategories ? (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {[1,2,3,4].map(i => (
                                <div key={i} className={`h-9 w-24 rounded-full shrink-0 animate-pulse ${card}`} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() => set("category", cat._id)}
                                    className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                                        form.category === cat._id ? activeCat : inactiveCat
                                    }`}
                                >
                                    <span>{cat.icon}</span>
                                    <span>{cat.name}</span>
                                </button>
                            ))}
                            {categories.length === 0 && (
                                <p className={`text-sm ${label}`}>No categories found</p>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Date & Time ── */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                    <div>
                        <p className={`text-sm font-semibold mb-2 ${label}`}>Date</p>
                        <input
                            type="date"
                            value={form.date}
                            onChange={e => set("date", e.target.value)}
                            required
                            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none border-none ${field}`}
                        />
                    </div>
                    <div>
                        <p className={`text-sm font-semibold mb-2 ${label}`}>Time</p>
                        <input
                            type="time"
                            value={form.time}
                            onChange={e => set("time", e.target.value)}
                            required
                            className={`w-full rounded-2xl px-4 py-3 text-sm font-semibold outline-none border-none ${field}`}
                        />
                    </div>
                </div>

                {/* ── Note ── */}
                <div className="mb-5">
                    <p className={`text-sm font-semibold mb-2 ${label}`}>Note</p>
                    <input
                        type="text"
                        placeholder="What was this for?"
                        value={form.note}
                        onChange={e => set("note", e.target.value)}
                        className={`w-full rounded-2xl px-4 py-3 text-sm outline-none border-none ${field} ${ph}`}
                    />
                </div>

                {/* ── Attach Receipt ── */}
                <div className="mb-6">
                    <label className={`flex items-center justify-center gap-2 w-full rounded-2xl px-4 py-3 text-sm font-semibold cursor-pointer transition-opacity hover:opacity-80 border-2 border-dashed ${isDark ? "border-[#8B5520] text-[#8B8C65]" : "border-[#FFDDB3] text-[#6B4E2E]"}`}>
                        <span>🧾</span>
                        <span>{form.receipt ? form.receipt.name : "Attach receipt"}</span>
                        <input
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={e => set("receipt", e.target.files?.[0] || null)}
                        />
                        {form.receipt && (
                            <button
                                type="button"
                                onClick={(e) => { e.preventDefault(); set("receipt", null) }}
                                className="ml-auto text-xs text-red-400"
                            >
                                Remove
                            </button>
                        )}
                    </label>
                </div>

                {/* ── Error ── */}
                {displayError && (
                    <p className="mb-4 text-sm text-red-400 text-center">{displayError}</p>
                )}

                {/* ── Save Button ── */}
                <button
                    type="submit"
                    disabled={!canSubmit}
                    className={`w-full py-4 rounded-3xl text-sm font-bold transition-all ${
                        canSubmit
                            ? `cursor-pointer hover:opacity-90 active:scale-95 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`
                            : `cursor-not-allowed opacity-40 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`
                    }`}
                >
                    {isSubmitting ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update transaction" : "Save transaction")}
                </button>

            </form>
            </div>
        </div>
    )
}

export default AddTransactionPage
