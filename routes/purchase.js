const Router = require('koa-router');
const Utils = require('../utils/index');
const config = require('../db/config');
const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const asyncBusboy = require('async-busboy');

const purchaseDTO = require('../controller/purchase');
const messageDTO = require('../controller/messageBoard');

const relationDTO = require('../controller/relation');
const func = require('../utils/qiniu');
const { sequelize } = require('../db');
const Promise = require('bluebird');

const router = new Router({
  prefix: '/koa-api/purchase',
});

//查询求购列表
router.post('/list', async (ctx, next) => {
  let params = ctx.request.body;
  let oCount = await purchaseDTO.findPurchaseCount(
    Object.assign(params, {
      isShowList: true,
    })
  );
  await purchaseDTO.findPurchase(params).then(async res => {
    ctx.body = Utils.formatSuccess({
      list: res,
      page: params.page,
      pageSize: params.pageSize,
      totalCount: oCount[0]['count(*)'],
    });
  });
});

//查询当前用户信息
router.post('/purchaseByUser', async (ctx, next) => {
  let params = ctx.request.body;
  await purchaseDTO.findPurchaseByUser(params).then(async res => {
    ctx.body = Utils.formatSuccess(res);
  });
});
//查询求购详情
router.post('/purchaseById', async (ctx, next) => {
  let params = ctx.request.body;
  const { id } = params;
  if (!id) {
    ctx.body = Utils.formatError({ message: '求购id不能为空' });
    return;
  }
  let firstLevel = [];

  await messageDTO.getAllByPro({ proId: id, type: 1 }).then(async res => {
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
  });
  await purchaseDTO.findPurchaseById(params).then(async res => {
    if (!res[0]) {
      ctx.body = Utils.formatError({ message: '未查询到商品' });
      return;
    }
    ctx.body = Utils.formatSuccess(
      Object.assign(res[0], {
        messageBoard: firstLevel,
      })
    );
  });
});

//添加求购信息
router.post('/add', async (ctx, next) => {
  let params = ctx.request.body || {};
  await purchaseDTO.insertPurchase(params).then(async res => {
    ctx.body = Utils.formatSuccess();
  });
});

//修改求购信息
router.post('/update', async (ctx, next) => {
  let params = ctx.request.body || {};
  // 修改求购信息
  await purchaseDTO.updatePurchase(params).then(async res => {
    ctx.body = Utils.formatSuccess('修改成功');
  });
});

//修改求购状态
router.post('/changeStatus', async (ctx, next) => {
  let params = ctx.request.body || {};

  await purchaseDTO.updatePurchaseStatus(params).then(async res => {
    ctx.body = Utils.formatSuccess(null, '修改成功');
  });
});

//修改求购所属状态
router.post('/updateStatus', async (ctx, next) => {
  let params = ctx.request.body || {};
  await purchaseDTO.updatePurchaseSataus(params).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});

//删除求购信息
router.post('/del', async (ctx, next) => {
  await purchaseDTO.deletePurchaseById(ctx.request.body).then(res => {
    ctx.body = Utils.formatSuccess();
  });
});
//删除图片信息
router.post('/delImgByUrl', async (ctx, next) => {
  await purchaseDTO.deletePurchaseImg(ctx.request.body).then(res => {
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
