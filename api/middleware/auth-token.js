const { validateAccessToken } = require("../utils/cryptography");

function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Access token required" });
    }

    validateAccessToken(token, (err, user) => {
        if (err) {
            return res.status(401).json({ message: "Invalid access token" });
        }
        req.user = user;
        next();
    });
}

module.exports = { authenticateToken };
