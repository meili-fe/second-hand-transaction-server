// 数据库配置
const config = {
  port: 3306,
  database: {
    DATABASE: 'ganksolo_mljr', //数据库
    USERNAME: 'ganksolo_mljr', //用户
    PASSWORD: 'password', //密码
    PORT: '3306', //端口
    HOST: 'ganksolo.com', //服务ip地址
  },
  appURL: 'second-hand.ganksolo.com', //项目根域名
  CDN: 'cdn.ganksolo.com',
  // appURL: 'localhost:3003',
  appId: 'wxf07478d878a186e2',
  secret: '3cafd782558a1439b5b2f2799dd04374',
  tinifyKEY: 'I6CIP0zKRp3plw8dBp9CUUHeacrjCa8b',
  QINIU: {
    accessKey: '3XO7kXUH4Q6tH2d21nXpG02kuPauhSXGtzAUwLJh',
    secretKey: 'ab2Wqh_wYN-WLvXv-YbKE-Tm2zEm2O5_CI8uXpfq',
    bucket: 'mljr-second-hand',
  },
};
module.exports = config;
