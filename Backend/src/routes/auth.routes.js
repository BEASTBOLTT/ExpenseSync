const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");



const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });

const router = express.Router();


/**
 * @desc User Registration
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", upload.single("profilePic"), authController.userRegistrationController)


/**
 * @desc User Login
 * @route POST /api/auth/login
 * @access Public
 */
router.post("/login", authController.userLoginController)


/** * @desc User Logout
 * @route POST /api/auth/logout
 * @access Public
 */
router.post("/logout", authController.userLogoutController)

/**
 * @desc Get User Details
 * @route GET /api/auth/user
 * @access Private
 */
router.get("/user",authMiddleware.authMiddleware, authController.userDetailsController)


/**
 * @desc Send OTP for password reset
 * @route POST /api/auth/forgot-password
 * @access Public
 */
router.post("/forgot-password", authController.sendOtpController)


/**
 * @desc Verify OTP and get reset token
 * @route POST /api/auth/verify-otp
 * @access Public
 */
router.post("/verify-otp", authController.verifyOtpController)


/**
 * @desc Reset password with reset token
 * @route POST /api/auth/reset-password
 * @access Public
 */
router.post("/reset-password", authController.resetPasswordController)


module.exports = router;