const { Recipe, User } = require("../models");

const recipeResolvers = {
  Query: {
    getRecipe: async (_, { recipeId }) => {
      return await Recipe.findById(recipeId);
    },
    getRecipesByIngredients: async (_, { ingredients }) => {
      const recipes = await Recipe.aggregate([
        {
          $addFields: {
            matchingIngredientsCount: {
              $size: {
                $filter: {
                  input: "$ingredients",
                  as: "ingredient",
                  cond: { $in: ["$$ingredient", ingredients] },
                },
              },
            },
          },
        },
        {
          $sort: {
            matchingIngredientsCount: -1,
            ingredientsCount: 1,
          },
        },
        {
          $addFields: {
            ingredientsCount: { $size: "$ingredients" },
          },
        },
        {
          $sort: {
            matchingIngredientsCount: -1,
            ingredientsCount: 1,
          },
        },
      ]);

      return recipes;
    },
  },
  Mutation: {
    createRecipe: async (
      _,
      { userId, title, description, ingredients, instructions }
    ) => {
      const recipe = new Recipe({
        title,
        description,
        ingredients,
        instructions,
        createdBy: userId,
      });

      await recipe.save();
      
    },
    updateRecipe: async (
      _,
      { recipeId, title, description, ingredients, instructions }
    ) => {
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

      const user = await User.findById(recipe.createdBy);
      if (user) {
        user.recipes = user.recipes.filter(
          (recId) => recId.toString() !== recipeId
        );
        await user.save();
      }

      return "Recipe deleted successfully";
    },
  },
  Recipe: {
    createdBy: async (parent) => {
      return await User.findById(parent.createdBy);
    },
  },
};

module.exports = recipeResolvers;
