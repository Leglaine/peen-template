require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const {
    createUser,
    getUser,
    createTokens
} = require("../api/utils/test-requests");

beforeAll(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("GET /api/users/:id", () => {
    test("Returns the correct response if no access token is provided", async () => {
        const response = await getUser("id");
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if access token is invalid", async () => {
        const response = await getUser("id", "InvalidToken");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if user is unauthorized", async () => {
        await db.User.destroy({ where: {} });
        const mary = await createUser("Mary", "mary@email.com", "123");
        await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const accessToken = tokens.body.accessToken;
        const response = await getUser(mary.body.id, accessToken);
        expect(response.status).toEqual(403);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await db.User.destroy({ where: {} });
        const bob = await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const accessToken = tokens.body.accessToken;
        const response = await getUser(bob.body.id, accessToken);
        expect(response.status).toEqual(200);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});
