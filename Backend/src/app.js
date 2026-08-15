const express = require("express");
const cors = require("cors")
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes")
const categoryRoutes = require("./routes/category.routes")
const spaceRoutes = require("./routes/space.routes")
const analyticsRoutes = require("./routes/analytics.routes")
const cookieParser = require("cookie-parser")
const { errorMiddleware } = require("./middlewares/error.middleware")



const app = express();



app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
}))



app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use(errorMiddleware);


module.exports = app;