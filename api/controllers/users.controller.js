const db = require("../db/models");
const { hashPassword } = require("../utils/cryptography");
const { Op } = require("sequelize");

function constructQuery(req) {
    let query = {
        where: {}
    };

    if (req.query.order === "nameASC") {
        query.order = [["name", "ASC"]];
    }

    if (req.query.limit) {
        query.limit = req.query.limit;
    }

    if (req.query.offset) {
        query.offset = req.query.offset;
    }

    if (req.query.before || req.query.after) {
        query.where.createdAt = {};
    }

    if (req.query.before) {
        query.where.createdAt[Op.lt] = new Date(req.query.before);
    }

    if (req.query.after) {
        query.where.createdAt[Op.gt] = new Date(req.query.after);
    }

    // if (req.query.name) {
    //     query.where.name = req.query.name;
    // }

    // if (req.query.email) {
    //     query.where.email = req.query.email;
    // }

    // if (req.query.role) {
    //     query.where.role = req.query.role;
    // }

    // if (req.query.verified) {
    //     query.where.is_verified = req.query.verified;
    // }

    return query;
}

exports.getUsers = async (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }

    const query = constructQuery(req);

    try {
        const users = await db.User.findAll(query);
        res.status(200).json(users);
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
    if (req.params.id != req.user?.id && req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }

    try {
        const user = await db.User.findOne({ where: { id: req.params.id } });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};

exports.updateUser = async (req, res, next) => {
    // TODO: Allow users to update email and password
    if (req.params.id != req.user?.id && req.user?.role !== "ADMIN") {
        return res.status(403).json({ message: "Forbidden" });
    }
    try {
        const user = await db.User.findOne({ where: { id: req.params.id } });
        if (req.body.name) {
            user.name = req.body.name;
        }
        await user.save();
        res.status(200).json({ message: "User updated successfully" });
    } catch (error) {
        next(error);
    }
};

// exports.deleteUser = async (req, res, next) => {
//     if (req.params.id != req.user?.id && req.user?.role !== "ADMIN") {
//         return res.status(403).json({ message: "Forbidden" });
//     }
//     try {
//     } catch (error) {
//         next(error);
//     }
// };
