const Sequelize = require('sequelize');
const config = require('./config');
const cls = require('cls-hooked');
const namespace = cls.createNamespace('my-very-own-namespace');
Sequelize.useCLS(namespace);

const sequelize = new Sequelize(config.database.DATABASE, config.database.USERNAME, config.database.PASSWORD, {
  host: config.database.HOST,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 30000,
  },
});
const query = function(sql, values, model) {
  return new Promise((resolve, reject) => {
    sequelize
      .query(sql, {
        model,
        replacements: values,
      })
      .then(projects => {
        if (model) {
          resolve(projects);
        }
        resolve(projects[0]);
      })
      .catch(err => {
        reject(err);
      });
  });
};

module.exports = {
  query,
  sequelize,
};
