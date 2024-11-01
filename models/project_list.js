'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class project_list extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  project_list.init({
    title: DataTypes.STRING,
    project_desc: DataTypes.STRING,
    selected: DataTypes.STRING,
    date_start: DataTypes.DATE,
    date_end: DataTypes.DATE,
    image_data: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'project_list',
  });
  return project_list;
};