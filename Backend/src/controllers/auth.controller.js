const userModel = require("../models/user.model");
const accountModel = require("../models/account.model");
const uploadFile = require("../services/imgStorage.service");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlacklist.model");

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

module.exports = {
    userRegistrationController,
    userLoginController,
    userLogoutController,
    userDetailsController
}