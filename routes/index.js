const user = require("./user");
const product = require("./product");
module.exports = function(app) {
  app.use(user.routes()).use(user.allowedMethods());
  app.use(product.routes()).use(product.allowedMethods());
};
