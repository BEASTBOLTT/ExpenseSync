/**
 * @desc Global Error Handler
 * @usage Add as the LAST middleware in app.js after all routes
 * @note Express 5 automatically forwards async errors to this handler
 */
function errorMiddleware(err, req, res, next) {
    console.error(err.stack)

    const statusCode = err.statusCode || 500
    const message = err.message || "Something went wrong"

    res.status(statusCode).json({
        message,
        status: "error"
    })
}

module.exports = { errorMiddleware }
