const express = require("express");
const router = express.Router();

const {
    createScreen,
    getScreens,
    getScreen,
    updateScreen,
    deleteScreen
} = require("../controllers/screenController");

const adminMiddleware = require("../middleware/adminMiddleware");

router.get("/", getScreens);
router.get("/:id", getScreen);

router.post("/", adminMiddleware, createScreen);
router.put("/:id", adminMiddleware, updateScreen);
router.delete("/:id", adminMiddleware, deleteScreen);

module.exports = router;