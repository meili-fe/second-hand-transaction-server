const Utils = require('../utils/index');
const Router = require('koa-router');

const productDTO = require('../controller/product');

const router = new Router({
  prefix: '/koa-page',
});

// 后台审核使用 页面
router.post('/checkPro', async (ctx, next) => {
  const { title, status, cate: cate_id, pageSize = 10, current: page = 1 } = ctx.request.body;
  const params = { title, status, pageSize, page, cate_id };
  await productDTO.backEndfindProduct(params).then(async res => {
    res.map(r => {
      let time = new Date(r.create_time);
      r.create_time = `${time.getFullYear()}-${time.getMonth() +
        1}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      const imgList = r.img_list ? r.img_list.split(',') : '';
      r.img_list = imgList;
    });
    // ctx.render('reviewVue.html', {
    //   list: res,
    //   page: params.page,
    //   pageSize: params.pageSize,
    // });
    let oCount = await productDTO.findProductCount(params);

    ctx.body = Utils.formatSuccess({
      list: res,
      page: params.page,
      pageSize: params.pageSize,
      totalCount: oCount[0]['count(*)'],
    });
  });
});

module.exports = router;
