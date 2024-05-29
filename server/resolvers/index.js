const userResolvers = require('./user');
const recipeResolvers = require('./recipe');
const ingredientsResolvers = require('./ingredients');

const resolvers = {
  Query: {
    ...userResolvers.Query,
    ...recipeResolvers.Query,
    ...ingredientsResolvers.Query,
  },
  Mutation: {
    ...userResolvers.Mutation,
    ...recipeResolvers.Mutation,
  },
  User: {
    ...userResolvers.User,
  },
  Recipe: {
    ...recipeResolvers.Recipe,
  }
};

module.exports = resolvers;
