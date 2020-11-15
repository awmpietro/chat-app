"use strict";
module.exports = function (sequelize, DataTypes) {
    var users = sequelize.define('users', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        freezeTableName: true,
    });
    return users;
};
