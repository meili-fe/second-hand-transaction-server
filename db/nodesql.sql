/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50722
 Source Host           : localhost
 Source Database       : nodesql

 Target Server Type    : MySQL
 Target Server Version : 50722
 File Encoding         : utf-8

 Date: 01/18/2019 15:59:31 PM
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `upload`
-- ----------------------------
DROP TABLE IF EXISTS `upload`;
CREATE TABLE `upload` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_id` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '用户ID',
  `file_name` char(100) NOT NULL DEFAULT '' COMMENT '文件名称',
  `file_path` char(200) NOT NULL DEFAULT '' COMMENT '文件路径',
  `mime_type` char(50) NOT NULL DEFAULT '' COMMENT '文件类型',
  `file_size` int(10) unsigned NOT NULL DEFAULT '0' COMMENT '文件大小KB',
  `is_delete` tinyint(1) NOT NULL DEFAULT '0' COMMENT '是否删除',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '上传时间',
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COMMENT='上传列表';

-- ----------------------------
--  Records of `upload`
-- ----------------------------
BEGIN;
INSERT INTO `upload` VALUES ('6', '23', 'nav5', 'http://172.28.84.113:3333/upload/1546853187335.png', '', '0', '0', '2019-01-07 15:48:38'), ('7', '24', 'nav1', 'http://172.28.84.113:3333/upload/1546853180615.png', '', '0', '0', '2019-01-07 17:00:04'), ('8', '26', '图片1', 'http://172.28.84.113:3333/upload/1546914158200.png', '', '0', '0', '2019-01-08 10:22:38'), ('9', '28', 'd788d43f8794a4c2b5352e4103f41bd5ad6e3942', 'http://172.28.81.79:3000/upload/1547782211261.jpg', '', '0', '0', '2019-01-18 11:29:49'), ('10', '31', 'WX20181127-182537', 'http://172.28.81.79:3000/upload/1547782219595.png', '', '0', '0', '2019-01-18 11:30:19'), ('11', '42', 'd788d43f8794a4c2b5352e4103f41bd5ad6e3942', 'http://172.28.81.79:3000/upload/1547783227802.jpg', '', '0', '0', '2019-01-18 11:47:07'), ('12', '43', 'WX20181127-182537', 'http://172.28.81.79:3000/upload/1547783259172.png', '', '0', '0', '2019-01-18 11:47:39'), ('13', '44', 'd788d43f8794a4c2b5352e4103f41bd5ad6e3942', 'http://172.28.81.79:3000/upload/1547796139128.jpg', '', '0', '0', '2019-01-18 15:22:19');
COMMIT;

-- ----------------------------
--  Table structure for `user`
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
  `user_name` char(50) NOT NULL DEFAULT '' COMMENT '用户帐号',
  `pass_word` char(128) NOT NULL DEFAULT '' COMMENT '用户密码',
  `user_type` tinyint(1) unsigned NOT NULL DEFAULT '0' COMMENT '用户类型 0:未审核用户;1:超级管理员;2:普通管理员;3:VIP用户;4:普通用户',
  `user_email` char(128) NOT NULL DEFAULT '' COMMENT '邮箱地址',
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
  `login_ip` char(15) NOT NULL DEFAULT '' COMMENT '登录IP',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后登录时间',
  `user_pic` varchar(255) CHARACTER SET utf8 COLLATE utf8_unicode_ci NOT NULL DEFAULT '' COMMENT '用户头像',
  `user_extend` text CHARACTER SET utf8 COLLATE utf8_unicode_ci COMMENT '扩展信息',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 COMMENT='用户据库表';

-- ----------------------------
--  Records of `user`
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES ('28', '123123123123', '', '1', '123123123123', '2019-01-04 15:55:08', '', '2019-01-04 15:55:08', '', null), ('31', '44', '', '1', '44', '2019-01-04 16:59:20', '', '2019-01-04 16:59:20', '', null), ('34', '77', '', '1', '77', '2019-01-04 16:59:30', '', '2019-01-04 16:59:30', '', null), ('35', '88', '', '1', '88', '2019-01-04 16:59:33', '', '2019-01-04 16:59:33', '', null), ('36', '99', '', '1', '99', '2019-01-04 16:59:35', '', '2019-01-04 16:59:35', '', null), ('37', '10', '', '1', '10', '2019-01-04 16:59:40', '', '2019-01-04 16:59:40', '', null), ('38', '34343', '', '1', '343434', '2019-01-18 11:30:32', '', '2019-01-18 11:30:32', '', null), ('39', '1111', '', '1', '11111', '2019-01-18 11:30:35', '', '2019-01-18 11:30:35', '', null), ('40', '2322323332', '', '1', '131312313123', '2019-01-18 11:30:38', '', '2019-01-18 11:30:38', '', null), ('41', 'admin', '', '1', 'admin2', '2019-01-18 11:30:45', '', '2019-01-18 11:30:45', '', null), ('42', 'admin222', '', '1', 'adminsss', '2019-01-18 11:30:53', '', '2019-01-18 11:30:53', '', null), ('43', 'admins', '', '1', 'password', '2019-01-18 11:47:27', '', '2019-01-18 11:47:27', '', null), ('44', 'asdad', '', '1', 'asdasd', '2019-01-18 14:46:11', '', '2019-01-18 14:46:11', '', null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
