const { query } = require('../db');

// 查询所有求购列表
let findPurchase = function(params) {
  let { title, pageSize = 10, page = 1 } = params;
  let offset = (page - 1) * pageSize;
  let value = [];
  let sql = `SELECT 
    p.id,p.title,p.low_price lowPrice,p.high_price highPrice,p.description,p.status,p.create_time,p.update_time,
    u.name userName,u.img_url imgUrl
    FROM purchase p
    LEFT JOIN user u ON u.id = p.owner_id
    WHERE p.status in (0,1)
    `;

  if (title) {
    offset = 0;
    sql += ` AND  p.title like ? `;
    value.push('%' + title + '%');
  }

  sql += ` GROUP BY p.id ORDER BY FIELD(p.status,0,1), p.create_time DESC  limit ${offset},${pageSize}  `;

  return query(sql, value);
};

// 查询当前用户求购
let findPurchaseByUser = function(params) {
  let { ownerId, userId } = params;
  let sql = `SELECT 
    p.id,p.owner_id userId,p.title,p.low_price lowPrice,p.high_price highPrice,p.description,p.status,p.create_time createTime,p.update_time updateTime, 
    u.name userName,u.img_url imgUrl
    FROM purchase p
    LEFT JOIN user u ON u.id = p.owner_id WHERE owner_id = ?
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC`;
  let id = ownerId ? ownerId : userId;
  let value = [id];
  return query(sql, value);
};

// 查询求购详情
let findPurchaseById = function(params) {
  let { id } = params;
  let sql = `SELECT 
    p.id,p.owner_id userId,p.title,p.status,p.low_price lowPrice,p.high_price highPrice,p.description,p.create_time createTime,p.update_time updateTime, 
    u.name userName,u.contact,u.img_url imgUrl
    FROM purchase p
    LEFT JOIN user u ON u.id = p.owner_id WHERE p.id = ?
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC`;
  let value = [id];
  return query(sql, value);
};

// 查询求购总数
let findPurchaseCount = function(params) {
  let { title, status } = params;
  let value = [];
  let sql = `SELECT count(*) FROM purchase  WHERE 1 = 1`;

  if (title) {
    sql += ` AND title like ? `;
    value.push('%' + title + '%');
  }
  if (status || status === 0) {
    sql += ` AND status = ?`;
    value.push(parseInt(status));
  }
  return query(sql, value);
};
// 添加求购信息
let insertPurchase = function(params) {
  let { userId, title, lowPrice, highPrice, description } = params;
  let sql =
    'INSERT INTO purchase (owner_id,title,low_price,high_price,description,status,create_time) VALUES (?,?,?,?,?,?,?)';
  let value = [userId, title, lowPrice, highPrice, description, 0, new Date()];
  return query(sql, value);
};

// 修改修购信息
let updatePurchase = function(params) {
  let { title, status = 0, lowPrice, highPrice, description, id } = params;
  let sql = 'UPDATE purchase SET title=?,status=?,low_price=?,high_price=?,description=? WHERE id=?',
    value = [title, status, lowPrice, highPrice, description, id];
  return query(sql, value);
};

module.exports = {
  findPurchase,
  findPurchaseCount,
  findPurchaseByUser,
  findPurchaseById,
  insertPurchase,
  updatePurchase,
};
