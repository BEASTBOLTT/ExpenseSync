import { createHashRouter, Navigate } from "react-router"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/pages/Register"
import Protected from "./features/auth/components/Protected"
import Layout from "./components/Layout"
import Home from "./features/home/pages/Home"
import Profile from "./features/profile/pages/Profile"
import AddTransactionPage from "./features/transactions/pages/AddTransactionPage"

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
        element: <Protected><Layout /></Protected>,
        children: [
            { path: "/home",                         element: <Home />                                                       },
            { path: "/transactions",                 element: <div>Transactions (coming soon)</div>                          },
            { path: "/transactions/add-expense",     element: <AddTransactionPage mode="expense" />                          },
            { path: "/transactions/add-income",      element: <AddTransactionPage mode="income" />                           },
            { path: "/spaces",                       element: <div>Spaces (coming soon)</div>                                },
            { path: "/spaces/create",                element: <div>Create Space (coming soon)</div>                          },
            { path: "/spaces/:spaceId",              element: <div>Space Detail (coming soon)</div>                          },
            { path: "/analytics",                    element: <div>Analytics (coming soon)</div>                             },
            { path: "/profile",                      element: <Profile />                                                    },
        ]
    }
])
