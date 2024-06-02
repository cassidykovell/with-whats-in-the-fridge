import React, { useEffect, useState } from 'react';
import { useQuery, gql } from '@apollo/client';

const GET_ALL_USER_CREATED_RECIPES = gql`
  query getAllUserCreatedRecipes {
    getAllUserCreatedRecipes {
      id
      title
      ingredients
      instructions
      image
    }
  }
`;

const Feed = () => {
  const { loading, error, data } = useQuery(GET_ALL_USER_CREATED_RECIPES);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    if (data) {
      setRecipes(data.getAllUserCreatedRecipes);
    }
  }, [data]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading feed</p>;

  return (
    <div className="feed-container">
      {recipes.map(recipe => (
        <div key={recipe.id} className="recipe-card">
          <h2>{recipe.title}</h2>
          <img src={recipe.image} alt={recipe.title} />
          <p>{recipe.instructions}</p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Feed;

