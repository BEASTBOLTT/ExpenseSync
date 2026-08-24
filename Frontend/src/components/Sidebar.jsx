import { Link, useLocation } from "react-router"
import { useApp } from "../hooks/useApp"

const navItems = [
    { label: "Home",         icon: "🏠",  path: "/home"         },
    { label: "Transactions", icon: "💸",  path: "/transactions" },
    { label: "Spaces",       icon: "👥",  path: "/spaces"       },
    { label: "Analytics",    icon: "📊",  path: "/analytics"    },
    { label: "Profile",      icon: "👤",  path: "/profile"      },
]

const Sidebar = () => {

    const { isDark } = useApp()
    const location = useLocation()

    return (
        <aside className={`fixed top-0 left-0 bottom-0 w-44 h-screen flex flex-col justify-between px-3 py-5 z-40 shrink-0 ${isDark ? "bg-[#A0622A]" : "bg-[#FFDDB3]"}`}>

            <div>
                {/* Logo — clicking navigates to home */}
                <Link to="/home" className="flex items-center gap-2 mb-8 px-2 hover:opacity-80 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-linear-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-sm shrink-0">
                        👛
                    </div>
                    <span className={`text-lg font-bold ${isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"}`}>
                        Wallet<span className="font-black">Buddy</span>
                    </span>
                </Link>

                {/* Nav Items */}
                <nav className="flex flex-col gap-1">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path

                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-semibold transition-colors ${
                                    isActive
                                        ? isDark
                                            ? "bg-[#D4C99A] text-[#6B1A00]"
                                            : "bg-[#5C3D1E] text-white"
                                        : isDark
                                            ? "text-[#D4C99A] hover:bg-[#B87030]"
                                            : "text-[#5C3D1E] hover:bg-[#FFE8C0]"
                                }`}
                            >
                                <span className="text-base">{item.icon}</span>
                                {item.label}
                            </Link>
                        )
                    })}
                </nav>
            </div>

            {/* Tagline Card */}
            <div className={`rounded-2xl p-3 text-xs font-medium leading-relaxed ${isDark ? "bg-[#8B5520] text-[#D4C99A]" : "bg-[#FFE8C0] text-[#6B4E2E]"}`}>
                Your money. Your groups.
                <br />
                One place.
            </div>

        </aside>
    )
}

export default Sidebar
