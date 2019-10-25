const Utils = require('../utils/index');
const Router = require('koa-router');

const userDTO = require('../controller/user');

const router = new Router({
  prefix: '/koa-api/user',
});
//小程序前端——登陆获取用户信息
router.post('/login', async (ctx, next) => {
  const code = ctx.request.body.code;
  const nickName = ctx.request.body.name;
  if (!code) {
    ctx.body = Utils.formatParamError('code为空');
    return;
  }
  const token = await Utils.getUserInfo(code, nickName);
  // session key， openid
  ctx.body = Utils.formatSuccess({ token });
});

//查询用户
router.post('/list', async (ctx, next) => {
  let params = ctx.request.body;
  let oCount = await userDTO.findUserCount(params);
  await userDTO.findUser(params).then(async res => {
    if (res && res.length > 0) {
      ctx.body = Utils.formatSuccess({
        list: res,
        page: params.page,
        pageSize: params.pageSize,
        totalCount: oCount[0]['count(*)'],
      });
    } else {
      ctx.body = Utils.formatSuccess();
    }
  });
});
//修改用户数据
router.post('/update', async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.modifyUserName(params).then(res => {
    let { insertId: id } = res;
    ctx.body = Utils.formatSuccess();
  });
});
//插入用户
router.post('/add', async (ctx, next) => {
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
router.post('/delete', async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.deleteUserById(params).then(res => {
    let { insertId: id } = res;
    ctx.body = Utils.formatSuccess();
  });
});

module.exports = router;
