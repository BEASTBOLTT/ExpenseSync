import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useAuth } from "../../auth/hooks/useAuth"
import { useProfile } from "../hooks/useProfile"
import { updateProfile } from "../services/profile.api"
import TopActions from "../../../components/TopActions"

const EditProfile = () => {
    const { isDark }  = useApp()
    const { user }    = useAuth()
    const { account, loading: profileLoading } = useProfile()
    const navigate    = useNavigate()

    const [form, setForm]             = useState({ name: "", DOB: "", gender: "" })
    const [picture, setPicture]       = useState(null)
    const [preview, setPreview]       = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError]           = useState(null)

    useEffect(() => {
        if (account) {
            setForm({
                name:   account.name   || user?.name || "",
                DOB:    account.DOB    ? new Date(account.DOB).toISOString().slice(0, 10) : "",
                gender: account.gender || ""
            })
        }
    }, [account, user])

    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }))

    const handlePictureChange = (e) => {
        const file = e.target.files?.[0]
        if (file) {
            setPicture(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)
        try {
            const formData = new FormData()
            if (form.name)   formData.append("name",   form.name)
            if (form.DOB)    formData.append("DOB",    form.DOB)
            if (form.gender) formData.append("gender", form.gender)
            if (picture)     formData.append("picture", picture)
            const data = await updateProfile(formData)
            if (data?.status === "success") {
                navigate("/profile")
            } else {
                setError("Failed to update profile. Please try again.")
            }
        } catch (err) {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    const bg    = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card  = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const label = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const displayName = account?.name || user?.name || user?.username || "User"
    const initials    = displayName.split(" ").filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"
    const userImg     = preview || account?.picture || (typeof user?.picture === "string" ? user.picture : user?.picture?.url)

    if (profileLoading) {
        return (
            <div className={`w-full min-h-full px-5 py-6 flex flex-col gap-4 ${bg} ${text}`}>
                <div className={`h-8 rounded-full w-40 ${card} animate-pulse`} />
                <div className={`w-24 h-24 rounded-full mx-auto ${card} animate-pulse`} />
                <div className={`h-12 rounded-2xl ${card} animate-pulse`} />
                <div className={`h-12 rounded-2xl ${card} animate-pulse`} />
                <div className={`h-12 rounded-2xl ${card} animate-pulse`} />
            </div>
        )
    }

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-10 ${bg} ${text}`}>
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <button type="button" onClick={() => navigate(-1)} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold hover:opacity-70 ${card}`}>←</button>
                    <h1 className="text-2xl font-black">Edit Profile</h1>
                </div>
                <TopActions />
            </div>
            <div className="flex flex-col items-center mb-8">
                <label className="relative cursor-pointer group">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold overflow-hidden shadow-md ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>
                        {userImg ? <img src={userImg} alt={displayName} className="w-full h-full object-cover" /> : initials}
                    </div>
                    <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-2xl">📷</span>
                    </div>
                    <input type="file" accept="image/*" className="hidden" onChange={handlePictureChange} />
                </label>
                <p className={`text-xs mt-2 ${label}`}>Tap to change photo</p>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={`rounded-3xl overflow-hidden mb-4 ${card}`}>
                    <div className="px-5 py-4">
                        <p className={`text-xs font-semibold mb-1 ${label}`}>Name</p>
                        <input type="text" value={form.name} onChange={e => set("name", e.target.value)} placeholder="Your name" className={`w-full bg-transparent outline-none text-sm font-semibold ${text}`} />
                    </div>
                </div>
                <div className={`rounded-3xl overflow-hidden mb-4 ${card}`}>
                    <div className="px-5 py-4">
                        <p className={`text-xs font-semibold mb-1 ${label}`}>Date of Birth</p>
                        <input type="date" value={form.DOB} onChange={e => set("DOB", e.target.value)} className={`w-full bg-transparent outline-none text-sm font-semibold ${text}`} />
                    </div>
                </div>
                <div className={`rounded-3xl overflow-hidden mb-6 ${card}`}>
                    <div className="px-5 py-4">
                        <p className={`text-xs font-semibold mb-1 ${label}`}>Gender</p>
                        <select value={form.gender} onChange={e => set("gender", e.target.value)} className={`w-full bg-transparent outline-none text-sm font-semibold ${text}`}>
                            <option value="">Select gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                </div>
                {error && <p className="mb-4 text-sm text-red-400 text-center">{error}</p>}
                <button type="submit" disabled={submitting} className={`w-full py-4 rounded-3xl text-sm font-bold transition-all ${submitting ? `cursor-not-allowed opacity-40 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}` : `cursor-pointer hover:opacity-90 active:scale-95 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}`}>
                    {submitting ? "Saving..." : "Save Changes"}
                </button>
            </form>
        </div>
    )
}

export default EditProfile
