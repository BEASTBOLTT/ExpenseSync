import { useEffect, useState } from "react"
import { useApp } from "../../../hooks/useApp"
import { useAnalytics } from "../hooks/useAnalytics"
import TopActions from "../../../components/TopActions"

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatINR(amount = 0) {
    return `₹${Math.abs(Number(amount)).toLocaleString("en-IN")}`
}

const MONTH_NAMES = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]



const DONUT_COLORS = [
    "#E07070", "#6FCF97", "#D4C99A", "#7B9E9E", "#C8A46E",
    "#D4956A", "#8BAD8B", "#6E8BAD", "#AD8B6E", "#9E7B7B"
]



function polarToCartesian(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function describeArc(cx, cy, r, startAngle, endAngle) {
    const start    = polarToCartesian(cx, cy, r, endAngle)
    const end      = polarToCartesian(cx, cy, r, startAngle)
    const largeArc = endAngle - startAngle > 180 ? 1 : 0
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`
}

function DonutChart({ breakdown, isDark }) {
    const total = breakdown.reduce((s, b) => s + b.total, 0)
    if (!total) return (
        <div className="flex items-center justify-center h-48">
            <p className={`text-sm ${isDark ? "text-[#D4C99A]" : "text-[#6B4E2E]"}`}>No expense data</p>
        </div>
    )

    const cx = 160, cy = 160, r = 110, stroke = 40
    let cursor = 0
    const segments = breakdown.map((b, i) => {
        const sweep = (b.total / total) * 360
        const seg   = { ...b, startAngle: cursor, endAngle: cursor + sweep, color: DONUT_COLORS[i % DONUT_COLORS.length] }
        cursor += sweep
        return seg
    })

    return (
        <svg viewBox="0 0 320 320" className="w-full max-w-xs mx-auto">
            {segments.map((seg, i) => (
                <path
                    key={i}
                    d={describeArc(cx, cy, r, seg.startAngle, seg.endAngle)}
                    fill="none"
                    stroke={seg.color}
                    strokeWidth={stroke}
                    strokeLinecap="butt"
                />
            ))}
        </svg>
    )
}



function BarChart({ trends, isDark }) {
    if (!trends || trends.length === 0) {
        return (
            <div className="flex items-center justify-center h-40">
                <p className={`text-sm ${isDark ? "text-[#D4C99A]" : "text-[#6B4E2E]"}`}>No trend data</p>
            </div>
        )
    }

    const W = 600, H = 210, PAD = { top: 20, right: 10, bottom: 45, left: 50 }
    const plotW = W - PAD.left - PAD.right
    const plotH = H - PAD.top  - PAD.bottom

    const maxVal = Math.max(...trends.flatMap(t => [t.income, t.expense]), 1)
  
    const barW   = Math.min(28, Math.max(10, (plotW / (trends.length * 2 + 1)) * 0.85))
    const gap    = plotW / trends.length

    const gridLines = [0, 0.25, 0.5, 0.75, 1].map(f => ({
        y: PAD.top + plotH * (1 - f),
        label: formatINR(maxVal * f)
    }))

   
    const labelColor  = isDark ? "#D4C99A" : "#6B4E2E"
    const gridColor   = isDark ? "#C09060" : "#FFE8C0"
    const incomeColor  = "#6FCF97"
    const expenseColor = "#EB5757"

    return (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
            {/* Grid lines + Y-axis labels */}
            {gridLines.map((g, i) => (
                <g key={i}>
                    <line x1={PAD.left} y1={g.y} x2={W - PAD.right} y2={g.y}
                        stroke={gridColor} strokeWidth="1" strokeDasharray="4,3" />
                    <text x={PAD.left - 6} y={g.y + 4} textAnchor="end"
                        fontSize="10" fontWeight="500" fill={labelColor}>
                        {g.label}
                    </text>
                </g>
            ))}

            {/* Bars */}
            {trends.map((t, i) => {
                const x        = PAD.left + gap * i + gap / 2
                const incomeH  = (t.income  / maxVal) * plotH
                const expenseH = (t.expense / maxVal) * plotH

                return (
                    <g key={i}>
                        {/* Income bar */}
                        <rect
                            x={x - barW - 2}
                            y={PAD.top + plotH - incomeH}
                            width={barW}
                            height={incomeH}
                            fill={incomeColor}
                            rx="4"
                        />
                        {/* Expense bar */}
                        <rect
                            x={x + 2}
                            y={PAD.top + plotH - expenseH}
                            width={barW}
                            height={expenseH}
                            fill={expenseColor}
                            rx="4"
                        />
                        {/* Month label */}
                        <text x={x} y={H - PAD.bottom + 16}
                            textAnchor="middle" fontSize="11" fontWeight="600"
                            fill={labelColor}>
                            {MONTH_NAMES[(t.month - 1) % 12]}
                        </text>
                    </g>
                )
            })}

            {/* Legend */}
            <circle cx={PAD.left + 10} cy={H - 8} r={5} fill={incomeColor} />
            <text x={PAD.left + 20} y={H - 4} fontSize="11" fontWeight="500" fill={labelColor}>Income</text>
            <circle cx={PAD.left + 80} cy={H - 8} r={5} fill={expenseColor} />
            <text x={PAD.left + 90} y={H - 4} fontSize="11" fontWeight="500" fill={labelColor}>Expense</text>
        </svg>
    )
}



function CustomRangeModal({ isDark, card, text, onApply, onClose }) {
    const [start, setStart] = useState("")
    const [end,   setEnd]   = useState("")

    const inputCls = `w-full rounded-xl px-4 py-2 text-sm font-medium outline-none border-none ${
        isDark ? "bg-[#8B5520] text-[#D4C99A] placeholder-[#C09060]" : "bg-[#FFE8C0] text-[#5C3D1E]"
    }`
    const labelCls = `text-xs font-semibold block mb-1 ${isDark ? "text-[#D4C99A]" : "text-[#6B4E2E]"}`

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm"
            onClick={onClose}>
            <div className={`w-full max-w-md rounded-t-3xl p-6 space-y-4 ${card}`}
                onClick={e => e.stopPropagation()}>
                <p className={`text-base font-black ${text}`}>Custom Range</p>
                <div className="space-y-3">
                    <div>
                        <label className={labelCls}>From</label>
                        <input type="date" value={start} onChange={e => setStart(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>To</label>
                        <input type="date" value={end} onChange={e => setEnd(e.target.value)} className={inputCls} />
                    </div>
                </div>
                <button
                    type="button"
                    disabled={!start || !end}
                    onClick={() => { if (start && end) onApply({ startDate: new Date(start).toISOString(), endDate: new Date(end + "T23:59:59").toISOString() }) }}
                    className={`w-full py-3 rounded-2xl text-sm font-bold transition-opacity ${!start || !end ? "opacity-40" : "hover:opacity-80"} ${isDark ? "bg-[#D4C99A] text-[#6B1A00]" : "bg-[#5C3D1E] text-white"}`}
                >
                    Apply
                </button>
            </div>
        </div>
    )
}



const AnalyticsPage = () => {

    const { isDark } = useApp()

    const {
        period, source,
        summary, breakdown, trends, loading,
        fetchAll,
        handlePeriodChange,
        handleSourceChange,
        handleCustomRange
    } = useAnalytics()

    const [showCustomModal, setShowCustomModal] = useState(false)

    // Fetch on mount
    useEffect(() => { fetchAll() }, [fetchAll])

    // ── Theme tokens ───────────────────────────────────────────────────────
    const bg    = isDark ? "bg-[#6B1A00]" : "bg-[#FFF3DC]"
    const card  = isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"
    const inner = isDark ? "bg-[#8B5520]" : "bg-[#FFE8C0]"
    const text  = isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
    // Label (smaller secondary text) — lighter in dark mode for readability
    const label = isDark ? "text-[#E8D9A0]" : "text-[#6B4E2E]"
    // Muted text — still readable in dark mode (not the near-invisible #8B8C65)
    const muted = isDark ? "text-[#C8A87A]" : "text-[#6B4E2E]"

    // Inactive pill: visible text, distinct background
    const activePill   = isDark ? "bg-[#D4C99A] text-[#6B1A00] font-bold" : "bg-[#5C3D1E] text-white font-bold"
    const inactivePill = isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"

    const breakdownTotal = breakdown.reduce((s, b) => s + b.total, 0)

    return (
        <div className={`w-full max-w-full overflow-x-hidden min-h-full px-5 py-6 pb-28 ${bg} ${text}`}>

            {/* ── Top Bar ── */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-black">Analytics</h1>
                <TopActions />
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                    { label: "Income",  value: summary?.totalIncome,  color: "text-green-400" },
                    { label: "Expense", value: summary?.totalExpense, color: "text-red-400"   },
                    { label: "Net",     value: summary?.netBalance,   color: (summary?.netBalance ?? 0) >= 0 ? "text-green-400" : "text-red-400" }
                ].map(({ label: lbl, value, color }) => (
                    <div key={lbl} className={`rounded-2xl px-3 py-3 ${card}`}>
                        {/* Label always visible — use `label` token not `muted` */}
                        <p className={`text-[10px] font-semibold mb-1 ${label}`}>{lbl}</p>
                        {loading ? (
                            <div className={`h-5 rounded-full w-16 animate-pulse ${inner}`} />
                        ) : (
                            <p className={`text-base font-black ${color}`}>{formatINR(value || 0)}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* ── Period Filter Row ── */}
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1" style={{ scrollbarWidth: "none" }}>
                {[
                    {label: "This Month", value: "this-month"},
                    {label: "Last 3M", value: "last-3m"},
                    {label: "Last 6M", value: "last-6m"},
                    {label: "Custom", value: "custom"}
                ].map(({ label: lbl, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => {
                            if (value === "custom") setShowCustomModal(true)
                            else handlePeriodChange(value)
                        }}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${period === value ? activePill : inactivePill}`}
                    >
                        {lbl}
                    </button>
                ))}
            </div>

            {/* ── Source Filter Row ── */}
            <div className="flex gap-2 mb-6" style={{ scrollbarWidth: "none" }}>
                {[
                    {label: "All", value: "all"},
                    {label: "Personal", value: "personal"},
                    {label: "From Spaces", value: "space"}
                ].map(({ label: lbl, value }) => (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleSourceChange(value)}
                        className={`shrink-0 px-4 py-2 rounded-full text-xs font-semibold transition-all ${source === value ? activePill : inactivePill}`}
                    >
                        {lbl}
                    </button>
                ))}
            </div>

            {/* ── Spending by Category ── */}
            <h2 className={`text-xl font-black mb-4 ${text}`}>Spending by Category</h2>

            <div className={`rounded-3xl p-5 mb-6 ${card}`}>
                {loading ? (
                    <div className="flex flex-col items-center gap-4 py-4">
                        <div className={`w-40 h-40 rounded-full animate-pulse ${inner}`} />
                        {[1,2,3].map(i => (
                            <div key={i} className="flex items-center gap-3 w-full">
                                <div className={`w-3 h-3 rounded-full shrink-0 ${inner} animate-pulse`} />
                                <div className={`h-3 rounded-full flex-1 ${inner} animate-pulse`} />
                                <div className={`h-3 rounded-full w-16 ${inner} animate-pulse`} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <>
                        {/* Donut */}
                        <DonutChart breakdown={breakdown} isDark={isDark} />

                        {/* Category list */}
                        <div className="mt-4 space-y-1">
                            {breakdown.map((b, i) => {
                                const pct = breakdownTotal ? Math.round((b.total / breakdownTotal) * 100) : 0
                                return (
                                    <div key={b.category?._id || i} className="flex items-center gap-3 py-2">
                                        {/* Color dot — larger for visibility */}
                                        <div className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/20"
                                            style={{ backgroundColor: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                                        {/* Category icon + name */}
                                        <span className="text-base shrink-0">{b.category?.icon || "📦"}</span>
                                        <span className={`text-sm font-semibold flex-1 ${text}`}>{b.category?.name || "Other"}</span>
                                        {/* Amount */}
                                        <span className={`text-sm font-bold ${text}`}>{formatINR(b.total)}</span>
                                        {/* Percentage — use muted (readable) not near-invisible color */}
                                        <span className={`text-xs w-9 text-right font-medium ${muted}`}>{pct}%</span>
                                    </div>
                                )
                            })}
                            {breakdown.length === 0 && (
                                <p className={`text-sm text-center py-4 ${muted}`}>No expense data for this period</p>
                            )}
                        </div>
                    </>
                )}
            </div>

            {/* ── Monthly Trends ── */}
            <h2 className={`text-xl font-black mb-4 ${text}`}>Monthly Trends</h2>

            <div className={`rounded-3xl p-5 mb-6 ${card}`}>
                {loading ? (
                    <div className="flex items-end gap-2 h-40 px-2">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="flex-1 flex gap-1 items-end">
                                <div className={`flex-1 rounded-t-md animate-pulse ${inner}`}
                                    style={{ height: `${40 + (i * 13) % 80}px` }} />
                                <div className={`flex-1 rounded-t-md animate-pulse ${inner}`}
                                    style={{ height: `${30 + (i * 17) % 60}px` }} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <BarChart trends={trends} isDark={isDark} />
                )}
            </div>

            {/* ── Custom Date Range Modal ── */}
            {showCustomModal && (
                <CustomRangeModal
                    isDark={isDark}
                    card={card}
                    text={text}
                    onApply={(range) => {
                        handleCustomRange(range)
                        setShowCustomModal(false)
                    }}
                    onClose={() => setShowCustomModal(false)}
                />
            )}

        </div>
    )
}

export default AnalyticsPage
