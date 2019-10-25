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
const graphql = require("./graphql");

const COMMON_STATUS = require("./utils/common");

//定义允许直接访问的url
const allowpage = [
  "/koa-api/user/login",
  "/koa-api/product/allType",
  // "/koa-api/product/productById",
  // "/koa-api/product/list",
  // "/koa-api/product/add",
];

//前置拦截
function localFilter(ctx, next) {
  let url = ctx.originalUrl;
  let token = ctx.header.token;
  if (allowpage.indexOf(url) == -1) {
    if (!token) {
      ctx.body = utils.formatError({
        status: COMMON_STATUS.NEED_LOGIN,
        message: "请重新登陆",
      });
      return;
    }

    const now = new Date().getTime();
    token = JSON.parse(token);
    const { expireTime, userInfo } = token;
    //校验是否过期
    if (now > expireTime) {
      // 过期
      ctx.body = utils.formatError({
        status: COMMON_STATUS.NEED_LOGIN,
<<<<<<< HEAD
        message: "请重新登陆",
=======
        message: '登录超时请重新登录',
>>>>>>> 2078639041ed6ea1873f71cc6c1ac2cd9d789a0f
      });
    } else {
      const decodeUserinfo = utils.decrypt(userInfo);
      const userObj = JSON.parse(decodeUserinfo);
      // 数据放入上下文
      ctx.request.body.openId = userObj.openId;
      ctx.request.body.userId = userObj.userId;
    }
  }
}

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
app.use(
  koaStatic(__dirname + "/views", {
    extensions: ["html"],
  }),
);

// error-handling
app.on("error", (err, ctx) => {
  console.error("server error", err, ctx);
});

//前置拦截
app.use(async (ctx, next) => {
  localFilter(ctx, next);
  // 判断若已登陆 继续请求
  if (!(ctx.body && ctx.body.code === COMMON_STATUS.NEED_LOGIN)) {
    await next();
  }
});
router(app);
// graphql.applyMiddleware({ app });
// http://localhost:8000/graphql
app.listen(3003);
