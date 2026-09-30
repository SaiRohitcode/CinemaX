const Screen = require("../models/Screen");

const createScreen = async (req, res) => {
    try {
        const { theatre, name, screenType, sections } = req.body;

        if (!theatre || !name || !screenType || !sections || sections.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please fill all required fields."
            });
        }

        const existingScreen = await Screen.findOne({ theatre, name });

        if (existingScreen) {
            return res.status(400).json({
                success: false,
                message: "Screen already exists in this theatre."
            });
        }

        const seats = [];
        let rowNumber = 0;

        sections.forEach((section) => {
            for (let r = 0; r < Number(section.rows); r++) {
                const row = String.fromCharCode(65 + rowNumber);

                for (let n = 1; n <= Number(section.seatsPerRow); n++) {
                    seats.push({
                        seatId: `${row}${n}`,
                        row,
                        section: section.name,
                        number: n,
                        price: Number(section.price),
                        rowPosition: rowNumber + 1,
                        columnPosition: n,
                        positionType: "SEAT",
                        isBlocked: false
                    });
                }

                rowNumber++;
            }
        });

        const screen = await Screen.create({
            theatre,
            name,
            screenType,
            sections,
            totalSeats: seats.length,
            seats,
            isActive: true
        });

        res.status(201).json({
            success: true,
            message: "Screen created successfully.",
            screen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getScreens = async (req, res) => {
    try {
        const screens = await Screen.find({ isActive: true })
            .populate("theatre")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: screens.length,
            screens
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const getScreen = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.id).populate("theatre");

        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found."
            });
        }

        res.status(200).json({
            success: true,
            screen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const updateScreen = async (req, res) => {
    try {
        const screen = await Screen.findById(req.params.id);

        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found."
            });
        }

        const updatedScreen = await Screen.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: "Screen updated successfully.",
            screen: updatedScreen
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const deleteScreen = async (req, res) => {
    try {
        const screen = await Screen.findByIdAndDelete(req.params.id);

        if (!screen) {
            return res.status(404).json({
                success: false,
                message: "Screen not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Screen deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createScreen,
    getScreens,
    getScreen,
    updateScreen,
    deleteScreen
};