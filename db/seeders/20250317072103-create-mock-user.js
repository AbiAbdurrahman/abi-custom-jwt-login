'use strict';

const { password } = require('pg/lib/defaults')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */

    const fs = require('fs');
    const bcrypt = require('bcryptjs');
    const {
      v1: uuidv1,
    } = require('uuid');
    const mock_users = JSON.parse(fs.readFileSync(__dirname + '/./../seed_file/mock-user.json', 'utf8'));
    const records = [];
    const date = new Date();

    for (let index = 0; index < mock_users.length; index++) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(mock_users[index].password, salt);
      records.push({
        id: uuidv1(),
        ...mock_users[index],
        ...{
          password: hash
        },
        createdAt: date,
        updatedAt: date
      })
    }

    await queryInterface.bulkInsert('users',records);
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    queryInterface.bulkDelete('user');
  }
};
