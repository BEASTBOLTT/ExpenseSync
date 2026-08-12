const mongoose = require("mongoose");



const memberSchema = new mongoose.Schema({
    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        default: null
    },
    name: {
        type: String,
        required: [ true, "Member name is required" ]
    },
    isMock: {
        type: Boolean,
        default: false
    },
    joinedAt: {
        type: Date,
        default: Date.now
    }
})




const spaceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [ true, "Space name is required" ],
        trim: true
    },
    type: {
        type: String,
        enum: [ "trip", "flat", "project", "event", "other" ],
        required: [ true, "Space type is required" ]
    },
    coverImage: {
        type: String,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [ true, "Space must be associated with an account" ]
    },
    members: [ memberSchema ]
}, {
    timestamps: true
})



const splitSchema = new mongoose.Schema({
    memberId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "Member ID is required in split" ]
    },
    amount: {
        type: Number,
        required: [ true, "Split amount is required" ]
    }
})




const spaceExpenseSchema = new mongoose.Schema({
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
        required: [ true, "Space expense must be associated with a space" ],
        index: true
    },
    paidBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "paidBy member is required" ]
    },
    amount: {
        type: Number,
        required: [ true, "Amount is required" ]
    },
    description: {
        type: String,
        required: [ true, "Description is required" ],
        trim: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: [ true, "Category is required" ]
    },
    date: {
        type: Date,
        required: [ true, "Date is required" ]
    },
    receiptUrl: {
        type: String,
        default: null
    },
    splitType: {
        type: String,
        enum: [ "equal", "exact", "percentage", "shares" ],
        required: [ true, "Split type is required" ]
    },
    splits: [ splitSchema ]
}, {
    timestamps: true
})




const settlementSchema = new mongoose.Schema({
    spaceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Space",
        required: [ true, "Settlement must be associated with a space" ],
        index: true
    },
    fromMember: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "fromMember is required" ]
    },
    toMember: {
        type: mongoose.Schema.Types.ObjectId,
        required: [ true, "toMember is required" ]
    },
    amount: {
        type: Number,
        required: [ true, "Settlement amount is required" ]
    },
    date: {
        type: Date,
        default: Date.now
    },
    note: {
        type: String,
        default: null
    }
}, {
    timestamps: true
})



const spaceModel = mongoose.model("Space", spaceSchema)
const spaceExpenseModel = mongoose.model("SpaceExpense", spaceExpenseSchema)
const settlementModel = mongoose.model("Settlement", settlementSchema)

module.exports = { spaceModel, spaceExpenseModel, settlementModel }
