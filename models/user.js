const Sequelize = require("sequelize");

module.exports = function (sequelize, DataTypes) {
    return sequelize.define("user", {
        user_id: {
            autoIncrement: true,
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true
        },
        username: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        sequelize,
        tableName: "user",
        schema: "movies",
        timestamps: false
    });
};
