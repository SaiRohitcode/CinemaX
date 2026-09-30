const Theatre = require("../models/Theatre");

const createTheatre = async (req, res) => {

    try {

        const {
            name,
            state,
            city,
            address,
            googleMapsLink
        } = req.body;

        if (
            !name ||
            !state ||
            !city ||
            !address ||
            !googleMapsLink
        ) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const existingTheatre = await Theatre.findOne({
            name: name.trim(),
            city: city.trim()
        });

        if (existingTheatre) {
            return res.status(400).json({
                success: false,
                message: "Theatre already exists in this city."
            });
        }

        const theatre = await Theatre.create(req.body);

        res.status(201).json({
            success: true,
            message: "Theatre created successfully.",
            theatre
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getTheatres = async (req, res) => {

    try {

        const theatres = await Theatre.find({
            isActive: true
        }).sort({
            createdAt: -1
        });

        res.status(200).json({
            success: true,
            count: theatres.length,
            theatres
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getTheatre = async (req, res) => {

    try {

        const theatre = await Theatre.findById(req.params.id);

        if (!theatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found."
            });
        }

        res.status(200).json({
            success: true,
            theatre
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const updateTheatre = async (req, res) => {

    try {

        const theatre = await Theatre.findById(req.params.id);

        if (!theatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found."
            });
        }

        const updatedTheatre = await Theatre.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Theatre updated successfully.",
            theatre: updatedTheatre
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteTheatre = async (req, res) => {

    try {

        const theatre = await Theatre.findById(req.params.id);

        if (!theatre) {
            return res.status(404).json({
                success: false,
                message: "Theatre not found."
            });
        }

        theatre.isActive = false;

        await theatre.save();

        res.status(200).json({
            success: true,
            message: "Theatre deleted successfully."
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {
    createTheatre,
    getTheatres,
    getTheatre,
    updateTheatre,
    deleteTheatre
};