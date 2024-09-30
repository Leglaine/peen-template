require("dotenv").config();
process.env.NODE_ENV = "test";
const db = require("../api/db/models");
const {
    updateUser,
    createUser,
    createTokens,
    getUser
} = require("../api/utils/test-requests");

beforeAll(async () => {
    await db.User.destroy({ where: {} });
    await db.RefreshToken.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("PATCH /api/tokens", () => {
    test("Returns the correct response if no access token is provided", async () => {
        const response = await updateUser();
        expect(response.status).toEqual(400);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response if access token is invalid", async () => {
        const response = await updateUser("id", "InvalidToken");
        expect(response.status).toEqual(401);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
    });

    test("Returns the correct response on success", async () => {
        const bob = await createUser("Bob", "bob@email.com", "123");
        const tokens = await createTokens("bob@email.com", "123");
        const response = await updateUser(
            bob.body.id,
            tokens.body.accessToken,
            { name: "Robert" }
        );

        const rob = await getUser(bob.body.id, tokens.body.accessToken);

        expect(response.status).toEqual(200);
        expect(response.header["content-type"]).toEqual(
            "application/json; charset=utf-8"
        );
        expect(rob.body.name).toEqual("Robert");
    });
});
