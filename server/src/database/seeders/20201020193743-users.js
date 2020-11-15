const bcrypt = require('bcrypt');

const { users: UserModel } = require('../../models');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const user = await UserModel.findAll();
    if (user.length > 0) {
      return;
    }

    return queryInterface.bulkInsert(
      'users',
      [
        {
          name: 'John Doe',
          email: 'johndoe@test.com',
          password: bcrypt.hashSync(
            '1234',
            bcrypt.genSaltSync(10),
            null,
          ),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
      {},
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {});
  },
};
