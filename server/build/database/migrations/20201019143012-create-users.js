"use strict";
module.exports = {
    up: function (queryInterface, DataTypes) {
        return queryInterface.createTable('users', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            email: {
                allowNull: false,
                type: DataTypes.STRING,
                unique: true,
            },
            password: {
                allowNull: false,
                type: DataTypes.STRING,
            },
            createdAt: {
                allowNull: false,
                type: 'TIMESTAMP',
            },
            updatedAt: {
                allowNull: false,
                type: 'TIMESTAMP',
            },
        });
    },
    down: function (queryInterface) {
        return queryInterface.dropTable('users');
    },
};
