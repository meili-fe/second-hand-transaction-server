const { gql } = require('apollo-server-koa');

const typeDef = gql`
  type Product {
    id: ID
    cate_id: Int
    owner_id: Int
    """
    描述
    """
    title: String
    """
    地理位置
    """
    location: String
    """
    价格
    """
    price: Int
    """
    描述
    """
    description: String
    """
    联系方式
    """
    contact: String
    """
    状态
    """
    status: String
    """图片地址"""
    """
    创建时间
    """
    create_time: String
    """
    更新时间
    """
    update_time: String
  }

  type Query {
    product: [Product]
  }
`;

const data = [
  {
    id: 1,
    cate_id: 1,
    owner_id: 1,
    title: '测试内容',
    location: '绿地6层',
    price: 2312.3,
    description: '我是描述我是描述我是描述我是描述我是描述',
  },
];

const resolvers = {
  Query: {
    product: (root, args, { models }) => {
      return data;
    },
  },
};

module.exports = {
  product: typeDef,
  productResolvers: resolvers,
};
