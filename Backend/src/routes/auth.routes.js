const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");



const router = express.Router();


/**
 * @desc User Registration
 * @route POST /api/auth/register
 * @access Public
 */
router.post("/register", authController.userRegistrationController)


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


module.exports = router;