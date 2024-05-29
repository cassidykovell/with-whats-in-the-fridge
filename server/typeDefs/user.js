const { gql } = require('apollo-server-express');

const userTypeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    recipes: [Recipe]
  }

  extend type Query {
    getUser(userId: ID!): User
    getUserRecipes(userId: ID!): [Recipe]
  }

  extend type Mutation {
    register(username: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String
  }
`;

module.exports = userTypeDefs;
