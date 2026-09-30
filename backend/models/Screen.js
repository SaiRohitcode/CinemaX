const mongoose = require("mongoose");

const SeatSchema = new mongoose.Schema({

    seatId: {
        type: String,
        required: true
    },

    row: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },

    number: {
        type: Number,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    // Physical position in the screen layout
    rowPosition: {
        type: Number,
        required: true
    },

    columnPosition: {
        type: Number,
        required: true
    },

    // Allows gaps/aisles and custom positioning
    positionType: {
        type: String,
        enum: ["SEAT", "AISLE", "EMPTY"],
        default: "SEAT"
    },

    isBlocked: {
        type: Boolean,
        default: false
    }

}, { _id: false });


const SectionSchema = new mongoose.Schema({

    name: {
        type: String,
        required: true
    },

    price: {
        type: Number,
        required: true
    },

    rows: {
        type: Number,
        required: true
    },

    seatsPerRow: {
        type: Number,
        required: true
    }

}, { _id: false });


const ScreenSchema = new mongoose.Schema({

    theatre: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Theatre",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    screenType: {
        type: String,
        enum: [
            "2D",
            "3D",
            "IMAX",
            "4DX",
            "Dolby Atmos"
        ],
        required: true
    },

    // Different sections in this particular screen
    sections: {
        type: [SectionSchema],
        default: []
    },

    totalSeats: {
        type: Number,
        required: true
    },

    seats: {
        type: [SeatSchema],
        default: []
    },

    isActive: {
        type: Boolean,
        default: true
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Screen", ScreenSchema);