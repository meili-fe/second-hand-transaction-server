const { sequelize } = require('../db');
const Sequelize = require('sequelize');

const ProductImg = sequelize.define(
  'productImg',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    pro_id: Sequelize.INTEGER,
    img_url: Sequelize.STRING(200),
    create_time: Sequelize.DATE,
    update_time: Sequelize.DATE,
  },
  {
    timestamps: false,
  }
);

module.exports = ProductImg;
