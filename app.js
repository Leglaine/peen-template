const express = require("express");
const logger = require("morgan");
const cors = require("cors");

const usersRouter = require("./api/routers/users.router");

const app = express();

app.use(logger("dev")); // Log HTTP requests
app.use(cors()); // Set CORS policy
app.use(express.json()); // Parse json

app.use("/api/users", usersRouter);

module.exports = app;
