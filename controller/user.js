const { query } = require('../db');
let findUser = function(params) {
  let { name, pageSize, page } = params;
  let offset = (page - 1) * pageSize;
  let sql = `SELECT user.id,user.user_name,user.user_email,upload.file_name,upload.file_path FROM user  LEFT JOIN upload ON user.id = upload.user_id `;

  if (name) {
    offset = 0;
    sql += ` WHERE user.user_name = ?  `;
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
let findUserByName = function(user_name) {
  let sql = 'SELECT * FROM user  WHERE user_name = ?';
  let value = [user_name];
  return query(sql, value);
};
let findUserByOpenId = function(openId) {
  let sql = 'SELECT * FROM user  WHERE open_id = ?';
  let value = [openId];
  return query(sql, value);
};
let insertUser = function(params) {
  let { openId, name, imgUrl } = params;
  console.log(openId);
  let sql = 'INSERT INTO user (open_id,name,img_url,create_time) VALUES (?,?,?,?)';
  let value = [openId, name, imgUrl, new Date()];
  return query(sql, value);
};
let deleteUserById = function(params) {
  let { id } = params;
  let sql = 'DELETE FROM user WHERE id = ?';
  let value = [id];
  return query(sql, value);
};
let modifyUserName = function(params) {
  let { id, user_name, user_email } = params;
  let sql = 'UPDATE user SET user_name = ?,user_email=? WHERE id=?',
    value = [user_name, user_email, id];
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
};
