
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `open_id` varchar(20) DEFAULT NULL COMMENT '微信openid',
  `name` varchar(200) DEFAULT NULL COMMENT '姓名',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `open_id` (`open_id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='员工表';

CREATE TABLE `category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT '' COMMENT '类别名称',
  `status` TINYINT(5) DEFAULT 0 COMMENT '状态(0 正常 1 删除)',
  `description` varchar(500) DEFAULT NULL COMMENT '描述',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='类别表';

CREATE TABLE `product` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `cate_id` int(11) DEFAULT NULL COMMENT '类别id',
  `owner_id` int(11) NOT NULL COMMENT '所属员工',
  `title` varchar(20) DEFAULT NULL COMMENT '产品名称',
  `location` varchar(40) DEFAULT NULL COMMENT '位置',
  `price` DECIMAL(10,2) DEFAULT NULL COMMENT '金额',
  `description` varchar(400) DEFAULT NULL COMMENT '描述',
  `contact` varchar(40) DEFAULT NULL COMMENT '联系方式',
  `status` tinyint(5) DEFAULT '0' COMMENT '状态(0 发布 1 已卖出 2 关闭)',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='商品表';

  CREATE TABLE `product_img` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pro_id` int(11) DEFAULT NULL COMMENT '商品id',
  `img_url` VARCHAR(200) DEFAULT NULL COMMENT '图片地址',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='图片表';

CREATE TABLE `relation` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `user_id` int(11) DEFAULT NULL COMMENT '操作用户id',
  `pro_id` int(11) NOT NULL COMMENT '产品id',
  `type` tinyint(5) DEFAULT NULL COMMENT '操作类型（0 点赞 1 收藏）',
  `status` tinyint(5) DEFAULT '0' COMMENT '状态(0 正常 1 关闭)',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `pro_user_type` (`pro_id`,`user_id`,`type`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='用户产品关系表';


CREATE TABLE `message_board` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT 'id',
  `parent_id` int(11) DEFAULT NULL COMMENT '父id',
  `pro_id` int(11) NOT NULL COMMENT '产品id',
  `user_id` int(11) NOT NULL COMMENT '留言人id',
  `replay_id` int(11) DEFAULT NULL COMMENT '被回复人id',
  `message` TEXT DEFAULT NULL COMMENT '留言',
  `status` tinyint(5) DEFAULT '0' COMMENT '状态(0 正常 1 删除)',
  `create_time` datetime DEFAULT NULL COMMENT '创建时间',
  `update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COMMENT='留言表';
