const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        genre: {
            type: [String],
            required: true
        },
        languages: {
            type: [String],
            required: true
        },
        formats: {
            type: [String],
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        releaseDate: {
            type: Date,
            required: true
        },
        availableFrom: {
            type: Date,
            required: true
        },
        availableUntil: {
            type: Date,
            required: true
        },
        rating: {
            type: Number,
            default: 0
        },
        poster: {
            type: String,
            required: true
        },
        trailer: {
            type: String
        },
        certificate: {
            type: String,
            required: true
        },
        comingSoon: {
            type: Boolean,
            default: false
        },
        isActive: {
            type: Boolean,
            default: true
        },
        heroBanner: {
            type: Boolean,
            default: false
        },

        heroTitle: {
            type: String,
            default: ""
        },

        heroDescription: {
            type: String,
            default: ""
        },

        heroImage: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Movie", movieSchema);