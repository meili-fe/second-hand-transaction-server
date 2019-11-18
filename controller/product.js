const { query } = require('../db');
const func = require('../utils/qiniu');

// 查询所有产品
let findProduct = function(params) {
  let { title, cate_id, location, pageSize = 10, page = 1 } = params;
  let offset = (page - 1) * pageSize;
  let value = [];
  let sql = `SELECT 
    p.id,p.title,p.location,p.price,p.contact,p.description,p.status,p.original, p.team,p.create_time,p.update_time,
    c.name category_name,u.name username,u.img_url imgUrl,
    GROUP_CONCAT( p_img.img_url ) AS img_list
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id 
    LEFT JOIN user u ON u.id = p.owner_id
    WHERE p.status in (1,2)
    `;

  if (title) {
    offset = 0;
    sql += ` AND  p.title like ? `;
    value.push('%' + title + '%');
  }
  if (location) {
    offset = 0;
    sql += ` AND  p.location = ? `;
    value.push(parseInt(location));
  }
  if (cate_id) {
    sql += ` AND  p.cate_id = ? `;
    value.push(parseInt(cate_id));
  }

  sql += ` GROUP BY p.id ORDER BY FIELD(p.status,1,2), p.create_time DESC,p_img.create_time ASC  limit ${offset},${pageSize}  `;

  return query(sql, value);
};

// 后台审核查看列表
let backEndfindProduct = function(params) {
  let { title, status, cate_id, location, pageSize = 10, page = 1 } = params;
  let offset = (page - 1) * pageSize;
  let value = [];
  let sql = `SELECT 
    p.id,p.title,p.location,p.price,p.contact,p.description,p.status,p.create_time,p.update_time,
    c.name category_name,u.name username,u.img_url imgUrl,
    GROUP_CONCAT( p_img.img_url ) AS img_list  
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id 
    LEFT JOIN user u ON u.id = p.owner_id
    WHERE 1 = 1 
    `;

  if (title) {
    offset = 0;
    sql += ` AND  p.title like ? `;
    value.push('%' + title + '%');
  }
  if (status || status === 0) {
    sql += ` AND  p.status = ? `;
    value.push(parseInt(status));
  }
  if (cate_id) {
    sql += ` AND  p.cate_id = ? `;
    value.push(parseInt(cate_id));
  }

  sql += ` GROUP BY p.id ORDER BY p.create_time DESC  limit ${offset},${pageSize}  `;

  return query(sql, value);
};

