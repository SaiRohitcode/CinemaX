const mongoose = require("mongoose");

const ShowSchema = new mongoose.Schema({

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

    date: {
        type: Date,
        required: true
    },

    language: {
        type: String,
        required: true,
        trim: true
    },

    format: {
        type: String,
        required: true,
        enum: ["2D", "3D", "IMAX", "4DX", "Dolby Atmos"]
    },

    showTime: {
        type: String,
        required: true
    },

    pricing: [
        {
            section: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],

    isActive: {
        type: Boolean,
        default: true
    }

},
    {
        timestamps: true
    });

module.exports = mongoose.model("Show", ShowSchema);