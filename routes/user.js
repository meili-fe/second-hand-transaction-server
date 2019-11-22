const Utils = require('../utils/index');
const Router = require('koa-router');

const userDTO = require('../controller/user');

const router = new Router({
  prefix: '/koa-api/user',
});
//小程序前端——登陆获取用户信息
router.post('/login', async (ctx, next) => {
  const { code, name, imgUrl, sex } = ctx.request.body;
  if (!code) {
    ctx.body = Utils.formatParamError('code为空');
    return;
  }
  const token = await Utils.getUserInfo(code, name, imgUrl, sex);
  // session key， openid
  ctx.body = Utils.formatSuccess({ token });
});
//修改用户数据 更新用户
router.post('/update', async (ctx, next) => {
  let { userId, name, sex, contact, team, location } = ctx.request.body || {};
  if (!userId) {
    ctx.body = Utils.formatParamError('用户id为空');
    return;
  }
  await userDTO.modifyUserName({ userId, sex, contact, team, location }).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

router.get('/getById', async (ctx, next) => {
  const userId = ctx.request.body.userId;
  await userDTO.findUserByid(userId).then(res => {
    ctx.body = Utils.formatSuccess(res[0]);
  });
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

//插入用户
router.post('/add', async (ctx, next) => {
  let { name } = ctx.request.body || {};
  let oUser = await userDTO.findUserByName(name);
  if (oUser.length == 0) {
    await userDTO.insertUser(ctx.request.body).then(res => {
      ctx.body = Utils.formatSuccess();
    });
  }
});
//删除用户
router.post('/delete', async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.deleteUserById(params).then(res => {
    let insertId = res;
    ctx.body = Utils.formatSuccess();
  });
});
//查询用户卖出商品最多列表
router.post('/saleList', async (ctx, next) => {
  await userDTO.findProOrderBySaled().then(res => {
    ctx.body = Utils.formatSuccess(res);
  });
});
//查询用户收藏/点赞列表
router.post('/relationList', async (ctx, next) => {
  let params = ctx.request.body || {};
  await userDTO.findProOrderByRelation(params).then(res => {
    ctx.body = Utils.formatSuccess(res);
  });
});

module.exports = router;
