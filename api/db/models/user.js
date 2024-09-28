"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        static associate(models) {}
    }
    User.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true
            },
            hash: {
                allowNull: false,
                type: DataTypes.STRING
            },
            role: {
                allowNull: false,
                type: DataTypes.ENUM("USER", "ADMIN"),
                defaultValue: "USER"
            },
            is_verified: {
                allowNull: false,
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        },
        {
            sequelize,
            modelName: "User",
            tableName: "users",
            underscored: true
        }
    );
    return User;
};
