const COMMON_STATUS = {
  NEED_LOGIN: 600,
  SUCCESS: 0,
  PARAM_ERRO: 1,
};
//定义允许直接访问的url
const ALLOWPAGE = [
  '/koa-api/user/login',
  '/koa-api/user/saleList',
  '/koa-api/product/allType',
  '/koa-api/product/list',
  '/koa-api/product/upload',
  '/koa-api/product/productById',
  '/koa-page/checkPro',
  '/koa-api/product/changeStatus',
  '/koa-api/relation/listByUser',
  '/koa-api/relation/getCount',
  '/koa-api/user/relationList',
];
module.exports = { COMMON_STATUS, ALLOWPAGE };
