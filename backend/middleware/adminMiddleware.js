const authMiddleware = require("./authMiddleware");

const adminMiddleware = (req, res, next) => {

    authMiddleware(req, res, () => {

        if (!req.user.isAdmin) {

            return res.status(403).json({
                message: "Access denied. Admin only."
            });

        }

        next();

    });

};

module.exports = adminMiddleware;