const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const tokenBlackListModel = require("../models/tokenBlacklist.model");


/**
 * @desc User Registration
 * @route POST /api/auth/register
 * @access Public
 */
async function userRegistrationController(req, res) {
    const { name, email, password } = req.body;

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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(201).json({
        message: "User registered successfully.",
        status: "success",
        user: {
            _id: user._id,
            name: user.name,
            email: user.email
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })

    res.cookie("token", token)
    res.status(200).json({
        message: "User logged in successfully.",
        status: "success",
        user: {
            _id: user._id,
            username: user.username,
            email: user.email
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

    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully.",
        status: "success"
    });
}

module.exports = {
    userRegistrationController,
    userLoginController,
    userLogoutController
}