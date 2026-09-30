const User = require("../models/User");

const getUsers = async (req, res) => {

    try {

        const users = await User.find({}, "-password");

        res.status(200).json({
            success: true,
            users
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const toggleUserStatus = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        user.isActive = !user.isActive;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User status updated successfully",
            user
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const deleteUser = async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                success: false,
                message: "User not found"
            });

        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = {

    getUsers,

    toggleUserStatus,

    deleteUser

};