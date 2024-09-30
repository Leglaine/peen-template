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

const getUser = async (id, accessToken) => {
    let response;
    if (accessToken) {
        response = await request(app)
            .get(`${endpoints.users}/${id}`)
            .set("Authorization", `Bearer ${accessToken}`);
    } else {
        response = await request(app).get(`${endpoints.users}/${id}`);
    }

    return response;
};

const updateUser = async (id, accessToken, req) => {
    let response;
    if (accessToken) {
        response = await request(app)
            .patch(`${endpoints.users}/${id}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send(req);
    } else {
        response = await request(app).patch(`${endpoints.users}/${id}`);
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

const updateToken = async refreshToken => {
    const response = await request(app).patch(endpoints.tokens).send({
        refreshToken: refreshToken
    });

    return response;
};

const deleteToken = async refreshToken => {
    const response = await request(app).delete(endpoints.tokens).send({
        refreshToken: refreshToken
    });

    return response;
};

module.exports = {
    createAdmin,
    createUser,
    getUsers,
    getUser,
    updateUser,
    createTokens,
    updateToken,
    deleteToken
};
