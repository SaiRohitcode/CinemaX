const Show = require("../models/Show");
const Booking = require("../models/Booking");

const createShow = async (req, res) => {

    try {

        const {
            movie,
            theatre,
            screen,
            date,
            language,
            format,
            showTime,
            pricing
        } = req.body;

        if (
            !movie ||
            !theatre ||
            !screen ||
            !date ||
            !language ||
            !format ||
            !showTime ||
            !pricing ||
            pricing.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const show = await Show.create(req.body);

        res.status(201).json({
            success: true,
            message: "Show created successfully.",
            show
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const getShows = async (req, res) => {

    try {

        const shows = await Show.find({ isActive: true })
            .populate("movie")
            .populate("theatre")
            .populate("screen")
            .sort({ date: 1 });

        res.status(200).json({
            success: true,
            count: shows.length,
            shows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};


const getShow = async (req, res) => {

    try {

        const show = await Show.findById(req.params.id)
            .populate("movie")
            .populate("theatre")
            .populate("screen");

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found."
            });
        }

        res.status(200).json({
            success: true,
            show
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getShowsByMovie = async (req, res) => {

    try {

        const shows = await Show.find({
            movie: req.params.movieId,
            isActive: true
        })
            .populate("movie")
            .populate("theatre")
            .populate("screen")
            .sort({
                date: 1,
                showTime: 1
            });

        res.status(200).json({
            success: true,
            count: shows.length,
            shows
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Seat Layout for a Show
const getShowSeats = async (req, res) => {

    try {

        const show = await Show.findById(req.params.showId)
            .populate("movie")
            .populate("theatre")
            .populate("screen");

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found."
            });
        }

        const bookings = await Booking.find({
            show: show._id,
            bookingStatus: "Confirmed"
        });

        const bookedSeats = bookings.flatMap(
            booking => booking.seats
        );

        res.status(200).json({
            success: true,
            show,
            screen: show.screen,
            bookedSeats
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateShow = async (req, res) => {

    try {

        const show = await Show.findById(req.params.id);

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found."
            });
        }

        const updatedShow = await Show.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Show updated successfully.",
            show: updatedShow
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteShow = async (req, res) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);

        if (!show) {
            return res.status(404).json({
                success: false,
                message: "Show not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Show deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createShow,
    getShows,
    getShow,
    getShowsByMovie,
    getShowSeats,
    updateShow,
    deleteShow
};