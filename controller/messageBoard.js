const { query } = require('../db');
const table = 'message_board';

let addMessage = function(params) {
  let { parentId, proId, replayId, userId, message } = params;

  let sql = `INSERT INTO ${table} (parent_id, pro_id, replay_id, user_id, message ,create_time) VALUES (?,?,?,?,?,now())`;
  let value = [parentId, proId, replayId, userId, message];
  return query(sql, value);
};

let getAllByPro = function(params) {
  let { proId } = params;

  let sql = `SELECT  mb.id id, mb.user_id userId,mb.parent_id parentId, mb.message ,u.name userName,u.img_url imgUrl,ru.name replayName,mb.create_time createTime
  FROM ${table} mb 
  LEFT JOIN user u ON mb.user_id = u.id
  LEFT JOIN user ru ON mb.replay_id = ru.id 
  WHERE mb.pro_id = ${proId}
  ORDER BY mb.create_time desc
  `;

  return query(sql, []);
};
module.exports = {
  addMessage,
  getAllByPro,
};
