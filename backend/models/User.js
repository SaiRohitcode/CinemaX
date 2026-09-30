const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    mobile: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },

    gender: {
        type: String,
        default: ""
    },

    dob: {
        type: String,
        default: ""
    },

    city: {
        type: String,
        default: ""
    },

    state: {
        type: String,
        default: ""
    },

    isAdmin: {
        type: Boolean,
        default: false
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);