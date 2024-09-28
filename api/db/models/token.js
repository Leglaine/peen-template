"use strict";

const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class RefreshToken extends Model {
        static associate(models) {}
    }
    RefreshToken.init(
        {
            id: {
                allowNull: false,
                primaryKey: true,
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4
            },
            token: {
                allowNull: false,
                type: DataTypes.TEXT
            }
        },
        {
            sequelize,
            modelName: "RefreshToken",
            tableName: "tokens",
            underscored: true
        }
    );
    return RefreshToken;
};
