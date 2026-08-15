import { Outlet } from "react-router"
import { useApp } from "../hooks/useApp"
import Sidebar from "./Sidebar"
import BottomBar from "./BottomBar"

const Layout = () => {

    const { isDark, isDesktop } = useApp()

    return (
        <div className={`h-screen w-full flex flex-col overflow-hidden relative ${isDark ? "bg-[#6B1A00]" : "bg-[#FFF3DC]"}`}>

            {/* Sidebar — desktop only */}
            {isDesktop && <Sidebar />}

            {/* Main Content */}
            <main className={`flex-1 overflow-y-auto overflow-x-hidden ${isDesktop ? "pl-44" : "pb-20"}`}>
                <Outlet />
            </main>

            {/* Bottom Bar — mobile and tablet only */}
            {!isDesktop && <BottomBar />}

        </div>
    )
}

export default Layout
