const Router = require("koa-router");
const Utils = require("../utils/index");

const productDTO = require("../controller/product");

const router = new Router({
  prefix: "/koa-api/product",
});
//查询产品列表
router.post("/list", async (ctx, next) => {
  let params = ctx.request.body;
  let oCount = await productDTO.findProductCount(params);
  await productDTO.findProduct(params).then(async res => {
    ctx.body = Utils.formatSuccess({
      list: res,
      page: params.page,
      pageSize: params.pageSize,
      totalCount: oCount[0]["count(*)"],
    });
  });
});

//添加商品
router.post("/add", async (ctx, next) => {
  await productDTO.insertProduct(ctx.request.body).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//修改商品信息
router.post("/update", async (ctx, next) => {
  let params = ctx.request.body || {};
  await productDTO.updateProduct(params).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//修改商品所属状态
router.post("/updateStatus", async (ctx, next) => {
  let params = ctx.request.body || {};
  await productDTO.updateProductSataus(params).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//删除商品信息
router.post("/del", async (ctx, next) => {
  await productDTO.deleteProductById(ctx.request.body).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

module.exports = router;
