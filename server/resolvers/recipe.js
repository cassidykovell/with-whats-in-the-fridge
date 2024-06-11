const { Recipe, User } = require("../models");

const recipeResolvers = {
  Mutation: {
    createRecipe: async (_, { userId, title, description, ingredients, instructions }) => {
      // Create the new recipe
      const recipe = new Recipe({
        title,
        description,
        ingredients,
        instructions,
        author: userId,
      });

      await recipe.save();
      
      // Find the user by ID
      const user = await User.findById(userId);
      if (user) {
        // If user exists, push the recipe ID to savedRecipes and save the user
        user.savedRecipes.push(recipe._id);
        await user.save();
      } else {
        // If user does not exist, log a warning (or handle it as needed)
        console.warn(`User with ID ${userId} not found`);
      }

      // Return the recipe with populated author field
      return {
        ...recipe.toObject(),
        author: user,
      };
    },
    updateRecipe: async (_, { recipeId, title, description, ingredients, instructions }) => {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      if (title !== undefined) recipe.title = title;
      if (description !== undefined) recipe.description = description;
      if (ingredients !== undefined) recipe.ingredients = ingredients;
      if (instructions !== undefined) recipe.instructions = instructions;

      await recipe.save();

      return recipe;
    },
    deleteRecipe: async (_, { recipeId }) => {
      const recipe = await Recipe.findById(recipeId);
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      await recipe.remove();

      const user = await User.findById(recipe.author);
      if (user) {
        user.savedRecipes = user.savedRecipes.filter(
          (recId) => recId.toString() !== recipeId
        );
        await user.save();
      }
      return true;
    },
  },
  Recipe: {
    author: async (parent) => {
      return await User.findById(parent.author);
    },
  },
};

module.exports = recipeResolvers;