// 查询当前用户发布产品
let findProductByUser = function(params) {
  let { ownerId, status, userId } = params;
  console.log(params);
  let value = [];
  let sql = `SELECT 
    p.id,p.title,p.location,p.price,p.contact,p.description,p.status,p.original, p.team,p.create_time,p.update_time,
    c.name category_name,
    GROUP_CONCAT( p_img.img_url ) AS img_list     
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id WHERE owner_id = ?
    `;
  let id = ownerId ? ownerId : userId;
  value.push(parseInt(id));
  if (!!status) {
    sql += ` AND  p.status = ? `;
    value.push(parseInt(status));
  }
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC,p_img.create_time ASC`;
  return query(sql, value);
};
// 查询产品分类
let findAllType = function() {
  let sql = `SELECT id,name,description FROM category `;
  return query(sql);
};

// 查询商品详情
let findProductById = function(params) {
  let { id } = params;
  let sql = `SELECT 
    p.id,p.owner_id,p.title,p.location,p.price,p.contact,p.description,p.original, p.team,p.status,p.create_time,p.update_time,p.cate_id,
    c.name category_name,u.name username,u.img_url imgUrl,
    GROUP_CONCAT( p_img.img_url ) AS img_list
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN user u ON u.id = p.owner_id
    LEFT JOIN category c ON p.cate_id = c.id WHERE p.id = ?
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC,p_img.create_time ASC`;
  let value = [id];
  return query(sql, value);
};

// 查询产品总数
let findProductCount = function(params) {
  let { cate_id, title, status, isShowList } = params;
  let value = [];
  let sql = `SELECT count(*) FROM product  WHERE 1 = 1`;

  if (cate_id) {
    sql += ` AND cate_id = ?  `;
    value.push(parseInt(cate_id));
  }
  if (title) {
    sql += ` AND title like ? `;
    value.push('%' + title + '%');
  }
  if (isShowList) {
    sql += ` AND status in (1,2)`;
  } else if (status || status === 0) {
    sql += ` AND status = ?`;
    value.push(parseInt(status));
  }
  return query(sql, value);
};
// 添加商品
let insertProduct = function(params) {
  let { cate_id, title, location, price, description, contact, original, team, userId } = params;
  console.log(`-----insert product => ${params}`);
  let sql =
    'INSERT INTO product (cate_id,owner_id,title,location,price,description,contact,status,original,team,create_time) VALUES (?,?,?,?,?,?,?,?,?,?,?)';
  let value = [cate_id, userId, title, location, price, description, contact, 0, original, team, new Date()];
  return query(sql, value);
};

// 添加图片
let insertProductImg = function(params) {
  let { pro_id, img_url } = params;
  let sql = 'INSERT INTO product_img (pro_id,img_url,create_time) VALUES (?,?,now())';
  let value = [pro_id, img_url];
  return query(sql, value);
};
// 删除图片
let deleteProductImg = function(params) {
  let { img_url } = params;
  let sql = 'DELETE FROM product_img WHERE img_url=?';
  let value = [img_url];

  //删除服务器图片文件
  const key = img_url.substr(img_url.lastIndexOf('/') + 1);
  func.removeFromQiniu(key);

  return query(sql, value);
};
// 修改商品信息
let updateProduct = function(params) {
  let { title, location, price, description, status, contact, cate_id, id, original, team } = params;
  let sql =
      'UPDATE product SET title=?,status=?,location=?,price=?,description=?,contact=?,cate_id=?,original=?, team=? WHERE id=?',
    value = [title, status, location, price, description, contact, cate_id, original, team, id];
  return query(sql, value);
};
// 修改商品状态
let updateProductStatus = function(params) {
  let { status, id } = params;
  let sql = 'UPDATE product SET status=? WHERE id=?',
    value = [status, id];
  return query(sql, value);
};
// 修改图片地址
let updateProductImg = function(params) {
  let { img_url, pro_id } = params;
  let sql = 'UPDATE product_img SET img_url=? WHERE pro_id=?',
    value = [img_url, pro_id];
  return query(sql, value);
};

// 修改商品信息状态(0 发布 1 已卖出 2 关闭)
let updateProductSataus = function(params) {
  let { status, id } = params;
  let sql = 'UPDATE product SET status=? WHERE id=?',
    value = [status, id];
  return query(sql, value);
};
// 删除商品信息
let deleteProductById = function(params) {
  let { id } = params;
  let sql = 'DELETE p,p_img FROM product p LEFT JOIN product_img p_img  ON p.id = p_img.pro_id WHERE id = ?';
  let value = [id];
  return query(sql, value);
};

let getCateListBack = function() {
  let sql =
    'SELECT count(1) count ,p.cate_id, c.name from product p LEFT JOIN category c on p.cate_id = c.id GROUP BY p.cate_id ORDER BY count(*) DESC';
  return query(sql);
};

let getConfig = function() {
  let sql = 'SELECT * from sys_conf';
  return query(sql);
};
module.exports = {
  getConfig,
  getCateListBack,
  findProduct,
  backEndfindProduct,
  findAllType,
  findProductCount,
  findProductByUser,
  findProductById,
  insertProduct,
  updateProduct,
  updateProductSataus,
  insertProductImg,
  deleteProductImg,
  updateProductImg,
  deleteProductById,
  updateProductStatus,
};
