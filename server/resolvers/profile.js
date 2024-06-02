const Recipe = require('../models/Recipe');
const User = require('../models/User');

const profileResolvers = {
  Query: {
    getUserProfile: async (_, { userId }) => {
      try {
        const user = await User.findById(userId).populate('savedRecipes');
        const createdRecipes = await Recipe.find({ createdBy: userId });

        return {
          user,
          createdRecipes,
          savedRecipes: user.savedRecipes
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }
    },
  },
};

module.exports = profileResolvers;
