const { ApolloServer } = require('apollo-server-koa');
const schema = require('./schema');

module.exports = new ApolloServer({
  schema,
  introspection: true,
  playground: {
    settings: {
      'editor.theme': 'light',
      'schema.disableComments': false,
    },
  },
});
