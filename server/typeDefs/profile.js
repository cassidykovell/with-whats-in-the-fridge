const { gql } = require('apollo-server-express');

const profileTypeDefs = gql`
  type UserProfile {
    user: User
    createdRecipes: [Recipe]
    savedRecipes: [Recipe]
  }

  extend type Query {
    getUserProfile(userId: ID!): UserProfile
  }
`;

module.exports = profileTypeDefs;
