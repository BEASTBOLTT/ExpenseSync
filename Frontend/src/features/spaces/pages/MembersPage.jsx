import { useState, useEffect, useCallback } from "react"
import { useNavigate, useParams } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { addMember, removeMember, getSpace } from "../services/space.api"
import TopActions from "../../../components/TopActions"

function initials(name) {
    return (name || "?").split(" ").filter(Boolean).map(part => part[0]).join("").toUpperCase().slice(0, 2)
}

const MembersPage = () => {

    const { isDark } = useApp()
    const navigate = useNavigate()
    const { spaceId } = useParams()

    const [space, setSpace] = useState(null)
    const [isCreator, setIsCreator] = useState(false)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [memberType, setMemberType] = useState("mock")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [submitting, setSubmitting] = useState(false)
    const [removingId, setRemovingId] = useState(null)
    const [error, setError] = useState(null)

    const fetchSpace = useCallback(async () => {
        setLoading(true)
        const data = await getSpace(spaceId)
        setSpace(data?.space || null)
        setIsCreator(data?.isCreator === true)
        setLoading(false)
    }, [spaceId])

    useEffect(() => {
        fetchSpace()
    }, [fetchSpace])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const data = await addMember(spaceId, memberType === "mock"
            ? { name, isMock: true }
            : { email, isMock: false }
        )

        if (data?.status === "success") {
            setSpace(data.space)
            setName("")
            setEmail("")
            setShowForm(false)
        } else {
            setError("Could not add this member. Please check the details and try again.")
        }

        setSubmitting(false)
    }

    const handleRemove = async (memberId, memberName) => {
        if (!window.confirm(`Remove "${memberName}" from this space?`)) return
        setRemovingId(memberId)
        const data = await removeMember(spaceId, memberId)
        setRemovingId(null)
        if (data?.status === "success") {
            setSpace(data.space)
        } else {
            alert(data?.message || "Could not remove member. They may have existing expense splits.")
        }
    }

    const bg = isDark ? "bg-[#6B1A00]" : "bg-[#FFF3DC]"
    const card = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const field = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const active = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"

    if (loading) {
        return <div className={`w-full min-h-full px-5 py-6 ${bg}`}><div className={`h-10 w-28 rounded-full mb-6 animate-pulse ${card}`} /><div className={`h-24 rounded-3xl mb-4 animate-pulse ${card}`} /><div className={`h-24 rounded-3xl animate-pulse ${card}`} /></div>
    }

    if (!space) {
        return <div className={`w-full min-h-full px-5 py-6 flex items-center justify-center ${bg} ${text}`}><button onClick={() => navigate("/spaces")} className="font-bold">Back to spaces</button></div>
    }

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-28 ${bg} ${text}`}>
            <div className="max-w-xl mx-auto">
                <div className="flex items-center justify-between mb-7">
                    <h1 className="text-3xl font-black">Members</h1>
                    <TopActions />
                </div>

                <button type="button" onClick={() => navigate(`/spaces/${spaceId}`)} className={`flex items-center gap-2 text-sm font-bold mb-6 transition-opacity hover:opacity-70 ${muted}`}>
                    ← {space.name}
                </button>

                <div className="space-y-4">
                    {space.members.map(member => {
                        const isCreatorMember = member.accountId === space.createdBy
                        const canRemove = isCreator && !isCreatorMember
                        const isRemoving = removingId === member._id

                        return (
                            <div key={member._id} className={`rounded-3xl px-5 py-5 flex items-center gap-4 ${card}`}>
                                {/* Avatar */}
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${member.isMock ? `border border-dashed ${isDark ? "border-[#D4C99A]" : "border-[#B89070]"}` : isDark ? "bg-[#6B1A00] text-[#D4C99A]" : "bg-[#5C3D1E] text-white"}`}>
                                    {member.isMock ? "🧑‍🎤" : initials(member.name)}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-base font-bold ${text}`}>{member.name}</p>
                                    <p className={`text-xs mt-1 ${muted}`}>{member.isMock ? "No account" : isCreatorMember ? "Creator" : "Member"}</p>
                                </div>

                                {/* Role badge + remove button */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${isCreatorMember ? active : isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"}`}>
                                        {isCreatorMember ? "Creator" : member.isMock ? "Mock" : "Member"}
                                    </span>

                                    {canRemove && (
                                        <button
                                            type="button"
                                            onClick={() => handleRemove(member._id, member.name)}
                                            disabled={isRemoving}
                                            title={`Remove ${member.name}`}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm transition-colors disabled:opacity-40 ${
                                                isDark ? "bg-red-900/40 text-red-400 hover:bg-red-900/60" : "bg-red-100 text-red-500 hover:bg-red-200"
                                            }`}
                                        >
                                            {isRemoving ? "…" : "✕"}
                                        </button>
                                    )}
                                </div>
                            </div>
                        )
                    })}
                </div>

                {showForm ? (
                    <form onSubmit={handleSubmit} className={`rounded-3xl p-5 mt-5 ${card}`}>
                        <div className={`flex rounded-full p-1 mb-4 ${isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"}`}>
                            <button type="button" onClick={() => setMemberType("mock")} className={`flex-1 py-2 rounded-full text-xs font-bold ${memberType === "mock" ? active : muted}`}>Mock member</button>
                            <button type="button" onClick={() => setMemberType("real")} className={`flex-1 py-2 rounded-full text-xs font-bold ${memberType === "real" ? active : muted}`}>Existing user</button>
                        </div>
                        <input value={memberType === "mock" ? name : email} onChange={e => memberType === "mock" ? setName(e.target.value) : setEmail(e.target.value)} type={memberType === "mock" ? "text" : "email"} placeholder={memberType === "mock" ? "Member name" : "Member email"} required className={`w-full rounded-2xl px-4 py-3 outline-none text-sm ${field}`} />
                        {error && <p className="text-xs text-red-400 mt-3 text-center">{error}</p>}
                        <div className="flex gap-3 mt-4">
                            <button type="button" onClick={() => setShowForm(false)} className={`flex-1 py-3 rounded-2xl text-sm font-bold ${field}`}>Cancel</button>
                            <button type="submit" disabled={submitting} className={`flex-1 py-3 rounded-2xl text-sm font-bold disabled:opacity-40 ${active}`}>{submitting ? "Adding..." : "Add member"}</button>
                        </div>
                    </form>
                ) : (
                    <button type="button" onClick={() => setShowForm(true)} className={`w-full mt-5 py-5 rounded-3xl border-2 border-dashed text-sm font-bold transition-opacity hover:opacity-80 ${isDark ? "border-[#8B5520] text-[#D4C99A]" : "border-[#E8C38E] text-[#6B4E2E]"}`}>+ Add member</button>
                )}
            </div>
        </div>
    )
}

export default MembersPage
