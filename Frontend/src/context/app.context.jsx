import { createContext, useState, useEffect } from "react"

export const AppContext = createContext()

export function AppProvider({ children }) {

    // Read persisted value from localStorage on first render
    const [isDark, setIsDark] = useState(() => {
        try {
            return localStorage.getItem("walletbuddy_dark") === "true"
        } catch {
            return false
        }
    })

    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

    // Persist isDark to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem("walletbuddy_dark", String(isDark))
        } catch {
            // localStorage not available (private mode etc.) — fail silently
        }
    }, [isDark])

    useEffect(() => {
        const handleResize = () => {
            setIsDesktop(window.innerWidth >= 1024)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return (
        <AppContext.Provider value={{ isDark, setIsDark, isDesktop, setIsDesktop }}>
            {children}
        </AppContext.Provider>
    )
}
