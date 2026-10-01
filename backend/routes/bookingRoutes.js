const express = require("express");
const router = express.Router();

const {
    createBooking,
    getMyBookings,
    getBookingById,
    cancelBooking
} = require("../controllers/bookingController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// USER ROUTES
// Create Booking
router.post(
    "/",
    authMiddleware,
    createBooking
);

// Get Logged-in User Bookings
router.get(
    "/my",
    authMiddleware,
    getMyBookings
);

// Get Single Booking
router.get(
    "/:id",
    authMiddleware,
    getBookingById
);

// Cancel Booking
router.put(
    "/:id/cancel",
    authMiddleware,
    cancelBooking
);

// ADMIN ROUTES
// Get All Bookings
router.get(
    "/",
    authMiddleware,
    adminMiddleware,
    async (req, res) => {
        const Booking = require("../models/Booking");
        try {
            const bookings = await Booking.find()
                .populate("movie")
                .populate("theatre")
                .populate("screen")
                .populate("show")
                .populate("user")
                .sort({
                    createdAt: -1
                });
            res.json({
                success: true,
                bookings
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
);

module.exports = router;