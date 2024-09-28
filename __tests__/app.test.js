require("dotenv").config();
process.env.NODE_ENV = "test";
const request = require("supertest");
const app = require("../app.js");
const db = require("../api/db/models");

const endpoints = {
    users: "/api/users",
    tokens: "/api/tokens"
};

beforeEach(async () => {
    await db.User.destroy({ where: {} });
});

afterAll(async () => {
    await db.sequelize.close();
});

describe("POST /api/users", () => {
    test("Returns the correct response if no name is provided", async () => {
        await request(app)
            .post(endpoints.users)
            .send({
                name: "",
                email: "user@email.com",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);
    });

    test("Returns the correct response if no email is provided", async () => {
        await request(app)
            .post(endpoints.users)
            .send({
                name: "user",
                email: "",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);
    });

    test("Returns the correct response if no password is provided", async () => {
        await request(app)
            .post(endpoints.users)
            .send({
                name: "user",
                email: "user@email.com",
                password: ""
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);
    });

    test("Returns the correct response on success", async () => {
        await request(app)
            .post(endpoints.users)
            .send({
                name: "user",
                email: "user@email.com",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(201);
    });

    test("Returns the correct response if email already exists", async () => {
        await request(app).post(endpoints.users).send({
            name: "user",
            email: "user@email.com",
            password: "123"
        });

        await request(app)
            .post(endpoints.users)
            .send({
                name: "user",
                email: "user@email.com",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(409);
    });
});

describe("POST /api/tokens", () => {
    test("Returns the correct response if no email is provided", async () => {
        await request(app)
            .post(endpoints.tokens)
            .send({
                email: "",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);
    });

    test("Returns the correct response if no password is provided", async () => {
        await request(app)
            .post(endpoints.tokens)
            .send({
                email: "user@email.com",
                password: ""
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(400);
    });

    test("Returns the correct response if email is incorrect", async () => {
        await request(app).post(endpoints.users).send({
            name: "user",
            email: "user@email.com",
            password: "123"
        });
        await request(app)
            .post(endpoints.tokens)
            .send({
                email: "incorrect@email.com",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401);
    });

    test("Returns the correct response if password is incorrect", async () => {
        await request(app).post(endpoints.users).send({
            name: "user",
            email: "user@email.com",
            password: "123"
        });
        await request(app)
            .post(endpoints.tokens)
            .send({
                email: "user@email.com",
                password: "12"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(401);
    });

    test("Returns the correct response on success", async () => {
        await request(app).post(endpoints.users).send({
            name: "user",
            email: "user@email.com",
            password: "123"
        });
        const response = await request(app)
            .post(endpoints.tokens)
            .send({
                email: "user@email.com",
                password: "123"
            })
            .expect("Content-Type", "application/json; charset=utf-8")
            .expect(201);
        expect(response.body.accessToken).toBeDefined();
        expect(response.body.refreshToken).toBeDefined();
    });
});
