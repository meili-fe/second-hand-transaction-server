const Utils = require('../utils/index');
const Router = require('koa-router');

const productDTO = require('../controller/product');

const router = new Router({
  prefix: '/koa-page',
});

// 后台审核使用 页面
router.get('/checkPro', async (ctx, next) => {
  const { title, cate_id, pageSize = 10, page = 1 } = ctx.query;
  const params = { title, cate_id, pageSize, page };
  await productDTO.backEndfindProduct(params).then(async res => {
    res.map(r => {
      let time = new Date(r.create_time);
      r.create_time = `${time.getFullYear()}-${time.getMonth() +
        1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const imgList = r.img_list ? r.img_list.split(',') : '';
      r.img_list = imgList;
    });
    ctx.render('review.html', {
      list: res,
      page: params.page,
      pageSize: params.pageSize,
    });
  });
});

module.exports = router;
