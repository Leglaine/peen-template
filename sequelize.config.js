require("dotenv").config();

module.exports = {
    development: {
        use_env_variable: "DATABASE_URL",
        dialect: "postgres",
        seederStorage: "sequelize"
    },
    test: {
        use_env_variable: "TEST_DATABASE_URL",
        logging: false,
        dialect: "postgres",
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
};
