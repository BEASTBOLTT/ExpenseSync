import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { forgotPassword, verifyOtp } from "../services/auth.api"
import walletLogo from "../../../assets/wallet.png"

const ForgotPasswordPage = () => {

    const navigate = useNavigate()

    // step: "email" | "otp"
    const [step, setStep]       = useState("email")
    const [email, setEmail]     = useState("")
    const [otp, setOtp]         = useState(["", "", "", "", "", ""])
    const [loading, setLoading] = useState(false)
    const [error, setError]     = useState("")
    const [info, setInfo]       = useState("")

    // ── Step 1: Send OTP ────────────────────────────────────────────────────
    const handleSendOtp = async (e) => {
        e.preventDefault()
        setError("")
        setInfo("")
        setLoading(true)

        const data = await forgotPassword({ email })

        setLoading(false)

        if (data?.status === "success") {
            setInfo("OTP sent! Check your email.")
            setStep("otp")
        } else {
            setError("Something went wrong. Please try again.")
        }
    }

    // ── OTP input helpers ───────────────────────────────────────────────────
    const handleOtpChange = (index, value) => {
        if (!/^\d*$/.test(value)) return          // digits only
        const next = [...otp]
        next[index] = value.slice(-1)             // only last char
        setOtp(next)

        // auto-focus next box
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus()
        }
    }

    const handleOtpKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus()
        }
    }

    const handleOtpPaste = (e) => {
        const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)
        if (paste.length === 6) {
            setOtp(paste.split(""))
            document.getElementById("otp-5")?.focus()
        }
        e.preventDefault()
    }

    // ── Step 2: Verify OTP ──────────────────────────────────────────────────
    const handleVerifyOtp = async (e) => {
        e.preventDefault()
        setError("")
        const otpString = otp.join("")

        if (otpString.length < 6) {
            setError("Please enter the complete 6-digit OTP.")
            return
        }

        setLoading(true)
        const data = await verifyOtp({ email, otp: otpString })
        setLoading(false)

        if (data?.status === "success") {
            // Pass resetToken + email to reset-password page via state
            navigate("/reset-password", { state: { resetToken: data.resetToken, email } })
        } else {
            setError(data?.message || "Invalid OTP. Please try again.")
            setOtp(["", "", "", "", "", ""])
            document.getElementById("otp-0")?.focus()
        }
    }

    // ── Resend OTP ──────────────────────────────────────────────────────────
    const handleResend = async () => {
        setError("")
        setOtp(["", "", "", "", "", ""])
        setLoading(true)
        await forgotPassword({ email })
        setLoading(false)
        setInfo("A new OTP has been sent to your email.")
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

                {step === "email" ? (
                    <>
                        <h1 className="text-3xl font-bold text-[#5C3D1E] mb-1">Forgot Password?</h1>
                        <p className="text-[#6B4E2E] text-sm mb-6">
                            Enter your registered email and we'll send you a 6-digit OTP to reset your password.
                        </p>

                        <form className="flex flex-col gap-4" onSubmit={handleSendOtp}>

                            <div className="flex flex-col gap-1">
                                <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@email.com"
                                    className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                                />
                            </div>

                            {error && <p className="text-red-600 text-sm text-center">{error}</p>}
                            {info  && <p className="text-green-700 text-sm text-center">{info}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#5C3D1E] text-white rounded-full py-3 w-full font-semibold text-base transition-transform active:scale-95 hover:bg-[#4a3018] mt-1 disabled:opacity-60"
                            >
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>

                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-3xl font-bold text-[#5C3D1E] mb-1">Enter OTP</h1>
                        <p className="text-[#6B4E2E] text-sm mb-6">
                            We sent a 6-digit OTP to <span className="font-semibold">{email}</span>. It expires in 10 minutes.
                        </p>

                        <form className="flex flex-col gap-6" onSubmit={handleVerifyOtp}>

                            {/* 6 OTP boxes */}
                            <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                                {otp.map((digit, i) => (
                                    <input
                                        key={i}
                                        id={`otp-${i}`}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleOtpChange(i, e.target.value)}
                                        onKeyDown={(e) => handleOtpKeyDown(i, e)}
                                        className="w-12 h-14 text-center text-2xl font-bold bg-white/70 rounded-2xl text-[#5C3D1E] outline-none focus:ring-2 focus:ring-[#5C3D1E] transition"
                                    />
                                ))}
                            </div>

                            {error && <p className="text-red-600 text-sm text-center -mt-2">{error}</p>}
                            {info  && <p className="text-green-700 text-sm text-center -mt-2">{info}</p>}

                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-[#5C3D1E] text-white rounded-full py-3 w-full font-semibold text-base transition-transform active:scale-95 hover:bg-[#4a3018] disabled:opacity-60"
                            >
                                {loading ? "Verifying..." : "Verify OTP"}
                            </button>

                        </form>

                        {/* Resend */}
                        <p className="text-center text-[#6B4E2E] text-sm mt-5">
                            Didn't receive it?{" "}
                            <button
                                onClick={handleResend}
                                disabled={loading}
                                className="font-bold text-[#5C3D1E] hover:underline disabled:opacity-60"
                            >
                                Resend OTP
                            </button>
                        </p>
                    </>
                )}

                {/* Back to login */}
                <p className="text-center text-[#6B4E2E] text-sm mt-5">
                    Remember your password?{" "}
                    <Link to="/login" className="font-bold text-[#5C3D1E] hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default ForgotPasswordPage
