const express = require("express");
const router = express.Router();

const {
    createMovie,
    getMovies,
    getMovie,
    updateMovie,
    deleteMovie
} = require("../controllers/movieController");

const adminMiddleware = require("../middleware/adminMiddleware");

// Admin
router.post("/", adminMiddleware, createMovie);
router.put("/:id", adminMiddleware, updateMovie);
router.delete("/:id", adminMiddleware, deleteMovie);

// Public
router.get("/", getMovies);
router.get("/:id", getMovie);

module.exports = router;