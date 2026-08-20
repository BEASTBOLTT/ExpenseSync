import { useState, useEffect } from "react"
import { createSpaceExpense, getExpenseCategories, getSimplifiedBalances, settleUp, updateSpaceExpense } from "../services/space.api"

function memberInitials(name) {
    return (name || "?").split(" ").filter(Boolean).map(part => part[0]).join("").toUpperCase().slice(0, 2)
}

export function AddExpenseModal({ spaceId, members, expense, onClose, onSaved, isDark }) {
    const isEdit = Boolean(expense)
    const [categories, setCategories] = useState([])
    const [form, setForm] = useState({
        amount: expense?.amount || "",
        description: expense?.description || "",
        category: expense?.category?._id || expense?.category || "",
        date: expense?.date ? new Date(expense.date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10),
        paidBy: expense?.paidBy || members[0]?._id || "",
        splitType: expense?.splitType || "equal",
        receipt: null
    })
    const [values, setValues] = useState(() => Object.fromEntries(members.map(member => [member._id, ""])))
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)

    useEffect(() => {
        const loadCategories = async () => {
            const data = await getExpenseCategories()
            setCategories(data?.categories || [])
        }
        loadCategories()
    }, [])

    const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
    const setValue = (memberId, value) => setValues(prev => ({ ...prev, [memberId]: value }))

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        setError(null)

        if (isEdit) {
            const data = await updateSpaceExpense(spaceId, expense._id, {
                description: form.description,
                category: form.category,
                date: form.date
            })
            if (data?.status === "success") onSaved()
            else setError("Could not update this expense. Please try again.")
            setSaving(false)
            return
        }

        const membersForSplit = members.map(member => ({
            memberId: member._id,
            ...(form.splitType === "equal" ? {} : { value: Number(values[member._id] || 0) })
        }))
        const formData = new FormData()
        formData.append("amount", Number(form.amount))
        formData.append("description", form.description)
        formData.append("category", form.category)
        formData.append("date", new Date(`${form.date}T12:00:00`).toISOString())
        formData.append("paidBy", form.paidBy)
        formData.append("splitType", form.splitType)
        formData.append("members", JSON.stringify(membersForSplit))
        if (form.receipt) formData.append("receipt", form.receipt)

        const data = await createSpaceExpense(spaceId, formData)
        if (data?.status === "success") onSaved()
        else setError("Could not add this expense. Check the split values and try again.")
        setSaving(false)
    }

    const bg = isDark ? "bg-[#6B1A00] text-[#D4C99A]" : "bg-[#FFF3DC] text-[#5C3D1E]"
    const card = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const field = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"
    const active = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"

    return (
        <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto">
            <form onSubmit={handleSubmit} className={`w-full max-w-xl rounded-[2rem] p-6 my-4 shadow-2xl ${bg}`}>
                <div className="flex items-center justify-between mb-5"><h2 className="text-2xl font-black">{isEdit ? "Edit space expense" : "Add space expense"}</h2><button type="button" onClick={onClose} className={`w-10 h-10 rounded-full text-xl ${card}`}>✕</button></div>
                <div className={`rounded-3xl p-5 mb-5 text-center ${card}`}><p className={`text-xs font-semibold mb-2 ${muted}`}>Amount{isEdit && " (unchanged when editing)"}</p><div className="flex items-center justify-center gap-2"><span className="text-3xl font-black">₹</span><input required readOnly={isEdit} type="number" min="0.01" step="0.01" value={form.amount} onChange={e => set("amount", e.target.value)} className="w-44 bg-transparent text-center text-4xl font-black outline-none" placeholder="0" /></div></div>
                <label className={`block text-sm font-semibold mb-2 ${muted}`}>Description</label><input required value={form.description} onChange={e => set("description", e.target.value)} className={`w-full rounded-2xl px-4 py-3 outline-none mb-5 ${field}`} placeholder="Beach shack dinner" />
                <label className={`block text-sm font-semibold mb-2 ${muted}`}>Category</label><div className="flex flex-wrap gap-2 mb-4">{categories.map(category => <button key={category._id} type="button" onClick={() => set("category", category._id)} className={`px-4 py-2 rounded-full text-sm font-bold ${form.category === category._id ? active : field}`}>{category.icon} {category.name}</button>)}</div>
                <label className={`block text-sm font-semibold mb-2 ${muted}`}>Date</label><input required type="date" value={form.date} onChange={e => set("date", e.target.value)} className={`w-full rounded-2xl px-4 py-3 outline-none mb-5 ${field}`} />
                {!isEdit && <>
                    <label className={`block text-sm font-semibold mb-2 ${muted}`}>Paid by</label><div className="flex gap-2 overflow-x-auto pb-2 mb-5">{members.map(member => <button key={member._id} type="button" onClick={() => set("paidBy", member._id)} className={`px-4 py-2 rounded-full text-sm font-bold shrink-0 ${form.paidBy === member._id ? active : field}`}>{memberInitials(member.name)} · {member.name}</button>)}</div>
                    <label className={`block text-sm font-semibold mb-2 ${muted}`}>Split type</label><div className="flex gap-2 overflow-x-auto pb-2 mb-4">{["equal", "exact", "percentage", "shares"].map(type => <button key={type} type="button" onClick={() => set("splitType", type)} className={`px-4 py-2 rounded-full text-sm font-bold capitalize shrink-0 ${form.splitType === type ? active : field}`}>{type}</button>)}</div>
                    <div className={`rounded-3xl px-4 py-3 mb-5 ${card}`}>{members.map(member => <div key={member._id} className="flex items-center gap-3 py-2"><span className={`w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold ${field}`}>{memberInitials(member.name)}</span><span className="flex-1 text-sm font-bold">{member.name}</span>{form.splitType === "equal" ? <span className={muted}>₹ equal share</span> : <input required type="number" min="0" step="0.01" value={values[member._id]} onChange={e => setValue(member._id, e.target.value)} placeholder={form.splitType === "percentage" ? "%" : form.splitType === "shares" ? "Shares" : "₹"} className={`w-24 rounded-xl px-3 py-2 text-sm outline-none ${field}`} />}</div>)}</div>
                    <label className={`flex items-center justify-center gap-2 w-full rounded-2xl px-4 py-3 mb-5 text-sm font-bold cursor-pointer border-2 border-dashed ${isDark ? "border-[#8B5520]" : "border-[#E8C38E]"}`}><span>🧾</span>{form.receipt ? form.receipt.name : "Attach receipt"}<input type="file" accept="image/*" className="hidden" onChange={e => set("receipt", e.target.files?.[0] || null)} /></label>
                </>}
                {error && <p className="text-sm text-red-400 text-center mb-4">{error}</p>}<button disabled={saving || !form.category} className={`w-full py-4 rounded-3xl text-sm font-black disabled:opacity-40 ${active}`}>{saving ? "Saving..." : isEdit ? "Save changes" : "Add expense"}</button>
            </form>
        </div>
    )
}

