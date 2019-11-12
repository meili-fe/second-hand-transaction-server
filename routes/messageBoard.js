const Utils = require('../utils/index');
const Router = require('koa-router');

const messageDTO = require('../controller/messageBoard');

const router = new Router({
  prefix: '/koa-api/meaasgeBoard',
});

// 添加留言
router.post('/add', async (ctx, next) => {
  const { parentId, proId, replayId, userId, message } = ctx.request.body;
  if (!proId) {
    ctx.body = Utils.formatError({ message: '商品id不能为空' });
    return;
  }
  if (!message) {
    ctx.body = Utils.formatError({ message: '留言不能为空' });
    return;
  }
  const params = { parentId, proId, replayId, userId, message };
  await messageDTO.addMessage(params).then(async res => {
    ctx.body = Utils.formatSuccess('添加成功');
  });
});

// 查询留言
router.post('/getMsgBoard', async (ctx, next) => {
  const { proId } = ctx.request.body;
  if (!proId) {
    ctx.body = Utils.formatError({ message: '商品id不能为空' });
    return;
  }
  await messageDTO.getAllByPro({ proId }).then(async res => {
    // 查询当前商品下所有留言 => 转换成子树结构
    let firstLevel = [];
    let children = [];
    res.map(r => {
      if (!r.parentId) {
        firstLevel.push(r);
      } else {
        children.push(r);
      }
    });
    firstLevel.map(f => {
      const parentId = f.id;
      f.children = [];
      children.map(c => {
        if (parentId == c.parentId) {
          f.children.push(c);
        }
      });
    });
    ctx.body = Utils.formatSuccess({
      list: firstLevel,
    });
  });
});

module.exports = router;
