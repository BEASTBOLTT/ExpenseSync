const  mongoose = require("mongoose");

const accountSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [ true, "Account must be associated with a user" ],
        index: true
    },
    name:{
        type: String,
        required: [ true, "Account name is required" ]
    },
    email:{
        type: String,
        required: [ true, "Account email is required" ]
    },
    DOB:{
        type: Date,
        required: [ true, "Account date of birth is required" ]
    },
    picture:{
        type: String
    },
    gender:{
        type: String,
        enum: [ "Male", "Female", "Other" ],
        required: [ true, "Account gender is required" ]
    }

},{
    timestamps: true
})

const accountModel = mongoose.model("Account", accountSchema)

module.exports = accountModel