export function SettlementModal({ spaceId, members, onClose, onSaved, isDark }) {
    const [suggestions, setSuggestions] = useState([])
    const [form, setForm] = useState({ fromMember: "", toMember: "", amount: "", note: "" })
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState(null)
    useEffect(() => { getSimplifiedBalances(spaceId).then(data => setSuggestions(data?.transactions || [])) }, [spaceId])
    const selectSuggestion = suggestion => setForm({ fromMember: suggestion.from.memberId, toMember: suggestion.to.memberId, amount: suggestion.amount, note: "" })
    const submit = async e => { e.preventDefault(); setSaving(true); setError(null); const data = await settleUp(spaceId, { ...form, amount: Number(form.amount) }); if (data?.status === "success") onSaved(); else setError("Could not record this settlement."); setSaving(false) }
    const bg = isDark ? "bg-[#6B1A00] text-[#D4C99A]" : "bg-[#FFF3DC] text-[#5C3D1E]"
    const card = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const field = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"
    const active = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"
    return <div className="fixed inset-0 z-[60] bg-black/45 backdrop-blur-sm flex items-center justify-center p-4"><form onSubmit={submit} className={`w-full max-w-md rounded-[2rem] p-6 shadow-2xl ${bg}`}><div className="flex items-center justify-between mb-5"><h2 className="text-2xl font-black">Settle up</h2><button type="button" onClick={onClose} className={`w-10 h-10 rounded-full text-xl ${card}`}>✕</button></div>{suggestions.length > 0 && <div className={`rounded-3xl p-3 mb-4 ${card}`}><p className="text-xs font-bold mb-2">Suggested settlements</p>{suggestions.map((item, index) => <button type="button" onClick={() => selectSuggestion(item)} key={index} className={`w-full text-left rounded-2xl px-3 py-2 text-sm font-semibold ${field}`}>{item.from.name} → {item.to.name} · ₹{item.amount.toLocaleString("en-IN")}</button>)}</div>}<div className="grid grid-cols-2 gap-3 mb-3"><select required value={form.fromMember} onChange={e => setForm(prev => ({ ...prev, fromMember: e.target.value }))} className={`rounded-2xl px-3 py-3 outline-none text-sm ${field}`}><option value="">From</option>{members.map(member => <option key={member._id} value={member._id}>{member.name}</option>)}</select><select required value={form.toMember} onChange={e => setForm(prev => ({ ...prev, toMember: e.target.value }))} className={`rounded-2xl px-3 py-3 outline-none text-sm ${field}`}><option value="">To</option>{members.map(member => <option key={member._id} value={member._id}>{member.name}</option>)}</select></div><input required type="number" min="0.01" step="0.01" value={form.amount} onChange={e => setForm(prev => ({ ...prev, amount: e.target.value }))} placeholder="Amount" className={`w-full rounded-2xl px-4 py-3 outline-none mb-3 ${field}`} /><input value={form.note} onChange={e => setForm(prev => ({ ...prev, note: e.target.value }))} placeholder="Note (optional)" className={`w-full rounded-2xl px-4 py-3 outline-none mb-4 ${field}`} />{error && <p className="text-sm text-red-400 text-center mb-3">{error}</p>}<button disabled={saving || form.fromMember === form.toMember} className={`w-full py-4 rounded-3xl text-sm font-black disabled:opacity-40 ${active}`}>{saving ? "Recording..." : "Record settlement"}</button></form></div>
}
