require("dotenv").config();
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../api/db/models");
const { hashPassword } = require("../api/utils/cryptography");

const endpoints = {
    users: "/api/users",
    tokens: "/api/tokens"
};

async function createAdmin() {
    const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD);
    const response = await db.User.create({
        name: "Admin",
        email: "admin@email.com",
        hash: hashedPassword,
        role: "ADMIN",
        is_verified: true
    });
    return response;
}

async function createUser(name, email, password) {
    const response = await request(app).post(endpoints.users).send({
        name: name,
        email: email,
        password: password
    });

    return response;
}

async function getUsers() {
    const response = await request(app).get(endpoints.users);
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

describe("GET /api/users", () => {
    test("Returns the correct response if no access token is provided", async () => {
        const response = await getUsers();
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if access token is invalid", async () => {
        const response = await request(app)
            .get(endpoints.users)
            .set("Authorization", "Bearer InvalidToken");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if user is unauthorized", async () => {
        await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const accessToken = tokens.body.accessToken;
        const response = await request(app)
            .get(endpoints.users)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toEqual(403);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await createAdmin();
        const tokens = await createTokens(
            "admin@email.com",
            process.env.ADMIN_PASSWORD
        );
        const accessToken = tokens.body.accessToken;
        const response = await request(app)
            .get(endpoints.users)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.status).toEqual(200);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response using 'before' query", async () => {
        await createAdmin();
        const tokens = await createTokens(
            "admin@email.com",
            process.env.ADMIN_PASSWORD
        );
        const accessToken = tokens.body.accessToken;
        const response1 = await request(app)
            .get(
                `${endpoints.users}?before=${new Date(
                    Date.now() + 86400 * 1000
                )}`
            )
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response1.body.length).toEqual(1);
        expect(response1.status).toEqual(200);
        expect(response1.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        const response2 = await request(app)
            .get(
                `${endpoints.users}?before=${new Date(
                    Date.now() - 86400 * 1000
                )}`
            )
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response2.body.length).toEqual(0);
        expect(response2.status).toEqual(200);
        expect(response2.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response using 'after' query", async () => {
        await createAdmin();
        const tokens = await createTokens(
            "admin@email.com",
            process.env.ADMIN_PASSWORD
        );
        const accessToken = tokens.body.accessToken;
        const response1 = await request(app)
            .get(
                `${endpoints.users}?after=${new Date(
                    Date.now() + 86400 * 1000
                )}`
            )
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response1.body.length).toEqual(0);
        expect(response1.status).toEqual(200);
        expect(response1.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        const response2 = await request(app)
            .get(
                `${endpoints.users}?after=${new Date(
                    Date.now() - 86400 * 1000
                )}`
            )
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response2.body.length).toEqual(1);
        expect(response2.status).toEqual(200);
        expect(response2.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});
