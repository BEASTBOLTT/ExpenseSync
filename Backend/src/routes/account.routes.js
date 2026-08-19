const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controllers");
const multer = require("multer");


const upload = multer({storage: multer.memoryStorage()});

const router = express.Router();

/**
 * @desc Create Account
 * @route POST /api/accounts/create-account
 * @access Public
 */
router.post("/create-account", authMiddleware.authMiddleware, upload.single("picture"), accountController.createAccountController)


/** * @desc Get Account Details
 * @route GET /api/accounts
 * @access Public
 */
router.get("/get-account", authMiddleware.authMiddleware, accountController.getAccountDetailsController)


/** * @desc Update Account Picture
 * @route PUT /api/accounts/update-account
 * @access Public
 */
router.put("/update-account", authMiddleware.authMiddleware, upload.single("picture"), accountController.updateAccountPictureController)


/** 
 * @desc Delete Account
 * @route POST /api/accounts/delete-account
 * @access Public
 */
router.delete("/delete-account", authMiddleware.authMiddleware, accountController.deleteAccountController)


/** 
 * @desc Edit Profile (name, DOB, gender, picture)
 * @route PUT /api/accounts/edit-profile
 * @access Private
 */
router.put("/edit-profile", authMiddleware.authMiddleware, upload.single("picture"), accountController.updateAccountController)


module.exports = router;