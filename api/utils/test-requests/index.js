const request = require("supertest");
const app = require("../../../app");
const { hashPassword } = require("../cryptography");
const db = require("../../db/models");

const endpoints = {
    users: "/api/users",
    tokens: "/api/tokens"
};

const createAdmin = async () => {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
    const response = await db.User.create({
        name: "Admin",
        email: "admin@email.com",
        hash: hashedPassword,
        role: "ADMIN",
        is_verified: true
    });
    return response;
};

const createUser = async (name, email, password) => {
    const response = await request(app).post(endpoints.users).send({
        name: name,
        email: email,
        password: password
    });

    return response;
};

const getUsers = async (accessToken, queryString = "") => {
    let response;
    if (accessToken) {
        response = await request(app)
            .get(`${endpoints.users}${queryString}`)
            .set("Authorization", `Bearer ${accessToken}`);
    } else {
        response = await request(app).get(endpoints.users);
    }

    return response;
};

const createTokens = async (email, password) => {
    const response = await request(app).post(endpoints.tokens).send({
        email: email,
        password: password
    });

    return response;
};

module.exports = { endpoints, createAdmin, createUser, getUsers, createTokens };
