require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const {
    createUser,
    createTokens,
    deleteToken
} = require("../api/utils/test-requests");

beforeAll(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("DELETE /api/tokens", () => {
    test("Returns the correct response if no refresh token is provided", async () => {
        const response = await deleteToken();
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if refresh token is invalid", async () => {
        const response = await deleteToken("InvalidToken");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        await db.User.destroy({ where: {} });
        await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const refreshToken = tokens.body.refreshToken;
        const response = await deleteToken(refreshToken);
        expect(response.status).toEqual(200);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });
});
