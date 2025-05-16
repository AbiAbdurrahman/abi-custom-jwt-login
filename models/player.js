'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class player extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  player.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    user_id: DataTypes.UUID,
    birth_date: DataTypes.DATE,
    address: DataTypes.TEXT,
    age: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'player',
  });
  return player;
};