require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const {
    createUser,
    createTokens,
    deleteUser
} = require("../api/utils/test-requests");

beforeAll(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("DELETE /api/users", () => {
    test("Returns the correct response if no access token is provided", async () => {
        const response = await deleteUser();
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if access token is invalid", async () => {
        const response = await deleteUser("id", "InvalidToken");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await db.User.destroy({ where: {} });
        const bob = await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const accessToken = tokens.body.accessToken;
        const response = await deleteUser(bob.body.id, accessToken);
        expect(response.status).toEqual(200);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});
