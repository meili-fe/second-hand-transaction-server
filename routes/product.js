const Router = require('koa-router');
const Utils = require('../utils/index');
const config = require('../db/config');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const asyncBusboy = require('async-busboy');

const productDTO = require('../controller/product');
const func = require('../utils/qiniu');

const router = new Router({
  prefix: '/koa-api/product',
});
//查询产品列表
router.post('/list', async (ctx, next) => {
  let params = ctx.request.body;
  let oCount = await productDTO.findProductCount(params);
  await productDTO.findProduct(params).then(async res => {
    ctx.body = Utils.formatSuccess({
      list: res,
      page: params.page,
      pageSize: params.pageSize,
      totalCount: oCount[0]['count(*)'],
    });
  });
});

//查询分类列表
router.post('/allType', async (ctx, next) => {
  await productDTO.findAllType().then(async res => {
    ctx.body = Utils.formatSuccess(res);
  });
});
//查询当前用户信息
router.post('/productByUser', async (ctx, next) => {
  let params = ctx.request.body;
  await productDTO.findProductByUser(params).then(async res => {
    ctx.body = Utils.formatSuccess(res);
  });
});
//查询商品详情
router.post('/productById', async (ctx, next) => {
  let params = ctx.request.body;
  await productDTO.findProductById(params).then(async res => {
    ctx.body = Utils.formatSuccess(res[0]);
  });
});

//添加商品
router.post('/add', async (ctx, next) => {
  let { img_list } = ctx.request.body;
  console.log('-------');
  console.log(ctx.state);
  await productDTO.insertProduct(ctx.request.body).then(async res => {
    let { insertId } = res;
    let aImg = img_list.split(',');
    aImg.forEach(item => {
      let params = {
        pro_id: insertId,
        img_url: item,
      };
      productDTO.insertProductImg(params);
    });
    ctx.body = Utils.formatSuccess('图片添加成功');
  });
});

//修改商品信息
router.post('/update', async (ctx, next) => {
  let params = ctx.request.body || {};
  let { oldImgList, newImgList, id } = ctx.request.body;

  // 修改商品信息
  await productDTO.updateProduct(params);
  //更新商品图片
  const aImg = newImgList.split(',');

  // 删除删掉的图片
  const bImg = oldImgList.split(',');
  const deleteImgs = [];
  const addImgs = [];
  bImg.map(old => {
    if (!aImg.includes(old)) {
      //要删掉的图
      deleteImgs.push(old);
    }
  });
  aImg.map(nw => {
    if (!bImg.includes(nw)) {
      addImgs.push(nw);
    }
  });

  addImgs.map(item => {
    let params = {
      pro_id: id,
      img_url: item,
    };
    productDTO.insertProductImg(params);
  });

  deleteImgs.map(item => {
    let params = {
      img_url: item,
    };
    productDTO.deleteProductImg(params);
  });

  ctx.body = Utils.formatSuccess(params, '图片添加成功');
});

//修改商品状态
router.post('/changeStatus', async (ctx, next) => {
  let params = ctx.request.body || {};

  await productDTO.updateProductStatus(params).then(async res => {
    ctx.body = Utils.formatSuccess(null, '修改成功');
  });
});

//修改商品所属状态
router.post('/updateStatus', async (ctx, next) => {
  let params = ctx.request.body || {};
  await productDTO.updateProductSataus(params).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//删除商品信息
router.post('/del', async (ctx, next) => {
  await productDTO.deleteProductById(ctx.request.body).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});
//删除图片信息
router.post('/delImgByUrl', async (ctx, next) => {
  await productDTO.deleteProductImg(ctx.request.body).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//上传产品图片
router.post('/uploadlocal', async (ctx, next) => {
  const { files, fields } = await asyncBusboy(ctx.req);
  console.log('---------------');
  console.log(files[0]);
  // 判断文件数量
  if (files.length === 0) {
    ctx.throw(500, '图片不存在');
  } else {
    let file = files[0];
    // 判断图片类型
    if (file.mimeType.indexOf('image') === -1) {
      ctx.throw(500, '图片类型错误');
    }
    // 重置图片名
    let imgName = new Date().getTime() + '.' + file.filename.split('.').pop();
    let name = file.filename.split('.').shift();
    // 将图片放在upload目录下
    let savePath = path.join(__dirname, `../views/upload/${imgName}`);
    let params = {
      file_name: name,
      file_path: `http://${config.appURL}/upload/${imgName}`,
    };
    // 存储图片
    let saveImg = function() {
      // let token = QINIU.uptoken(name);
      // QINIU.uploadFile(token, name, file.path);

      // let img = fs.readFileSync(file.path);
      // fs.writeFileSync(savePath, img);
      // fs.unlinkSync(file.path); //清除缓存文件
      ctx.body = Utils.formatSuccess(params);
    };
    await saveImg();
  }
});
//上传产品图片
router.post('/upload', async (ctx, next) => {
  // 前端必须以formData格式进行文件的传递
  const { files, fields } = await asyncBusboy(ctx.req);
  if (files.length === 0) {
    ctx.throw(500, '图片不存在');
  } else {
    let file = files[0];
    console.log('~~~~~~~~~~~~~~');
    console.log(file);
    // 命名文件
    const fileName = uuid.v1();
    // 创建文件可读流
    const reader = fs.createReadStream(file.path);
    // 获取上传文件扩展名
    const ext = file.filename.split('.').pop();
    // 命名文件以及拓展名
    const fileUrl = `${fileName}.${ext}`;
    // 调用方法(封装在utils文件夹内)
    const result = await func.upToQiniu(reader, fileUrl);
    if (result) {
      let params = {
        file_name: result.hash,
        file_path: `https://${config.CDN}/${result.key}`,
      };
      ctx.body = Utils.formatSuccess(params);
    } else {
      ctx.throw(500, '上传失败！');
    }
  }
});

module.exports = router;
