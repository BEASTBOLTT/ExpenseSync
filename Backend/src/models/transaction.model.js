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
        required:[ true, "Amount is required" ]
    },
    time:{
        type: Date,
        required: [ true, "Time is required" ]
    },
    note: {
        type: String,
    },
    receiptUrl: {
        type: String,
        default: null
    },
    source: {
        type: {
            type: String,
            enum: [ "personal", "space" ],
            default: "personal"
        },
        spaceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Space",
            default: null
        },
        spaceExpenseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SpaceExpense",
            default: null
        }
    }
},{
    timestamps: true
})


const transactionModel = mongoose.model("Transaction", transactionSchema)

module.exports = transactionModel