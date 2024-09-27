const app = require("./app");

const port = process.env.PORT;
const host = process.env.BASE_URL;

app.listen(port, () => {
    console.log(`Server is now running at ${host} on port ${port}`);
});
