const IS = require('is');
const crypto = require('crypto');
const WXBizDataCrypt = require('./WXBizDataCrypt');
const config = require('../db/config');
const request = require('request');
const userDTO = require('../controller/user');
const COMMON = require('./common');

const SECRET = 'mlxysecret';
let util = {
  //formatData 必须为 {key,type}的格式,可以不传type
  formatData(params, valids) {
    let res = true;
    if (!IS.object(params)) return false;
    if (!IS.array(valids)) return false;
    for (let i = 0; i < valids.length; i++) {
      let e = valids[i];
      let { key, type } = e;
      if (!key) {
        res = false;
        break;
      }
      let value = params[key] || '';
      if (type === 'not_empty') {
        if (IS.empty(value)) {
          res = false;
          break;
        }
      } else if (type === 'number') {
        value = Number(value);
        if (!IS.number(value) || IS.nan(value)) {
          res = false;
          break;
        }
      } else if (type === 'reg') {
        let reg = e['reg'];
        if (!reg || !reg.test(value)) {
          res = false;
          break;
        }
      } else {
        if (!IS[type](value)) {
          res = false;
          break;
        }
      }
    }
    return res;
  },
  filter(params, filterArr) {
    if (IS.object(params) && IS.array(filterArr)) {
      let data = {};
      filterArr.forEach(e => {
        let val = params[e];
        if ((!IS.undefined(val) && !IS.null(val) && !IS.empty(val)) || IS.array.empty(val)) {
          data[e] = val;
        }
      });
      return data;
    } else {
      return params;
    }
  },
  // 错误信息格式
  formatError(err) {
    return {
      code: err.status || COMMON.COMMON_STATUS.PARAM_ERRO,
      msg: err.message,
      success: false,
      data: null,
    };
  },
  formatParamError(msg) {
    return {
      code: COMMON.COMMON_STATUS.PARAM_ERRO,
      msg,
      success: false,
      data: null,
    };
  },
  // 成功信息包装
  formatSuccess(data = {}, msg = '操作成功') {
    return {
      code: COMMON.COMMON_STATUS.SUCCESS,
      msg,
      success: true,
      data,
    };
  },
  queryData(params, queryArr) {
    //仅适用于列
    let data = {};
    if (this.type(params) == 'object' && this.type(queryArr) == 'array') {
      queryArr.forEach(e => {
        let val = params[e];
        if (!!val || val == 0) {
          data[e] = params[e];
        }
      });
    }
    return data;
  },
  createTryptoSha(data) {
    return crypto
      .createHash('sha1')
      .update(data, 'utf8')
      .digest('hex');
  },
  cryptoData(sessionKey, data, iv) {
    return new Promise((resolve, reject) => {
      var pc = new WXBizDataCrypt(config.appId, sessionKey);
      var a = pc.decryptData(data, iv);
      resolve(a);
    });
  },
  getUserInfo(code, name, imgUrl) {
    return new Promise((resolve, reject) => {
      let options = {
        url: 'https://api.weixin.qq.com/sns/jscode2session',
        qs: {
          appid: config.appId,
          secret: config.secret,
          js_code: code,
          grant_type: 'authorization_code',
        },
      };
      request(options, async (err, response, body) => {
        if (err) reject(err);
        body = JSON.parse(body);
        let skey = body.session_key;
        let data = {
          key: skey,
          openId: body.openid,
        };
        // 判断用户是否存在，不存在则查询用户信息 并 落库
        const user = await userDTO.findUserByOpenId(data.openId);
        if (!user || user.length <= 0) {
          const param = { openId: body.openid, name, imgUrl };
          await userDTO.insertUser(param).then(res => {
            const { insertId } = res;
            data.userId = insertId;
          });
        } else {
          data.userId = user[0].id;
        }
        const userInfo = this.encrypt(JSON.stringify(data));
        // 过期时间校验 5 小时
        const expireTime = new Date().getTime() + 5 * 60 * 60 * 1000;
        const result = {
          userInfo,
          userId: data.userId,
          expireTime,
        };
        resolve(result);
      });
    });
  },
  //加密
  encrypt(str) {
    const cipher = crypto.createCipher('aes192', SECRET);
    var crypted = cipher.update(str, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
  },
  //解密
  decrypt(str) {
    const decipher = crypto.createDecipher('aes192', SECRET);
    var decrypted = decipher.update(str, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  },
};

module.exports = util;
