import { useState, useRef } from "react"
import { Link, useNavigate } from "react-router"
import { useAuth } from "../hooks/useAuth"

const Register = () => {

    const { loading, handleRegister } = useAuth()
    const navigate = useNavigate()

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [dob, setDob] = useState("")
    const [gender, setGender] = useState("Male")
    const [preview, setPreview] = useState(null)

    const profilePicRef = useRef()

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const formData = new FormData()
        formData.append("name", name)
        formData.append("email", email)
        formData.append("password", password)
        formData.append("dob", dob)
        formData.append("gender", gender)

        const file = profilePicRef.current.files[0]
        if (file) formData.append("profilePic", file)

        await handleRegister(formData)
        navigate("/profile")
    }

    if (loading) {
        return (
            <main className="h-screen flex items-center justify-center bg-[#FFF3DC]">
                <p className="text-[#5C3D1E] text-lg font-semibold">Loading...</p>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-[#FFF3DC] flex flex-col items-center justify-center px-4 py-8">

            {/* Logo */}
            <div className="flex items-center gap-2 mb-6">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center text-white text-lg">
                    👛
                </div>
                <span className="text-[#5C3D1E] text-2xl font-bold tracking-wide">
                    Wallet<span className="font-black">Buddy</span>
                </span>
            </div>

            {/* Card */}
            <div className="bg-[#FFDDB3] rounded-3xl p-8 w-full max-w-md shadow-sm">

                <h1 className="text-3xl font-bold text-[#5C3D1E] mb-6">Create Account</h1>

                {/* Avatar Upload */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-full bg-[#FFF3DC] flex items-center justify-center overflow-hidden">
                            {preview ? (
                                <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                            ) : (
                                <svg className="w-10 h-10 text-[#6B4E2E]" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
                                </svg>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={() => profilePicRef.current.click()}
                            className="absolute bottom-0 right-0 w-7 h-7 bg-[#5C3D1E] rounded-full flex items-center justify-center text-white text-xs shadow-md hover:bg-[#4a3018] transition-colors"
                        >
                            📷
                        </button>
                        <input
                            ref={profilePicRef}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={handleImageChange}
                        />
                    </div>
                </div>

                <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

                    {/* Full Name */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="name">Full name</label>
                        <input
                            onChange={(e) => setName(e.target.value)}
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Devam Pandey"
                        />
                    </div>

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

                    {/* Confirm Password */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="confirmPassword">Confirm password</label>
                        <input
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* Date of Birth */}
                    <div className="flex flex-col gap-1">
                        <label className="text-[#5C3D1E] text-sm font-semibold" htmlFor="dob">Date of birth</label>
                        <input
                            onChange={(e) => setDob(e.target.value)}
                            className="bg-white/70 rounded-full px-5 py-3 text-[#5C3D1E] placeholder:text-[#B89070] text-sm outline-none w-full"
                            type="date"
                            id="dob"
                            name="dob"
                        />
                    </div>

                    {/* Gender */}
                    <div className="flex flex-col gap-2">
                        <label className="text-[#5C3D1E] text-sm font-semibold">Gender</label>
                        <div className="flex gap-2">
                            {["Male", "Female", "Other"].map((option) => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => setGender(option)}
                                    className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${
                                        gender === option
                                            ? "bg-[#5C3D1E] text-white"
                                            : "bg-white/40 text-[#6B4E2E] hover:bg-white/60"
                                    }`}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        className="bg-[#5C3D1E] text-white rounded-full py-3 w-full font-semibold text-base transition-transform active:scale-95 hover:bg-[#4a3018] mt-1"
                    >
                        Register
                    </button>

                </form>

                {/* Login link */}
                <p className="text-center text-[#6B4E2E] text-sm mt-5">
                    Already have an account?{" "}
                    <Link to="/login" className="font-bold text-[#5C3D1E] hover:underline">
                        Login
                    </Link>
                </p>

            </div>
        </main>
    )
}

export default Register
