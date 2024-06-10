const { Recipe } = require('../models');

const feedResolvers = {
	Query: {
		getAllUserCreatedRecipes: async () => {
			try {
				const recipes = await Recipe.find({}).populate('author');
				return recipes;
			} catch (error) {
				console.error('Error fetching all user-created recipes:', error);
				throw new Error('Failed to fetch all user-created recipes');
			}
		},
	},
};

module.exports = feedResolvers;
