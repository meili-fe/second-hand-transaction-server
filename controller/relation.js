const { query } = require('../db');
const func = require('../utils/qiniu');

// 添加收藏/点赞
let insertRelationPro = function(params) {
  let { userId, targetUserId, proId, type, status } = params;
  let sql = 'INSERT INTO relation (user_id,target_user_id,pro_id,type,status,create_time) VALUES (?,?,?,?,?,?)';
  let value = [userId, targetUserId, proId, type, status, new Date()];
  return query(sql, value);
};
// 修改收藏/点赞
let updateRelationPro = function(params) {
  let { userId, proId, type, status } = params;
  console.log(params);
  let sql = 'UPDATE relation SET status=? WHERE pro_id=? AND user_id=? AND type=?';
  let value = [status, proId, userId, type];
  return query(sql, value);
};
// 查询某个商品是否被某人收藏或者点赞
let searchRelationByUserAndPro = function(params) {
  let { proId, userId, type } = params;
  let sql = 'SELECT count(*) FROM relation WHERE pro_id = ? AND user_id = ? AND type=?';
  let value = [proId, userId, type];
  return query(sql, value);
};
//查询当前用户收藏商品列表
let searchProListByUser = function(params) {
  let { userId } = params;
  let sql = `
  SELECT
    r.user_id userId,p.id proId,p.title,p.location,p.original,p.team,p.price,p.contact,p.description,p.status,p.create_time,p.update_time,r.type,
    c.name category_name,
    GROUP_CONCAT( p_img.img_url ) AS img_list
    FROM relation r
    LEFT JOIN product p ON r.user_id = p.owner_id  
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id
    LEFT JOIN category c ON p.cate_id = c.id 
    WHERE owner_id = ? AND r.status = 0 AND  r.type = 1
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC,p_img.create_time ASC`;
  let value = [userId];
  return query(sql, value);
};
// 查看卖出列表
let relationProList = function(params) {
  let sql = `
    p.id,p.title,p.location,p.price,p.contact,p.description,p.status,p.create_time,p.update_time,
    c.name category_name,
    GROUP_CONCAT( p_img.img_url ) AS img_list     
    FROM relation r 
    LEFT JOIN product p ON r.user_id = p.owner_id  AND r.pro_id = p.id
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id WHERE owner_id = ? AND r.status = 0
    AND date_sub(curdate(), INTERVAL 30 DAY) <= date(p.update_time);
  `;
  let value = [];
  return query(sql, value);
};

// 查询某件产品点赞数 / 收藏数
let getCountById = function(params) {
  let { id, type } = params;
  let sql = `
    SELECT count(*) count  FROM relation r
    WHERE r.pro_id = ? AND r.type = ? AND r.status = 0  
  `;
  let value = [id, type];
  return query(sql, value);
};
// 查询某件商品被登录用户点赞，收藏的状态
let getStatusByUser = function(params) {
  let { proId, userId } = params;
  let sql = `
    SELECT type,status  FROM relation r
    WHERE r.pro_id = ?  AND r.user_id = ?
  `;
  let value = [proId, userId];
  return query(sql, value);
};

module.exports = {
  insertRelationPro,
  updateRelationPro,
  searchProListByUser,
  searchRelationByUserAndPro,
  relationProList,
  getCountById,
  getStatusByUser,
};
