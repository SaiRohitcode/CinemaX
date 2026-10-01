const Show = require("../models/Show");
const Booking = require("../models/Booking");

const createShow = async (req, res) => {
    try {
        const {
            movie,
            theatre,
            screen,
            startDate,
            endDate,
            language,
            format,
            showTimes
        } = req.body;

        if (
            !movie ||
            !theatre ||
            !screen ||
            !startDate ||
            !endDate ||
            !language ||
            !format ||
            !showTimes ||
            showTimes.length === 0
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (endDate < startDate) {
            return res.status(400).json({
                success: false,
                message: "End date must be after Start date."
            });
        }

        const shows = [];
        const currentDate = new Date(`${startDate}T00:00:00`);
        const lastDate = new Date(`${endDate}T00:00:00`);

        while (currentDate <= lastDate) {
            for (const showTime of showTimes) {
                const showDate = new Date(currentDate);

                const existingShow = await Show.findOne({
                    movie,
                    theatre,
                    screen,
                    date: showDate,
                    showTime
                });

                if (!existingShow) {
                    shows.push({
                        movie,
                        theatre,
                        screen,
                        date: showDate,
                        language,
                        format,
                        showTime,
                        isActive: true
                    });
                }
            }

            currentDate.setDate(currentDate.getDate() + 1);
        }

        if (shows.length === 0) {
            return res.status(400).json({
                success: false,
                message: "All selected shows already exist."
            });
        }

        const createdShows = await Show.insertMany(shows);

        res.status(201).json({
            success: true,
            message: `${createdShows.length} shows created successfully.`,
            shows: createdShows
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