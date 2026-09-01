import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router"
import { resetPassword } from "../services/auth.api"
import walletLogo from "../../../assets/wallet.png"

const ResetPasswordPage = () => {

    const navigate  = useNavigate()
    const location  = useLocation()

    // resetToken + email passed via navigate state from ForgotPasswordPage
    const { resetToken, email } = location.state || {}

    const [newPassword, setNewPassword]         = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [loading, setLoading]                 = useState(false)
    const [error, setError]                     = useState("")

    // Guard: if someone lands here directly without a token, send them back
    if (!resetToken) {
        return (
            <main className="min-h-screen bg-[#FFF3DC] flex flex-col items-center justify-center px-4">
                <div className="bg-[#FFDDB3] rounded-3xl p-8 w-full max-w-md shadow-sm text-center">
                    <p className="text-[#5C3D1E] text-lg font-semibold mb-4">Session expired or invalid link.</p>
                    <Link to="/forgot-password" className="text-[#5C3D1E] font-bold hover:underline">
                        ← Start again
                    </Link>
                </div>
            </main>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match. Please try again.")
            return
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long.")
            return
        }

        setLoading(true)
        const data = await resetPassword({ resetToken, newPassword, confirmPassword })
        setLoading(false)

        if (data?.status === "success") {
            navigate("/login", { state: { successMessage: "Password reset successfully! Please log in." } })
        } else {
            setError(data?.message || "Something went wrong. Please try again.")
        }
    }

    return (
        <main className="min-h-screen bg-[#FFF3DC] flex flex-col items-center justify-center px-4">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
                <img src={walletLogo} alt="WalletBuddy Logo" className="w-10 h-10 object-contain shrink-0" />
                <span className="text-[#5C3D1E] text-2xl font-bold tracking-wide">
                    Wallet<span className="font-black">Buddy</span>
                </span>
            </div>

            {/* Card */}
            <div className="bg-[#FFDDB3] rounded-3xl p-8 w-full max-w-md shadow-sm">

                <h1 className="text-3xl font-bold text-[#5C3D1E] mb-1">New Password</h1>
                <p className="text-[#6B4E2E] text-sm mb-6">
                    {email ? <>Creating a new password for <span className="font-semibold">{email}</span>.</> : "Create your new password below."}
                </p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    {/* New Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="newPassword">
                            New Password
                        </label>
                        <input
                            id="newPassword"
                            type="password"
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                        />
                    </div>

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="confirmPassword">
                            Confirm New Password
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Re-enter your new password"
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                        />
                    </div>

                    {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-[#5C3D1E] text-white rounded-full py-3 w-full font-semibold text-base transition-transform active:scale-95 hover:bg-[#4a3018] mt-1 disabled:opacity-60"
                    >
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>

                </form>

                <p className="text-center text-[#6B4E2E] text-sm mt-5">
                    <Link to="/login" className="font-bold text-[#5C3D1E] hover:underline">
                        ← Back to Login
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default ResetPasswordPage
