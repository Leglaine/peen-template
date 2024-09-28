const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.hashPassword = async password => {
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    return hash;
};

exports.verifyPassword = async (password, hash) => {
    const isVerified = await bcrypt.compare(password, hash);
    return isVerified;
};

exports.generateAccessToken = user => {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: "10m"
    });
};

exports.validateAccessToken = (accessToken, callback) => {
    return jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, callback);
};

exports.generateRefreshToken = user => {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
};

exports.validateRefreshToken = (refreshToken, callback) => {
    return jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, callback);
};
