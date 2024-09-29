require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const { createUser, createTokens } = require("../api/utils/test-requests");

beforeAll(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
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
        await db.User.destroy({ where: {} });
        await createUser("user", "user@email.com", "123");
        const response = await createTokens("incorrect@email.com", "123");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if password is incorrect", async () => {
        await db.User.destroy({ where: {} });
        await createUser("user", "user@email.com", "123");
        const response = await createTokens("user@email.com", "12");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await db.User.destroy({ where: {} });
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
