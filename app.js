const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const tokensRouter = require("./api/routers/tokens.router");
const usersRouter = require("./api/routers/users.router");

const app = express();

if (process.env.NODE_ENV === "development") {
    app.use(logger("dev")); // Log HTTP requests
}

app.use(cors()); // Set CORS policy
app.use(express.json()); // Parse json

app.use("/api/users", usersRouter);
app.use("/api/tokens", tokensRouter);

module.exports = app;
