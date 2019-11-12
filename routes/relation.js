const Utils = require('../utils/index');
const Router = require('koa-router');

const relationDTO = require('../controller/relation');

const router = new Router({
  prefix: '/koa-api/relation',
});

//收藏/点赞
router.post('/collect', async (ctx, next) => {
  let params = ctx.request.body || {};
  let oCount = await relationDTO.searchRelationByUserAndPro(params);
  let count = oCount[0]['count(*)'];
  ctx.body = Utils.formatSuccess(count);
  // 判断是否存在记录
  if (count == 0) {
    await relationDTO.insertRelationPro(params).then(async res => {
      ctx.body = Utils.formatSuccess();
    });
  } else {
    await relationDTO.updateRelationPro(params).then(async res => {
      ctx.body = Utils.formatSuccess();
    });
  }
});
//查询当前用户收藏列表
router.post('/listByUser', async (ctx, next) => {
  let params = ctx.request.body || {};
  await relationDTO.searchProListByUser(params).then(async res => {
    ctx.body = Utils.formatSuccess(res);
  });
});
//查询某个产品的点赞量/收藏量
router.post('/getCount', async (ctx, next) => {
  let params = ctx.request.body || {};
  let collectCount = await relationDTO.getCountById(Object.assign({ type: 0 }, params));
  let praiseCount = await relationDTO.getCountById(Object.assign({ type: 1 }, params));
  let res = {
    collectCount: collectCount[0].count,
    praiseCount: praiseCount[0].count,
  };
  ctx.body = Utils.formatSuccess(res);
});

module.exports = router;
