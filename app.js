const Koa = require("koa");
const app = new Koa();
const json = require("koa-json");
const onerror = require("koa-onerror");
const bodyParser = require("koa-bodyparser");
const error = require("koa-json-error");
const parameter = require("koa-parameter");
const utils = require("./utils");
const logger = require("koa-logger");
const koaStatic = require("koa-static");
const cors = require("koa-cors");

const router = require("./routes");

// error handler
onerror(app);

// 跨域
app.use(cors());

//  请求传参
app.use(bodyParser());
app.use(json());
app.use(logger());
app.use(error(utils.formatError));
app.use(parameter(app));
app.use(koaStatic(__dirname));

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});
router(app);
app.listen(3003);
