const IS = require("is");
const crypto = require("crypto");
const WXBizDataCrypt = require("./WXBizDataCrypt");
const config = require("../db/config");
const request = require("request");
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
      let value = params[key] || "";
      if (type === "not_empty") {
        if (IS.empty(value)) {
          res = false;
          break;
        }
      } else if (type === "number") {
        value = Number(value);
        if (!IS.number(value) || IS.nan(value)) {
          res = false;
          break;
        }
      } else if (type === "reg") {
        let reg = e["reg"];
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
        if (
          (!IS.undefined(val) && !IS.null(val) && !IS.empty(val)) ||
          IS.array.empty(val)
        ) {
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
      code: err.status,
      msg: err.message,
      success: false,
      data: null,
    };
  },
  // 成功信息包装
  formatSuccess(data = {}, msg = "操作成功") {
    return {
      code: 0,
      msg,
      success: true,
      data,
    };
  },
  queryData(params, queryArr) {
    //仅适用于列
    let data = {};
    if (this.type(params) == "object" && this.type(queryArr) == "array") {
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
      .createHash("sha1")
      .update(data, "utf8")
      .digest("hex");
  },
  cryptoData(sessionKey, data, iv) {
    return new Promise((resolve, reject) => {
      var pc = new WXBizDataCrypt(config.appId, sessionKey);
      var a = pc.decryptData(data, iv);
      resolve(a);
    });
  },
  getUserInfo(code) {
    let USERINFO = [];
    return new Promise((resolve, reject) => {
      let options = {
        url: "https://api.weixin.qq.com/sns/jscode2session",
        qs: {
          appid: config.appId,
          secret: config.secret,
          js_code: code,
          grant_type: "authorization_code",
        },
      };
      request(options, (err, response, body) => {
        if (err) reject(err);
        body = JSON.parse(body);
        let skey = this.createTryptoSha(body.session_key);
        let data = {
          key: skey,
          openid: body.openid,
        };
        resolve(data);
      });
    });
  },
};
module.exports = util;
