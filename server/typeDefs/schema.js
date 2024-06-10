const typeDefs = `
  type User {
    id: ID!
    username: String!
    email: String!
    password: String
    savedRecipes: [Recipe]
  }

  type Recipe {
    id: ID!
    title: String!
    description: String
    ingredients: [String]
    instructions: String
    createdAt: String
    author: User
  }

  type Auth {
    token: ID
    user: User
  }

  type UserProfile {
    user: User
    createdRecipes: [Recipe]
  }

  type Query {
    getAllUserCreatedRecipes: [Recipe]
    getUserProfile: UserProfile
  }

  type Mutation {
    register(username: String!, email: String!, password: String!): Auth
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
