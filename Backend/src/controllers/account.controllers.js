const accountModel = require("../models/account.model");
const uploadFile = require("../services/imgStorage.service");



/**
 * @desc Create Account
 * @route POST /api/accounts
 * @access Public
 */
async function createAccountController(req, res) {
    const {DOB, gender} = req.body

    const image = await uploadFile(req.file.buffer);

    const account = await accountModel.create({
        user: req.user._id,
        name: req.user.name,
        email: req.user.email,
        DOB: DOB,
        picture: image.url,
        gender: gender
    })

    return res.status(201).json({
        message: "Account created successfully",
        status: "success",
        account: account
    })
}


/**
 * @desc Get Account Details
 * @route GET /api/accounts/get-account
 * @access Public
 */
async function getAccountDetailsController(req, res) {

    const account = await accountModel.findOne({user: req.user._id})

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    return res.status(200).json({
        message: "Account details fetched successfully",
        status: "success",
        account: account
    })
}

/**
 * @desc Update Account Details
 * @route PUT /api/accounts/update-account
 * @access Public
 */
async function updateAccountPictureController(req, res) {
    const image = await uploadFile(req.file.buffer);
    const account = await accountModel.findOneAndUpdate(
        { user: req.user._id },
        { picture: image.url },
        { returnDocument: 'after' }
    )

    return res.status(200).json({
        message: "Account picture updated successfully",
        status: "success",
        account: account
    })
}


/**
 * @desc Delete Account
 * @route DELETE /api/accounts/delete-account
 * @access Public
 */
async function deleteAccountController(req, res) {
    const account = await accountModel.findOneAndDelete({ user: req.user._id })

    if (!account) {
        return res.status(404).json({
            message: "Account not found",
            status: "failed"
        })
    }

    return res.status(200).json({
        message: "Account deleted successfully",
        status: "success",
        account: account
    })
}

module.exports = {
    createAccountController,
    getAccountDetailsController,
    updateAccountPictureController,
    deleteAccountController
}