const express = require("express");
const router = express.Router();

const {
    createTheatre,
    getTheatres,
    getTheatre,
    updateTheatre,
    deleteTheatre
} = require("../controllers/theatreController");

const adminMiddleware = require("../middleware/adminMiddleware");

// Public Routes
router.get("/", getTheatres);
router.get("/:id", getTheatre);

// Admin Routes
router.post("/", adminMiddleware, createTheatre);
router.put("/:id", adminMiddleware, updateTheatre);
router.delete("/:id", adminMiddleware, deleteTheatre);

module.exports = router;