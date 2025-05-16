'use strict';
const { user: User } = require('../../models');

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

    const records = await User.findAll({
      attributes: ['id', 'first_name', 'last_name' ,'username']
    });

    await Promise.all(records.map(async (record) => {
      record.username = record.first_name.toLowerCase() + '.' + record.last_name.toLowerCase();
      await record.save();
    }));

    queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 100]
      }
    });
  },

  async down (queryInterface, Sequelize) { // Removed unused Sequelize
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.changeColumn('users', 'username', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
      defaultValue: null,
      validate: {
        len: [3, 100]
      }
    });
  }
};
