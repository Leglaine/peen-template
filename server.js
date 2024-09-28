const app = require("./app");
const db = require("./api/db/models");

const port = process.env.PORT;
const host = process.env.BASE_URL;

app.listen(port, async () => {
    console.log(`Server is now running at ${host} on port ${port}`);
    try {
        await db.sequelize.authenticate();
        console.log("Database connection established successfully");
    } catch (error) {
        console.error(error);
    }
});
