const router = require("koa-router")();
const Tips = require("../utils/tips");
const Utils = require("../utils/index");

const userDTO = require("../controller/user");

//小程序前端——登陆获取用户信息
router.post("/login", async (ctx, next) => {
  const userInfo = await Utils.getUserInfo(ctx.request.body.code);
  // session key， openid
  ctx.session.session_key = userInfo.key;
  ctx.session.openid = userInfo.openid;
  userDTO.insertUser({openId:userInfo.openid,name:"2323"})
  ctx.body = Utils.formatSuccess({ key: userInfo.key });
});

//查询用户
router.post("/koa-api/user/list", async (ctx, next) => {
  let params = ctx.request.body;
  let oCount = await userDTO.findUserCount(params);
  await userDTO.findUser(params).then(async res => {
    if (res && res.length > 0) {
      ctx.body = Utils.formatSuccess({
        list: res,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: oCount[0]["count(*)"],
      });
    } else {
      ctx.body = Utils.formatSuccess();
    }
  });
});
//修改用户数据
router.post("/koa-api/user/update", async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.modifyUserName(params).then(res => {
    let { insertId: id } = res;
    ctx.body = Utils.formatSuccess();
  });
});
//插入用户
router.post("/koa-api/user/add", async (ctx, next) => {
  let { user_name } = ctx.request.body || {};
  let oUser = await userDTO.findUserByName(user_name);
  if (oUser.length == 0) {
    await userDTO.insertUser(ctx.request.body).then(res => {
      let { insertId: id } = res;
      ctx.body = Utils.formatSuccess();
    });
  }
});
//删除用户
router.post("/koa-api/user/delete", async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.deleteUserById(params).then(res => {
    let { insertId: id } = res;
    ctx.body = Utils.formatSuccess();
  });
});

module.exports = router;
