const { query } = require('../db');
let findUser = function(params) {
  let { name, pageSize, page } = params;
  let offset = (page - 1) * pageSize;
  let sql = `SELECT user.id,user.na me,user.user_email,upload.file_name,upload.file_path FROM user  LEFT JOIN upload ON user.id = upload.user_id `;

  if (name) {
    offset = 0;
    sql += ` WHERE user.name = ?  `;
  }
  sql += `ORDER BY user.create_time DESC  limit ${offset},${pageSize} `;

  let value = [name];
  return query(sql, value);
};
let findUserCount = function(params) {
  let { id } = params;
  let sql = `SELECT count(*) FROM user `;
  if (id) {
    sql += ` WHERE id = ?  `;
  }
  let value = [id];
  return query(sql, value);
};
let findUserByName = function(name) {
  let sql = 'SELECT * FROM user  WHERE name = ?';
  let value = [name];
  return query(sql, value);
};
let findUserByid = function(id) {
  let sql = `SELECT  id,open_id,name,update_time,create_time,img_url,team,location, ifnull(contact,'') contact FROM user  WHERE id = ${id}`;
  return query(sql);
};
let findUserByOpenId = function(openId) {
  let sql = 'SELECT * FROM user  WHERE open_id = ?';
  let value = [openId];
  return query(sql, value);
};
let insertUser = function(params) {
  let { openId, name, imgUrl, sex } = params;
  console.log(openId);
  let sql = 'INSERT INTO user (open_id,name,img_url,create_time,sex) VALUES (?,?,?,?,?)';
  let value = [openId, name, imgUrl, new Date(), sex];
  return query(sql, value);
};
let deleteUserById = function(params) {
  let { id } = params;
  let sql = 'DELETE FROM user WHERE id = ?';
  let value = [id];
  return query(sql, value);
};
let modifyUserName = function(params) {
  let { userId, sex, contact, team, location } = params;
  let sql = `UPDATE user SET sex = ?, contact = ? , team = ? , location = ? WHERE id=${userId}`;
  value = [sex, contact, team, location];
  return query(sql, value);
};
let findUserImgCount = function(user_id) {
  let sql = `SELECT count(*) FROM upload WHERE user_id = ?`;
  let value = [user_id];
  return query(sql, value);
};
let uploadUserImg = function(params) {
  let { user_id, file_name, file_path } = params;
  let sql = 'INSERT INTO upload (user_id,file_name,file_path) VALUES (?,?,?)';
  let value = [user_id, file_name, file_path];
  return query(sql, value);
};
let updateUserImg = function(params) {
  let { user_id, file_name, file_path } = params;
  let sql = 'UPDATE upload SET file_name=?,file_path=? WHERE user_id=?';
  let value = [file_name, file_path, user_id];
  return query(sql, value);
};
// 查询卖出商品列表用户顺序
let findProOrderBySaled = function() {
  // WHERE p.status = 2
  let sql = `SELECT count(*) saleCount, u.name,u.img_url imgUrl,u.id userId FROM user u 
  LEFT JOIN product p ON u.id = p.owner_id 
  WHERE p.status = 2
  GROUP BY u.id ORDER BY saleCount DESC
  `;
  let value = [];
  return query(sql, value);
};
// 点赞/收藏-最多
let findProOrderByRelation = function(params) {
  let { type } = params;
  let sql = `SELECT count(*) count, u.name,u.img_url imgUrl,u.id userId FROM user u 
  LEFT JOIN relation r ON u.id = r.target_user_id 
  WHERE r.type = ? AND r.status = 0
  GROUP BY u.id ORDER BY count DESC
  `;
  let value = [type];
  return query(sql, value);
};

module.exports = {
  findUser,
  findUserByName,
  modifyUserName,
  insertUser,
  findUserByOpenId,
  deleteUserById,
  findUserCount,
  findUserImgCount,
  updateUserImg,
  uploadUserImg,
  findProOrderBySaled,
  findProOrderByRelation,
  findUserByid,
};
