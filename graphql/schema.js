const { makeExecutableSchema } = require('graphql-tools');
const { merge } = require('lodash');

const { product, productResolvers } = require('./types/product');

module.exports = makeExecutableSchema({
  typeDefs: [product],
  resolvers: merge(productResolvers),
});
