require("dotenv").config();
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../api/db/models");

const endpoints = {
    users: "/api/users",
    tokens: "/api/tokens"
};

async function createUser(name, email, password) {
    const response = await request(app).post(endpoints.users).send({
        name: name,
        email: email,
        password: password
    });

    return response;
}

async function createTokens(email, password) {
    const response = await request(app).post(endpoints.tokens).send({
        email: email,
        password: password
    });

    return response;
}

beforeEach(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("POST /api/users", () => {
    test("Returns the correct response if no name is provided", async () => {
        const response = await createUser("", "user@email.com", "123");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if no email is provided", async () => {
        const response = await createUser("user", "", "123");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if no password is provided", async () => {
        const response = await createUser("user", "user@email.com", "");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        const response = await createUser("user", "user@email.com", "123");
        expect(response.status).toEqual(201);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if email already exists", async () => {
        await createUser("user", "user@email.com", "123");
        const response = await createUser("user", "user@email.com", "123");
        expect(response.status).toEqual(409);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});

describe("POST /api/tokens", () => {
    test("Returns the correct response if no email is provided", async () => {
        const response = await createTokens("", "123");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if no password is provided", async () => {
        const response = await createTokens("user@email.com", "");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if email is incorrect", async () => {
        await createUser("user", "user@email.com", "123");
        const response = await createTokens("incorrect@email.com", "123");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if password is incorrect", async () => {
        await createUser("user", "user@email.com", "123");
        const response = await createTokens("user@email.com", "12");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await createUser("user", "user@email.com", "123");
        const response = await createTokens("user@email.com", "123");
        expect(response.status).toEqual(201);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
});
