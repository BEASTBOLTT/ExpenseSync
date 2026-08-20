import { useNavigate } from "react-router"
import { useApp } from "../../../hooks/useApp"
import { useSpaces } from "../hooks/useSpaces"
import TopActions from "../../../components/TopActions"

// ── Helpers ───────────────────────────────────────────────────────────────

function formatINR(amount = 0) {
    return `₹${Number(amount).toLocaleString("en-IN")}`
}

// Member initials badge — overlapping style
function MemberBadge({ name, isDark }) {
    const initials = (name || "?")
        .split(" ")
        .filter(Boolean)
        .map(n => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)

    return (
        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border-2 ${
            isDark
                ? "bg-[#6B1A00] text-[#D4C99A] border-[#A0622A]"
                : "bg-[#5C3D1E] text-white border-[#FFDDB3]"
        }`}>
            {initials}
        </div>
    )
}

// Balance pill — "you got ₹X" / "you owe ₹X" / "all settled"
function BalancePill({ userBalance, isDark }) {
    if (!userBalance) return null

    const { status, netBalance } = userBalance

    if (status === "settled") {
        return (
            <span className={`text-xs font-semibold ${isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"}`}>
                all settled
            </span>
        )
    }

    if (status === "get") {
        return (
            <span className="text-xs font-semibold text-green-400">
                you got {formatINR(netBalance)}
            </span>
        )
    }

    return (
        <span className="text-xs font-semibold text-red-400">
            you owe {formatINR(netBalance)}
        </span>
    )
}

// Skeleton card while loading
function SkeletonCard({ card, pulse }) {
    return (
        <div className={`rounded-3xl overflow-hidden ${card}`}>
            <div className={`h-32 ${pulse} animate-pulse`} />
            <div className="px-4 py-3 space-y-3">
                <div className="flex items-center justify-between">
                    <div className={`h-4 rounded-full w-24 ${pulse} animate-pulse`} />
                    <div className={`h-5 rounded-full w-12 ${pulse} animate-pulse`} />
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                        {[1,2,3].map(i => (
                            <div key={i} className={`w-7 h-7 rounded-full ${pulse} animate-pulse`} />
                        ))}
                    </div>
                    <div className={`h-3 rounded-full w-20 ${pulse} animate-pulse`} />
                </div>
            </div>
        </div>
    )
}

// ── Main Component ────────────────────────────────────────────────────────

const SpacesPage = () => {

    const { isDark } = useApp()
    const navigate   = useNavigate()
    const { spaces, loading } = useSpaces()

    // ── Theme tokens ──────────────────────────────────────────────────────
    const bg     = isDark ? "bg-[#6B1A00]"   : "bg-[#FFF3DC]"
    const card   = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const pulse  = isDark ? "bg-[#8B5520]"   : "bg-[#FFE8C0]"
    const text   = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    const muted  = isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
    const badge  = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"
    const banner = isDark ? "bg-[#A0622A]"   : "bg-[#FFDDB3]"
    const fab    = isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-28 ${bg} ${text}`}>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-black">My Spaces</h1>
                <TopActions />
            </div>

            {/* ── Space Cards Grid ── */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {[1, 2, 3].map(i => (
                        <SkeletonCard key={i} card={card} pulse={pulse} />
                    ))}
                </div>
            ) : spaces.length === 0 ? (
                <div className={`rounded-3xl px-6 py-10 text-center mb-5 ${card}`}>
                    <p className="text-4xl mb-3">🏕️</p>
                    <p className={`text-base font-bold mb-1 ${text}`}>No spaces yet</p>
                    <p className={`text-sm ${muted}`}>Create a space to split expenses with friends</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
                    {spaces.map(space => (
                        <button
                            key={space._id}
                            type="button"
                            onClick={() => navigate(`/spaces/${space._id}`)}
                            className={`rounded-3xl overflow-hidden text-left transition-opacity hover:opacity-90 active:scale-95 ${card}`}
                        >
                            {/* ── Icon / Cover Image area ── */}
                            <div className={`h-32 flex items-center justify-center ${pulse}`}>
                                {space.coverImage ? (
                                    <img
                                        src={space.coverImage}
                                        alt={space.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-6xl select-none">{space.icon || "📦"}</span>
                                )}
                            </div>

                            {/* ── Card Info ── */}
                            <div className="px-4 pt-3 pb-4">
                                {/* Name + Type badge */}
                                <div className="flex items-center justify-between mb-2">
                                    <p className={`text-sm font-bold ${text}`}>{space.name}</p>
                                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${badge}`}>
                                        {space.type}
                                    </span>
                                </div>

                                {/* Member avatars + Balance */}
                                <div className="flex items-center justify-between">
                                    {/* Member initials — max 4, then +N */}
                                    <div className="flex items-center -space-x-1">
                                        {space.members.slice(0, 4).map((m, i) => (
                                            <MemberBadge key={m._id || i} name={m.name} isDark={isDark} />
                                        ))}
                                        {space.members.length > 4 && (
                                            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold border-2 ${isDark ? "bg-[#8B5520] text-[#D4C99A] border-[#A0622A]" : "bg-[#FFE8C0] text-[#5C3D1E] border-[#FFDDB3]"}`}>
                                                +{space.members.length - 4}
                                            </div>
                                        )}
                                    </div>

                                    {/* Balance indicator */}
                                    <BalancePill userBalance={space.userBalance} isDark={isDark} />
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* ── "Starting something new?" Banner ── */}
            <div className={`rounded-3xl px-5 py-4 flex items-center justify-between ${banner}`}>
                <div>
                    <p className={`text-sm font-bold mb-0.5 ${text}`}>Starting something new?</p>
                    <p className={`text-xs ${muted}`}>Create a space for a trip, flat, project or event.</p>
                </div>
                <button
                    type="button"
                    onClick={() => navigate("/spaces/create")}
                    className={`ml-4 shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-opacity hover:opacity-80 ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
                >
                    New Space
                </button>
            </div>

            {/* ── FAB ── */}
            <button
                type="button"
                onClick={() => navigate("/spaces/create")}
                className={`fixed bottom-24 right-5 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-light shadow-lg transition-opacity hover:opacity-80 active:scale-95 z-40 ${fab}`}
            >
                +
            </button>

        </div>
    )
}

export default SpacesPage
