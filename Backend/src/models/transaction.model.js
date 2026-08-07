const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    account:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [ true, "transaction must be associated with an account" ],
        index: true
    },
    type:{
        type: String,
        enum: [ "Credit", "Debit" ],
        required: [ true, "transaction type is required" ]
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [ true, "transaction category is required" ]
    },
    amount:{
        type: Number,
        required:[true, "Amount is required"]
    },
    time:{
        type: Date,
        required: [true, "Time is required"]
    },
    note: {
        type: String,
    },
    group:{
        type: String,
        required: [true, "Group is required"]
    }
},{
    timestamps: true
})


const transactionModel = mongoose.model("Transaction", transactionSchema)

module.exports = transactionModel