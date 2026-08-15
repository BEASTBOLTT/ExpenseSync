import { Link, useLocation } from "react-router"
import { useApp } from "../hooks/useApp"

const navItems = [
    { label: "Home",         icon: "🏠",  path: "/home"         },
    { label: "Transactions", icon: "💸",  path: "/transactions" },
    { label: "Spaces",       icon: "👥",  path: "/spaces"       },
    { label: "Analytics",    icon: "📊",  path: "/analytics"    },
    { label: "Profile",      icon: "👤",  path: "/profile"      },
]

const BottomBar = () => {

    const { isDark } = useApp()
    const location = useLocation()

    return (
        <nav className={`fixed bottom-0 left-0 right-0 w-full h-16 z-50 flex items-center justify-around px-2 py-1 border-t shrink-0 overflow-hidden ${isDark ? "bg-[#6B1A00] border-[#8B5520]" : "bg-[#FFF3DC] border-[#FFE8C0]"}`}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.path

                return (
                    <Link
                        key={item.path}
                        to={item.path}
                        className="flex flex-col items-center gap-1"
                    >
                        <div className={`w-12 h-8 flex items-center justify-center rounded-full text-xl transition-colors ${
                            isActive
                                ? isDark
                                    ? "bg-[#D4C99A]"
                                    : "bg-[#5C3D1E]"
                                : "bg-transparent"
                        }`}>
                            {item.icon}
                        </div>
                        <span className={`text-[10px] font-semibold ${
                            isActive
                                ? isDark ? "text-[#D4C99A]" : "text-[#5C3D1E]"
                                : isDark ? "text-[#8B8C65]" : "text-[#6B4E2E]"
                        }`}>
                            {item.label}
                        </span>
                    </Link>
                )
            })}
        </nav>
    )
}

export default BottomBar
