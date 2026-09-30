const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    show: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Show",
        required: true
    },

    movie: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie",
        required: true
    },

    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },

    screen: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Screen",
        required: true
    },

    seats: [{
        type: String,
        required: true
    }],

    numberOfSeats: {
        type: Number,
        required: true
    },

    ticketPrice: {
        type: Number,
        required: true
    },

    convenienceFee: {
        type: Number,
        default: 40
    },

    gst: {
        type: Number,
        default: 18
    },

    totalPrice: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        enum: [
            "UPI",
            "Card",
            "Net Banking",
            "Wallet"
        ],
        default: "UPI"
    },

    paymentStatus: {
        type: String,
        enum: [
            "Pending",
            "Success",
            "Failed"
        ],
        default: "Success"
    },

    bookingStatus: {
        type: String,
        enum: [
            "Confirmed",
            "Cancelled"
        ],
        default: "Confirmed"
    },

    bookingId: {
        type: String,
        unique: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Booking", bookingSchema);