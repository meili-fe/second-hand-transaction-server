const user = require('./user');
const upload = require('./upload');
module.exports = function (app) {
    app.use(user.routes()).use(user.allowedMethods());
    app.use(upload.routes()).use(upload.allowedMethods());
}