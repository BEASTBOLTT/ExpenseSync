const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const uploadFile = require("../services/imgStorage.service");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlacklist.model");
const emailService = require("../services/email.service");

// ── Cookie options ─────────────────────────────────────────────────────────
// In production (split hosting): sameSite must be 'none' + secure:true so the
// browser sends the cookie cross-origin (frontend on Vercel → backend on Render).
// In development (same-origin via Vite proxy): 'lax' is fine.
const isProduction = process.env.NODE_ENV === "production"

const cookieOptions = {
    httpOnly: true,
    sameSite: isProduction ? "none" : "lax",
    secure: isProduction,// must be true when sameSite is 'none'
    maxAge: 3 * 24 * 60 * 60 * 1000   // 3 days in ms
}


/**
 * @desc User Registration
 * @route POST /api/auth/register
 * @access Public
 */
async function userRegistrationController(req, res) {
    const { name, email, password, dob, gender } = req.body;

    const isExists = await userModel.findOne({
        email: email
    })

    if (isExists) {
        return res.status(422).json({
            message: "User already exists with email.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, password, name
    })

    let pictureUrl = null
    if (req.file) {
        try {
            const image = await uploadFile(req.file.buffer)
            pictureUrl = image.url
        } catch (err) {
            console.error("Image upload failed:", err)
        }
    }

    await accountModel.create({
        user: user._id,
        name: user.name,
        email: user.email,
        DOB: dob ? new Date(dob) : new Date("2000-01-01"),
        picture: pictureUrl,
        gender: gender || "Male"
    })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token, cookieOptions)
    res.status(201).json({
        message: "User registered successfully.",
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: pictureUrl
        }
    })

    // Send welcome email after responding — fire-and-forget so it never delays the user
    await emailService.sendRegistrationEmail(user.email, user.name)
}


/**
 * @desc User Login
 * @route POST /api/auth/login
 * @access Public
 */
async function userLoginController(req, res) {
    const { email, password } = req.body;

    const user = await userModel.findOne({email}).select("+password")

    if (!user) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            message: "Email or password is INVALID"
        })
    }

    const account = await accountModel.findOne({ user: user._id })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        message: "User logged in successfully.",
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            picture: account ? account.picture : null
        },
        token
    })

    // Send login notification email after responding — fire-and-forget
    await emailService.sendLoginEmail(user.email, user.name)
}

/**
 * @desc User Logout
 * @route POST /api/auth/logout
 * @access Public
 */
async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if (!token) {
        return res.status(200).json({
            message: "User logged out successfully"
        })
    }

    await tokenBlackListModel.create({ token });

    res.clearCookie("token", cookieOptions);
    res.status(200).json({
        message: "User logged out successfully.",
        status: "success"
    });
}

/**
 * @desc Get User Details
 * @route GET /api/auth/user
 * @access Private
 */ 
async function userDetailsController(req, res){
    const user = req.user;
    const account = await accountModel.findOne({ user: user._id });

    return res.status(200).json({
        message: "User details fetched successfully.",
        name: user.name,
        email: user.email,
        id: user._id,
        picture: account ? account.picture : null
    })
}

/**
 * @desc Send OTP for password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
async function sendOtpController(req, res) {
    const { email } = req.body

    const user = await userModel.findOne({ email })

    // Generic message — don't reveal whether email exists
    if (!user) {
        return res.status(200).json({
            message: "If this email is registered, an OTP has been sent.",
            status: "success"
        })
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString()

    // Hash OTP before storing
    const bcrypt = require("bcryptjs")
    const otpHash = await bcrypt.hash(otp, 10)

    // Use findByIdAndUpdate to skip the pre-save password hashing hook
    await userModel.findByIdAndUpdate(user._id, {
        otpHash,
        otpExpiry: new Date(Date.now() + 10 * 60 * 1000) // 10 minutes from now
    })

    await emailService.sendOtpEmail(user.email, user.name, otp)

    return res.status(200).json({
        message: "If this email is registered, an OTP has been sent.",
        status: "success"
    })
}


/**
 * @desc Verify OTP and return a short-lived reset token
 * @route POST /api/auth/verify-otp
 * @access Public
 */
async function verifyOtpController(req, res) {
    const { email, otp } = req.body

    const user = await userModel.findOne({ email }).select("+otpHash +otpExpiry")

    if (!user || !user.otpHash || !user.otpExpiry) {
        return res.status(400).json({
            message: "Invalid or expired OTP. Please request a new one.",
            status: "failed"
        })
    }

    // Check expiry
    if (user.otpExpiry < new Date()) {
        // Clear OTP fields without triggering password hook
        await userModel.findByIdAndUpdate(user._id, {
            otpHash: null,
            otpExpiry: null
        })

        return res.status(400).json({
            message: "OTP has expired. Please request a new one.",
            status: "failed"
        })
    }

    // Compare OTP
    const bcrypt = require("bcryptjs")
    const isMatch = await bcrypt.compare(otp, user.otpHash)

    if (!isMatch) {
        return res.status(400).json({
            message: "Invalid OTP. Please try again.",
            status: "failed"
        })
    }

    // Clear OTP fields without triggering password hook
    await userModel.findByIdAndUpdate(user._id, {
        otpHash: null,
        otpExpiry: null
    })

    // Issue a short-lived reset token (15 min) — required by reset-password endpoint
    const resetToken = jwt.sign(
        { userId: user._id, purpose: "password-reset" },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
    )

    return res.status(200).json({
        message: "OTP verified successfully.",
        status: "success",
        resetToken
    })
}


/**
 * @desc Reset password using a valid reset token
 * @route POST /api/auth/reset-password
 * @access Public (requires resetToken from verify-otp)
 */
async function resetPasswordController(req, res) {
    const { resetToken, newPassword, confirmPassword } = req.body

    if (!resetToken) {
        return res.status(400).json({
            message: "Reset token is required.",
            status: "failed"
        })
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            message: "Passwords do not match.",
            status: "failed"
        })
    }

    if (newPassword.length < 6) {
        return res.status(400).json({
            message: "Password must be at least 6 characters long.",
            status: "failed"
        })
    }

    // Verify reset token
    let decoded
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET)
    } catch (err) {
        return res.status(400).json({
            message: "Reset token is invalid or has expired. Please start over.",
            status: "failed"
        })
    }

    if (decoded.purpose !== "password-reset") {
        return res.status(400).json({
            message: "Invalid reset token.",
            status: "failed"
        })
    }

    const user = await userModel.findById(decoded.userId)

    if (!user) {
        return res.status(404).json({
            message: "User not found.",
            status: "failed"
        })
    }

    // Update password — pre-save hook will hash it
    user.password = newPassword
    await user.save()

    res.status(200).json({
        message: "Password reset successfully. You can now log in with your new password.",
        status: "success"
    })

    // Send confirmation email after responding — fire-and-forget
    await emailService.sendPasswordChangedEmail(user.email, user.name)
}

module.exports = {
    userRegistrationController,
    userLoginController,
    userLogoutController,
    userDetailsController,
    sendOtpController,
    verifyOtpController,
    resetPasswordController
}