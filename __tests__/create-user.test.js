require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const { createUser } = require("../api/utils/test-requests");

beforeAll(async () => {
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
        await db.User.destroy({ where: {} });
        const response = await createUser("user", "user@email.com", "123");
        expect(response.status).toEqual(201);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if email already exists", async () => {
        await db.User.destroy({ where: {} });
        await createUser("user", "user@email.com", "123");
        const response = await createUser("user", "user@email.com", "123");
        expect(response.status).toEqual(409);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});
