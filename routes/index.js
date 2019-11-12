const Router = require('koa-router');
const requireDirectory = require('require-directory');

module.exports = function(app) {
  function whenLoadModule(obj) {
    if (obj instanceof Router) {
      app.use(obj.routes());
    }
  }
  //自动导入api
  const modules = requireDirectory(module, './', {
    visit: whenLoadModule,
  });
};
