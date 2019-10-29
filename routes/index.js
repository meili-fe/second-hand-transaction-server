const user = require('./user');
const product = require('./product');
const backend = require('./backend');

module.exports = function(app) {
  app.use(backend.routes()).use(backend.allowedMethods());
  app.use(product.routes()).use(product.allowedMethods());
  app.use(user.routes()).use(user.allowedMethods());
};
