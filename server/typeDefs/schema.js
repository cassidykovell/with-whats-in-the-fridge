const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    recipes: [Recipe]
  }

  type Recipe {
    id: ID!
    title: String!
    ingredients: [String!]!
    instructions: String!
    image: String
    createdBy: User
  }

  type Ingredient {
    id: ID!
    name: String!
    image: String
  }

  type Query {
    getUserRecipes(userId: ID!): [Recipe]
    getIngredients(query: String!): [Ingredient]
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
    createRecipe(userId: ID!, title: String!, ingredients: [String!]!, instructions: String!, image: String): Recipe
  }
`;

module.exports = typeDefs;