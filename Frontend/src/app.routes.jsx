import { createHashRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Layout from "./components/Layout"
import Profile from "./features/profile/pages/Profile"

export const router = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/profile" replace />
    },
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/register",
        element: <Register />
    },
    {
        element: <Protected><Layout /></Protected>,
        children: [
            { path: "/home", element: <div>Home (coming soon)</div> },
            { path: "/transactions", element: <div>Transactions (coming soon)</div> },
            { path: "/spaces", element: <div>Spaces (coming soon)</div> },
            { path: "/analytics", element: <div>Analytics (coming soon)</div> },
            { path: "/profile", element: <Profile /> },
        ]
    }
])

