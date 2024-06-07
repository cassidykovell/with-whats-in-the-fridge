const Recipe = require('../models/Recipe');
const User = require('../models/User');

const profileResolvers = {
  Query: {
    getUserProfile: async (_, args, context) => {
      console.log("context", context.user)
      // try {
      //   const user = await User.findById(userId).populate('savedRecipes');
      //    console.log("user", user)
      //   const createdRecipes = await Recipe.find({ createdBy: userId });
      //  console.log("created", createdRecipes)

      //   return {
      //     user,
      //     createdRecipes,
      //     savedRecipes: user.savedRecipes
      //   };
      // } catch (error) {
      //   console.error('Error fetching user profile:', error);
      //   throw new Error('Failed to fetch user profile');
      // }
    },
  },
};

module.exports = profileResolvers;
