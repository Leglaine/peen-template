const db = require("../db/models");
const {
    verifyPassword,
    generateAccessToken,
    generateRefreshToken,
    validateRefreshToken
} = require("../utils/cryptography");

exports.createTokens = async (req, res, next) => {
    if (!req.body.email) {
        return res.status(400).json({ message: "Email is required" });
    }

    if (!req.body.password) {
        return res.status(400).json({ message: "Password is required" });
    }
    try {
        const existingUser = await db.User.findOne({
            where: { email: req.body.email }
        });

        if (!existingUser) {
            return res
                .status(401)
                .json({ message: "Incorrect email or password" });
        }

        const userData = existingUser.dataValues;

        const passwordIsCorrect = await verifyPassword(
            req.body.password,
            userData.hash
        );

        if (!passwordIsCorrect) {
            return res
                .status(401)
                .json({ message: "Incorrect email or password" });
        }

        const user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role,
            isVerified: userData.isVerified
        };

        const accessToken = generateAccessToken(user);
        const refreshToken = generateRefreshToken(user);

        await db.RefreshToken.create({
            token: refreshToken
        });

        res.status(201).json({ accessToken, refreshToken });
    } catch (error) {
        next(error);
    }
};

exports.updateAccessToken = async (req, res, next) => {
    if (!req.body.refreshToken) {
        return res.status(400).json({ message: "Refresh token is required" });
    }
    try {
        const existingToken = await db.RefreshToken.findOne({
            where: { token: req.body.refreshToken }
        });

        if (!existingToken) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }

        validateRefreshToken(req.body.refreshToken, (err, user) => {
            if (err) {
                return res
                    .status(401)
                    .json({ message: "Invalid refresh token" });
            }
            const accessToken = generateAccessToken(user);
            res.status(200).json({
                accessToken: accessToken
            });
        });
    } catch (error) {
        next(error);
    }
};

// exports.deleteRefreshToken = async (req, res, next) => {
//     try {
//     } catch (error) {
//         next(error);
//     }
// };
