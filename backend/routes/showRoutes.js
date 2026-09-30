const express = require("express");
const router = express.Router();

const {
    createShow,
    getShows,
    getShow,
    getShowsByMovie,
    getShowSeats,
    updateShow,
    deleteShow
} = require("../controllers/showController");

const adminMiddleware = require("../middleware/adminMiddleware");

// =========================
// Public Routes
// =========================

// Get all active shows
router.get("/", getShows);

// Get all shows of a movie
router.get("/movie/:movieId", getShowsByMovie);

// Get seat layout & booked seats of a show
router.get("/:showId/seats", getShowSeats);

// Get single show
router.get("/:id", getShow);

// =========================
// Admin Routes
// =========================

// Create show
router.post("/", adminMiddleware, createShow);

// Update show
router.put("/:id", adminMiddleware, updateShow);

// Delete show
router.delete("/:id", adminMiddleware, deleteShow);

module.exports = router;