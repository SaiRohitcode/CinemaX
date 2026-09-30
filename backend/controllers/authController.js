const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    try {

        const { name, email, mobile, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            mobile,
            password: hashedPassword
        });

        res.status(201).json({
            message: "User registered successfully",
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                mobile: newUser.mobile,
                isAdmin: newUser.isAdmin
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Password"
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(200).json({
            message: "Login Successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin
            }
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const getProfile = async (req, res) => {
    try {

        const user = await User.findById(req.user.id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json(user);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }
};

const updateProfile = async (req, res) => {

    try {

        const {
            name,
            mobile,
            gender,
            dob,
            city,
            state
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                name,
                mobile,
                gender,
                dob,
                city,
                state
            },
            {
                new: true
            }
        ).select("-password");

        res.status(200).json({
            message: "Profile updated successfully.",
            user
        });

    } catch (error) {

        res.status(500).json({
            message: "Server Error"
        });

    }

};

module.exports = {
    registerUser,
    loginUser,
    getProfile,
    updateProfile
};