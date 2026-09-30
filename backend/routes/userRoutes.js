const express = require("express");

const router = express.Router();

const {

    getUsers,

    toggleUserStatus,

    deleteUser

} = require("../controllers/userController");

const adminMiddleware = require("../middleware/adminMiddleware");

// Get All Users
router.get("/", adminMiddleware, getUsers);

// Block / Unblock User
router.put("/:id/toggle-status", adminMiddleware, toggleUserStatus);

// Delete User
router.delete("/:id", adminMiddleware, deleteUser);

module.exports = router;