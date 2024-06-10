const profileTypeDefs = `
  type UserProfile {
    user: User
    createdRecipes: [Recipe]
    savedRecipes: [Recipe]
  }

  extend type Query {
    getUserProfile: UserProfile
  }
`;

module.exports = profileTypeDefs;
