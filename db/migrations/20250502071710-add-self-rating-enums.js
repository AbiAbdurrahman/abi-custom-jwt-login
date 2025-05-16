'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.addColumn('players', 'self_rating_level', {
      type: Sequelize.ENUM('newbie', 'beginner', 'intermediate', 'advanced', 'junior_athlete', 'professional'),
      allowNull: true,
      defaultValue: null
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.removeColumn('players', 'self_rating_level');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_newbie";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_beginner";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_intermediate";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_advanced";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_junior_athlete";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_players_self_rating_level_professional";');
  }
};
