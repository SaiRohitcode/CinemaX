const Movie = require("../models/Movie");

// Create Movie
const createMovie = async (req, res) => {
    try {
        const {
            title,
            description,
            genre,
            languages,
            formats,
            duration,
            releaseDate,
            availableFrom,
            availableUntil,
            poster
        } = req.body;

        if (
            !title ||
            !description ||
            !genre ||
            !languages ||
            !formats ||
            !duration ||
            !releaseDate ||
            !availableFrom ||
            !availableUntil ||
            !poster
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        if (availableUntil < availableFrom) {
            return res.status(400).json({
                success: false,
                message: "Available Until date must be after Available From date."
            });
        }

        const existingMovie = await Movie.findOne({
            title: title.trim()
        });

        if (existingMovie) {
            return res.status(400).json({
                success: false,
                message: "Movie already exists."
            });
        }

        const movie = await Movie.create(req.body);

        res.status(201).json({
            success: true,
            message: "Movie created successfully.",
            movie
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get All Movies
const getMovies = async (req, res) => {

    try {

        const movies = await Movie.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: movies.length,
            movies
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Get Single Movie
const getMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {

            return res.status(404).json({
                success: false,
                message: "Movie not found."
            });

        }
        console.log("GENRE FROM DATABASE:", movie.genre);
        res.status(200).json({
            success: true,
            movie
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Update Movie
const updateMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {

            return res.status(404).json({
                success: false,
                message: "Movie not found."
            });

        }

        const updatedMovie = await Movie.findByIdAndUpdate(

            req.params.id,

            req.body,

            {
                new: true,
                runValidators: true
            }

        );

        res.status(200).json({
            success: true,
            message: "Movie updated successfully.",
            movie: updatedMovie
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

// Delete Movie (Soft Delete)
const deleteMovie = async (req, res) => {

    try {

        const movie = await Movie.findById(req.params.id);

        if (!movie) {

            return res.status(404).json({
                success: false,
                message: "Movie not found."
            });

        }

        movie.isActive = false;

        await movie.save();

        res.status(200).json({
            success: true,
            message: "Movie deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createMovie,
    getMovies,
    getMovie,
    updateMovie,
    deleteMovie
};