const { gql } = require('apollo-server-express');

const recipeTypeDefs = gql`
  type Recipe {
    id: ID!
    title: String!
    ingredients: [String!]!
    instructions: String!
    image: String
    createdBy: User
  }

  extend type Query {
    getRecipe(recipeId: ID!): Recipe
  }

  extend type Mutation {
    createRecipe(userId: ID!, title: String!, ingredients: [String!]!, instructions: String!, image: String): Recipe
  }
`;

module.exports = recipeTypeDefs;
