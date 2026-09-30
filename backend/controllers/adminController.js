const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const adminLogin = async (req, res) => {

    try {

        const { email, password } = req.body;

        const admin = await User.findOne({
            email,
            isAdmin: true
        });

        if (!admin) {

            return res.status(401).json({
                message: "Admin not found"
            });

        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {

            return res.status(401).json({
                message: "Invalid Password"
            });

        }

        const token = jwt.sign(

            {
                id: admin._id,
                email: admin.email,
                isAdmin: true
            },

            process.env.JWT_SECRET,

            {
                expiresIn: "7d"
            }

        );

        res.status(200).json({

            message: "Admin Login Successful",

            token,

            admin: {

                id: admin._id,

                name: admin.name,

                email: admin.email

            }

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

};

module.exports = {
    adminLogin
};