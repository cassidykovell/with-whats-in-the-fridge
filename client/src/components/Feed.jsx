import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

const GET_RECIPES = gql`
  query GetRecipes {
    getAllUserCreatedRecipes {
      id
      title
      description
      ingredients
      instructions
      author {
        username
      }
    }
  }
`;

const SAVE_RECIPE = gql`
  mutation SaveRecipe($userId: ID!, $recipeId: ID!) {
    saveRecipe(userId: $userId, recipeId: $recipeId) {
      id
    }
  }
`;

const Feed = ({ userId }) => {
  const { loading, error, data } = useQuery(GET_RECIPES);
  const [saveRecipe] = useMutation(SAVE_RECIPE);
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const handleSaveRecipe = async (recipeId) => {
    try {
      await saveRecipe({ variables: { userId, recipeId } });
      alert('Recipe saved successfully!');
    } catch (e) {
      console.error('Error saving recipe:', e);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error('Error fetching recipes:', error);
    return <p>Error: {error.message}</p>;
  }

  if (!data || !data.getAllUserCreatedRecipes) {
    console.error('No recipes found:', data);
    return <p>No recipes found.</p>;
  }

  return (
    <div className="feed-container">
      {data.getAllUserCreatedRecipes.map((recipe) => (
        <div
          key={recipe.id}
          className="recipe-card"
          style={{
            border: '1px solid #ccc',
            margin: '10px',
            padding: '10px',
            cursor: 'pointer',
          }}
          onClick={() =>
            setExpandedRecipeId(
              expandedRecipeId === recipe.id ? null : recipe.id
            )
          }
        >
          <h3>{recipe.title}</h3>
          <p>{recipe.description}</p>
          {recipe.author?.username ? (
            <p>
              <strong>Author: </strong>
              {recipe.author.username}
            </p>
          ) : (
            <p>
              <strong>Author: </strong>Unknown
            </p>
          )}
          {expandedRecipeId === recipe.id && (
            <>
              <p>
                <strong>Instructions:</strong> {recipe.instructions}
              </p>
              <ul>
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
            </>
          )}
          <button onClick={() => handleSaveRecipe(recipe.id)}>Save</button>
        </div>
      ))}
    </div>
  );
};

export default Feed;
