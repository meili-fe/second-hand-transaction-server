// 上传到七牛
let qiniu = require('qiniu'); // 需要加载qiniu模块的
// 引入key文件
const Config = require('../db/config');
const upToQiniu = (filePath, key) => {
  const accessKey = Config.QINIU.accessKey;
  const secretKey = Config.QINIU.secretKey;
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
  // bucket是存储空间名称
  const options = {
    scope: Config.QINIU.bucket,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  // 生成token 作为个人七牛云账号的识别标识
  const uploadToken = putPolicy.uploadToken(mac);
  const config = new qiniu.conf.Config();
  // 空间对应的机房 一定要按自己属区Zone对象
  config.zone = qiniu.zone.Zone_z1;
  const localFile = filePath;
  const formUploader = new qiniu.form_up.FormUploader(config);
  const putExtra = new qiniu.form_up.PutExtra();
  // 文件上传
  return new Promise((resolved, reject) => {
    // 以文件流的形式进行上传
    // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
    // putExtra是上传的文件参数，采用源码中的默认参数
    formUploader.putStream(uploadToken, key, localFile, putExtra, function(respErr, respBody, respInfo) {
      if (respErr) {
        reject(respErr);
      } else {
        resolved(respBody);
      }
    });
  });
};

const removeFromQiniu = key => {
  var bucket = Config.QINIU.bucket;
  var mac = new qiniu.auth.digest.Mac(Config.QINIU.accessKey, Config.QINIU.secretKey);
  var config = new qiniu.conf.Config();
  config.zone = qiniu.zone.Zone_z1;
  var bucketManager = new qiniu.rs.BucketManager(mac, config);

  return new Promise((resolved, reject) => {
    // 以文件流的形式进行上传
    // uploadToken是token， key是上传到七牛后保存的文件名, localFile是流文件
    // putExtra是上传的文件参数，采用源码中的默认参数

    bucketManager.delete(bucket, key, function(err, respBody, respInfo) {
      if (err) {
        reject(err);
        //throw err;
      } else {
        resolved(respBody);
      }
    });
  });
};
module.exports = {
  upToQiniu,
  removeFromQiniu,
};
