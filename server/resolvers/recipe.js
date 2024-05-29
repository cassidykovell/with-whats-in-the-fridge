const Recipe = require('../models/Recipe');
const User = require('../models/User');

const recipeResolvers = {
  Query: {
    getRecipe: async (_, { recipeId }) => {
      return await Recipe.findById(recipeId);
    },
  },
  Mutation: {
    createRecipe: async (_, { userId, title, ingredients, instructions, image }) => {
      const recipe = new Recipe({
        title,
        ingredients,
        instructions,
        image,
        createdBy: userId,
      });

      await recipe.save();

      try {
        const response = await fetch(`https://api.spoonacular.com/recipes/complexSearch?query=${title}&apiKey=${process.env.API_KEY}`);
        if (!response.ok) {
          throw new Error('Failed to fetch recipe from Spoonacular API');
        }
        const data = await response.json();
        if (data.results && data.results.length > 0) {
          const apiRecipe = data.results[0];
          recipe.title = apiRecipe.title;
          recipe.ingredients = apiRecipe.extendedIngredients.map(ing => ing.originalString);
          recipe.instructions = apiRecipe.instructions;
          recipe.image = apiRecipe.image;
          await recipe.save();
        }
      } catch (error) {
        console.error('Error fetching recipe from Spoonacular API:', error);
      }

      return recipe;
    },
  },
  Recipe: {
    createdBy: async (parent) => {
      return await User.findById(parent.createdBy);
    },
  },
};

module.exports = recipeResolvers;
