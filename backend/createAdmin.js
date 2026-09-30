const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {

    try {

        const existingAdmin = await User.findOne({
            email: "admin@cinemax.com"
        });

        if (existingAdmin) {

            console.log("Admin already exists.");

            process.exit();

        }

        const hashedPassword = await bcrypt.hash("Admin@123", 10);

        await User.create({

            name: "CinemaX Admin",

            email: "admin@cinemax.com",

            mobile: "9999999999",

            password: hashedPassword,

            gender: "",

            dob: "",

            city: "Hyderabad",

            state: "Telangana",

            isAdmin: true,

            isActive: true

        });

        console.log("====================================");
        console.log("Admin Created Successfully");
        console.log("Email    : admin@cinemax.com");
        console.log("Password : Admin@123");
        console.log("====================================");

        process.exit();

    } catch (error) {

        console.error(error);
        process.exit();

    }

}

createAdmin();