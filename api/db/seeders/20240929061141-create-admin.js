"use strict";

const { hashPassword } = require("../../utils/cryptography");
const { v4 } = require("uuid");

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        const adminHash = await hashPassword(process.env.ADMIN_PASSWORD);
        await queryInterface.bulkInsert(
            "users",
            [
                {
                    id: v4(),
                    name: "Admin",
                    email: "admin@email.com",
                    hash: adminHash,
                    role: "ADMIN",
                    is_verified: true,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            ],
            {}
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.bulkDelete("users", null, {});
    }
};
