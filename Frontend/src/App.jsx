import { RouterProvider } from "react-router"
import { router } from "./app.routes.jsx"
import { AuthProvider } from "./features/auth/auth.context.jsx"
import { AppProvider } from "./context/app.context.jsx"

function App() {
    return (
        <AppProvider>
            <AuthProvider>
                <RouterProvider router={router} />
            </AuthProvider>
        </AppProvider>
    )
}

export default App
