const { gql } = require('apollo-server-express');

const recipeTypeDefs = gql`
type Recipe {
  id: ID!
  title: String!
  description: String!
  ingredients: [String!]!
  instructions: String!
  createdBy: User
  createdAt: String
}

type User {
  id: ID!
  username: String!
  email: String!
  recipes: [Recipe]
  savedRecipes: [Recipe]
}

extend type Query {
  getAllUserCreatedRecipes: [Recipe]
  getRecipe(recipeId: ID!): Recipe
  getUser(userId: ID!): User
  getUserRecipes(userId: ID!): [Recipe]
  getUserProfile(userId: ID!): UserProfile
}
  extend type Mutation {
    createRecipe(userId: ID!, title: String!, description: String!, ingredients: [String!]!, instructions: String!): Recipe
  }
`;

module.exports = recipeTypeDefs;
