const express = require("express");
const authRoutes = require("./routes/auth.routes");
const accountRoutes = require("./routes/account.routes");
const transactionRoutes = require("./routes/transaction.routes")
const categoryRoutes = require("./routes/category.routes")
const cookieParser = require("cookie-parser")
const { errorMiddleware } = require("./middlewares/error.middleware")



const app = express();
app.use(cookieParser());


app.use(express.json());



app.use("/api/auth", authRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/categories", categoryRoutes);
app.use(errorMiddleware);


module.exports = app;