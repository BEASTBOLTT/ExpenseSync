import { createHashRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import ForgotPasswordPage from "./features/auth/pages/ForgotPasswordPage"
import ResetPasswordPage from "./features/auth/pages/ResetPasswordPage"
import Protected from "./features/auth/components/Protected"
import Layout from "./components/Layout"
import Home from "./features/home/pages/Home"
import Profile from "./features/profile/pages/Profile"
import EditProfile from "./features/profile/pages/EditProfile"
import AddTransactionPage from "./features/transactions/pages/AddTransactionPage"
import TransactionsPage from "./features/transactions/pages/TransactionsPage"
import TransactionDetailPage from "./features/transactions/pages/TransactionDetailPage"
import SpacesPage from "./features/spaces/pages/SpacesPage"
import SpaceDetailPage from "./features/spaces/pages/SpaceDetailPage"
import MembersPage from "./features/spaces/pages/MembersPage"
import CreateSpacePage from "./features/spaces/pages/CreateSpacePage"
import AnalyticsPage from "./features/analytics/pages/AnalyticsPage"

export const router = createHashRouter([
    {
        path: "/",
        element: <Navigate to="/home" replace />
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
        path: "/forgot-password",
        element: <ForgotPasswordPage />
    },
    {
        path: "/reset-password",
        element: <ResetPasswordPage />
    },
    {
        element: <Protected><Layout /></Protected>,
        children: [
            { path: "/home", element: <Home /> },
            { path: "/transactions", element: <TransactionsPage />},
            { path: "/transactions/add-expense", element: <AddTransactionPage mode="expense" />},
            { path: "/transactions/add-income", element: <AddTransactionPage mode="income" />},
            { path: "/transactions/edit/:transactionId", element: <AddTransactionPage />},
            { path: "/transactions/:transactionId", element: <TransactionDetailPage />},
            { path: "/spaces", element: <SpacesPage /> },
            { path: "/spaces/create", element: <CreateSpacePage />},
            { path: "/spaces/:spaceId", element: <SpaceDetailPage />},
            { path: "/spaces/:spaceId/members", element: <MembersPage />},
            { path: "/analytics", element: <AnalyticsPage />},
            { path: "/profile", element: <Profile />},
            { path: "/profile/edit", element: <EditProfile />},
        ]
    }
])
