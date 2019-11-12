const { sequelize } = require('../db');
const Sequelize = require('sequelize');

const Product = sequelize.define(
  'product',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
    },
    cate_id: Sequelize.INTEGER,
    owner_id: Sequelize.INTEGER,
    title: Sequelize.STRING(20),
    location: Sequelize.STRING(40),
    price: Sequelize.DECIMAL(10, 2),
    description: Sequelize.STRING(800),
    contact: Sequelize.STRING(40),
    status: Sequelize.INTEGER,
    create_time: Sequelize.DATE,
    update_time: Sequelize.DATE,
  },
  {
    timestamps: false,
  }
);

module.exports = Product;
