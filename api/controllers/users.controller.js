const db = require("../db/models");
const { hashPassword } = require("../utils/cryptography");

exports.getUsers = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

exports.createUser = async (req, res, next) => {
    if (!req.body.name) {
        return res.status(400).json({ message: "Name is required" });
    }

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

        if (existingUser) {
            return res
                .status(409)
                .json({ message: "A user with that email already exists" });
        }

        const hashedPassword = await hashPassword(req.body.password);

        const userData = {
            name: req.body.name,
            email: req.body.email,
            hash: hashedPassword
        };

        const createdUser = await db.User.create(userData);

        res.status(201).json(createdUser);
    } catch (error) {
        next(error);
    }
};

exports.getUserById = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};

exports.deleteUser = async (req, res, next) => {
    try {
    } catch (error) {
        next(error);
    }
};
