import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";





const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: [true, "userName is required"],
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    },

    fullName: {
        type: String,
        required: [true, "full name is required"],
        index: true,
        trim: true,
    },

    email: {
        type: String,
        required: [true, "userName is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },

    avatar: {
        type: String,
        required: true,
    }
    ,
    coverImage: String,

    watchHistory: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Video",
        }
    ],

    password: {
        type: String,
        required: [true, "Password is required"],
    },

    refreshToken: String,

}, { timestamps: true, })


userSchema.pre('save', async function (next) {
    if (!this.isModified(this.password)) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();

})

userSchema.methods.isPasswordCorrecr = async function (password) {

    return await bcrypt.compare(password, this.password);


}


userSchema.methods.genratingAccessToken = async function () {
    jwt.sign({
        _id: this._id,
        userName: this.userName,
    },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        }

    )

}


userSchema.methods.genratingRefreshToken = async function () {
    jwt.sign({
        _id: this._id,
        userName: this.userName,
    },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        }

    )

}


export const User = mongoose.model("User", userSchema);