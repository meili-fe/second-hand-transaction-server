const session = require("koa-session");
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

//  引入koa-session

app.keys = ["mlxianyu"];
const CONFIG = {
  key: "mlxy:session", //cookie key
  maxAge: 3600 * 1000, // cookie的过期时间 maxAge in ms (default is 1 days)
  overwrite: true, //是否可以overwrite    (默认default true)
  httpOnly: true, //cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true, //签名默认true
  rolling: false, //在每次请求时强行设置cookie，这将重置cookie过期时间（默认：false）
  renew: false, //(boolean) renew session when session is nearly expired,
};

//定义允许直接访问的url
const allowpage = ["/login"];
//前置拦截
function localFilter(ctx) {
  let url = ctx.originalUrl;
  if (allowpage.indexOf(url) == -1) {
    const key = ctx.header.key;
    const session_key = ctx.session.session_key;
    console.log(`session_key => ${session_key}`);
    if (!key || !session_key || session_key !== key) {
      ctx.redirect("/login");
    }
    console.log("login status validate success");
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
// app.use(session(CONFIG, app));

// //session拦截
// app.use(async (ctx, next) => {
//   localFilter(ctx);
//   await next();
// });
app.listen(3003);
router(app);
// graphql.applyMiddleware({ app });
// http://localhost:8000/graphql

// app.listen(8000);
