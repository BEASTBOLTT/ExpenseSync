const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:[true, "Please provide an email"],
        unique:[true, "Email already exists"],
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        ],
        trim: true,
        lowercase: true,
    },
    name:{
        type:String,
        required:[true, "Please provide a name"],
    },
    password:{
        type:String,
        required:[true, "Please provide a password"],
        minlength:[6, "Password must be at least 6 characters long"],
        select: false,
    }
},{ 
    timestamps: true,
})

userSchema.pre("save", async function () {
    if (!this.isModified("password")) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash

    return

})

userSchema.methods.comparePassword = async function (password) {

    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("User", userSchema)

module.exports = userModel