import { useRef, useState } from "react"
import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { createSpace } from "../services/space.api"
import TopActions from "../../../components/TopActions"

const spaceTypes = [
    { value: "trip", label: "Trip", icon: "🏝️" },
    { value: "flat", label: "Flat", icon: "🏠" },
    { value: "project", label: "Project", icon: "🚀" },
    { value: "event", label: "Event", icon: "🎉" },
    { value: "other", label: "Other", icon: "📦" }
]

const CreateSpacePage = () => {

    const { isDark } = useApp()
    const navigate = useNavigate()
    const coverRef = useRef(null)

    const [name, setName] = useState("")
    const [type, setType] = useState("trip")
    const [cover, setCover] = useState(null)
    const [preview, setPreview] = useState(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState(null)

    const selectedType = spaceTypes.find(item => item.value === type)

    const handleCoverChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        setCover(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        const formData = new FormData()
        formData.append("name", name)
        formData.append("type", type)
        formData.append("icon", selectedType?.icon || "📦")
        if (cover) formData.append("coverImage", cover)

        const data = await createSpace(formData)

        if (data?.status === "success") {
            navigate(`/spaces/${data.space._id}`)
        } else {
            setError("Could not create this space. Please try again.")
        }

        setSubmitting(false)
    }

    const bg = isDark ? "bg-[#6B1A00]" : "bg-[#FFF3DC]"
    const card = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const field = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#5C3D1E]"
    const text = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const active = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-10 ${bg} ${text}`}>
            <div className="max-w-2xl mx-auto">

                {/* ── Top Bar ── */}
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-black">New Space</h1>
                    <TopActions />
                </div>

                <form onSubmit={handleSubmit}>

                    {/* ── Cover Image ── */}
                    <button
                        type="button"
                        onClick={() => coverRef.current?.click()}
                        className={`w-full h-48 sm:h-52 rounded-3xl overflow-hidden flex flex-col items-center justify-center mb-6 transition-opacity hover:opacity-90 ${card}`}
                    >
                        {preview ? (
                            <img src={preview} alt="Space cover preview" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <span className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-3 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}>📷</span>
                                <span className={`text-sm font-semibold ${muted}`}>Add a cover image</span>
                            </>
                        )}
                    </button>
                    <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />

                    {/* ── Space Details ── */}
                    <div className={`rounded-3xl p-6 ${card}`}>
                        <label htmlFor="space-name" className={`block text-sm font-semibold mb-2 ${muted}`}>Space name</label>
                        <input
                            id="space-name"
                            required
                            value={name}
                            onChange={e => setName(e.target.value)}
                            placeholder="Goa Trip 2026"
                            className={`w-full rounded-2xl px-5 py-4 text-sm font-semibold outline-none mb-6 ${field}`}
                        />

                        <p className={`text-sm font-semibold mb-3 ${muted}`}>Space type</p>
                        <div className="flex flex-wrap gap-2 mb-7">
                            {spaceTypes.map(item => (
                                <button
                                    key={item.value}
                                    type="button"
                                    onClick={() => setType(item.value)}
                                    className={`px-4 py-2.5 rounded-full text-sm font-bold transition-all ${type === item.value ? active : field}`}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        {error && <p className="mb-4 text-sm text-red-400 text-center">{error}</p>}

                        <button
                            type="submit"
                            disabled={!name.trim() || submitting}
                            className={`w-full py-4 rounded-3xl text-sm font-black transition-all disabled:opacity-40 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
                        >
                            {submitting ? "Creating..." : "Create Space"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default CreateSpacePage
