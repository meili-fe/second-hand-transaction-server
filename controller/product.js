const { query } = require('../db');

// 查询所有产品
let findProduct = function(params) {
  let { title, cate_id, pageSize = 10, page = 1 } = params;
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
    WHERE p.status in (1,2)
    `;

  if (title) {
    offset = 0;
    sql += `and  p.title like ? `;
    value.push('%' + title + '%');
  }
  if (cate_id) {
    sql += ` and  p.cate_id = ? `;
    value.push(cate_id);
  }

  sql += ` GROUP BY p.id ORDER BY FIELD(p.status,1,2), p.create_time DESC  limit ${offset},${pageSize}  `;

  //   console.log(sql);
  //   let value = ["%" + title + "%", cate_id];
  return query(sql, value);
};
// 后台审核查看列表
let backEndfindProduct = function(params) {
  let { title, status, pageSize = 10, page = 1 } = params;
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
    sql += `and  p.title like ? `;
    value.push('%' + title + '%');
  }
  if (status) {
    sql += `and  p.status = ? `;
    value.push(parseInt(status));
  }

  sql += ` GROUP BY p.id ORDER BY FIELD(p.status,0,1,99,2,3), p.create_time DESC  limit ${offset},${pageSize}  `;

  return query(sql, value);
};
// 查询当前用户发布产品
let findProductByUser = function(params) {
  let { userId } = params;
  console.log(params);
  let sql = `SELECT 
    p.id,p.title,p.location,p.price,p.contact,p.description,p.status,p.create_time,p.update_time,
    c.name category_name,
    GROUP_CONCAT( p_img.img_url ) AS img_list     
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id WHERE owner_id = ?
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC`;
  let value = [userId];
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
    p.id,p.owner_id,p.title,p.location,p.price,p.contact,p.description,p.status,p.create_time,p.update_time,p.cate_id,
    c.name category_name,
    GROUP_CONCAT( p_img.img_url ) AS img_list     
    FROM product p
    LEFT JOIN product_img p_img ON p.id = p_img.pro_id 
    LEFT JOIN category c ON p.cate_id = c.id WHERE p.id = ?
    `;
  sql += ` GROUP BY p.id ORDER BY p.create_time DESC`;
  let value = [id];
  return query(sql, value);
};

// 查询产品总数
let findProductCount = function(params) {
  let { id } = params;
  let sql = `SELECT count(*) FROM product `;
  if (id) {
    sql += ` WHERE id = ?  `;
    let value = [id];
    return query(sql, value);
  } else {
    return query(sql);
  }
};
// 添加商品
let insertProduct = function(params) {
  let { cate_id, title, location, price, description, contact, userId } = params;
  console.log('-----');
  console.log(params);
  let sql =
    'INSERT INTO product (cate_id,owner_id,title,location,price,description,contact,status,create_time) VALUES (?,?,?,?,?,?,?,?,?)';
  let value = [cate_id, userId, title, location, price, description, contact, 0, new Date()];
  return query(sql, value);
};

// 添加图片
let insertProductImg = function(params) {
  let { pro_id, img_url } = params;
  let sql = 'INSERT INTO product_img (pro_id,img_url) VALUES (?,?)';
  let value = [pro_id, img_url];
  return query(sql, value);
};
// 删除图片
let deleteProductImg = function(params) {
  let { img_url } = params;
  let sql = 'DELETE FROM product_img WHERE img_url=?';
  let value = [img_url];
  return query(sql, value);
};
// 修改商品信息
let updateProduct = function(params) {
  let { title, location, price, description, contact, cate_id, id } = params;
  let sql = 'UPDATE product SET title=?,location=?,price=?,description=?,contact=?,cate_id=? WHERE id=?',
    value = [title, location, price, description, contact, cate_id, id];
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

module.exports = {
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
