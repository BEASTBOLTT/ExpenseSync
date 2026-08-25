import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"
import walletLogo from "../../../assets/wallet.png"

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleLogin({ email, password })
        navigate("/home")
    }

    if (loading) {
        return (
            <main className="h-screen flex items-center justify-center bg-[#FFF3DC]">
                <p className="text-[#5C3D1E] text-lg font-semibold">Loading...</p>
            </main>
        )
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

                <h1 className="text-3xl font-bold text-[#5C3D1E] mb-1">Welcome back 👋</h1>
                <p className="text-[#6B4E2E] text-sm mb-6">Your money. Your groups. One place.</p>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    {/* Email */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="email">Email</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="you@email.com"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="password">Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                            type="password"
                            id="password"
                            name="password"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Forgot Password */}
                    {/* <div className="flex justify-end">
                        <a href="#" className="text-[#6B4E2E] text-xs hover:text-[#5C3D1E] transition-colors">
                            Forgot Password?
                        </a>
                    </div> */}

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-[#5C3D1E] text-white rounded-full py-3 w-full font-semibold text-base transition-transform active:scale-95 hover:bg-[#4a3018] mt-1"
                    >
                        Login
                    </button>

                </form>

                {/* Register link */}
                <p className="text-center text-[#6B4E2E] text-sm mt-5">
                    Don't have an account?{" "}
                    <Link to="/register" className="font-bold text-[#5C3D1E] hover:underline">
                        Register
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default Login
