const { gql } = require('apollo-server-express');
const userTypeDefs = require('./user');
const recipeTypeDefs = require('./recipe');
const ingredientsTypeDefs = require('./ingredients');

const baseTypeDefs = gql`
  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

const typeDefs = [baseTypeDefs, userTypeDefs, recipeTypeDefs, ingredientsTypeDefs];

module.exports = typeDefs;
