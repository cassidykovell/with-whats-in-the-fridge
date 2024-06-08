const Recipe = require('../models/Recipe');
const User = require('../models/User');

const profileResolvers = {
  Query: {
    getUserProfile: async (_, __, { user }) => { // Destructure 'user' from context
      if (!user) {
        throw new Error('You must be logged in to view this data');
      }
      try {
        const currentUser = await User.findById(user.id).populate('savedRecipes');
        const createdRecipes = await Recipe.find({ createdBy: user.id });

        return {
          user: currentUser,
          createdRecipes,
          savedRecipes: currentUser.savedRecipes
        };
      } catch (error) {
        console.error('Error fetching user profile:', error);
        throw new Error('Failed to fetch user profile');
      }
    },
  },
};

module.exports = profileResolvers;
