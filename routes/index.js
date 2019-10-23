const user = require("./user");
const product = require("./product");
const upload = require("./upload");
module.exports = function(app) {
  app.use(user.routes()).use(user.allowedMethods());
  app.use(product.routes()).use(product.allowedMethods());
  app.use(upload.routes()).use(upload.allowedMethods());
};
