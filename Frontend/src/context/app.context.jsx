import { createContext, useState, useEffect } from "react"

export const AppContext = createContext()

export function AppProvider({ children }) {

    const [isDark, setIsDark] = useState(false)
    const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024)

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
