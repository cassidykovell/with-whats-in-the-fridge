import React, { useState, useEffect } from 'react';

const Fridge = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [recipeDetails, setRecipeDetails] = useState(null);

  const API_KEY = 'edb873e4c511412ab341a50963c0f518'; // Hardcoded API key

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddIngredient = () => {
    if (inputValue.trim() !== '') {
      setIngredients([...ingredients, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(updatedIngredients);
  };

  const handleSearchRecipes = async () => {
    if (ingredients.length === 0) {
      setError('Please add at least one ingredient.');
      return;
    }

    setLoading(true);
    setError(null);
    setRecipes([]);
    setRecipeDetails(null);
    setSelectedRecipeId(null);

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/findByIngredients?ingredients=${ingredients.join(',')}&apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch recipes. Please try again later.');
      }
      const data = await response.json();
      console.log('Recipes fetched:', data); // Log fetched recipes
      setRecipes(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRecipe = async (recipeId) => {
    setSelectedRecipeId(recipeId);
    setLoading(true);
    setError(null);
    setRecipeDetails(null);

    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch recipe details. Please try again later.');
      }
      const data = await response.json();
      console.log('Recipe details fetched:', data); // Log fetched recipe details
      setRecipeDetails(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fridge-container">
      <h1 id="center">What's in the fridge?</h1>
      <input
        id="ingred"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter an ingredient"
      />
      <div id="btn">
        <button onClick={handleAddIngredient} id="add">Add</button>
      </div>
      <div className="ingredients-list">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <span>{ingredient}</span>
            <button onClick={() => handleDeleteIngredient(index)}>X</button>
          </div>
        ))}
      </div>
      <button onClick={handleSearchRecipes}>Search Recipes</button>

      <div className="results-section" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div className="recipes-section">
          {loading && !recipeDetails && <p>Loading...</p>}
          {error && <p>Error: {error}</p>}
          {recipes.length > 0 && (
            <div>
              {recipes.map((recipe) => (
                <div 
                  key={recipe.id} 
                  className="recipe-item"
                  onClick={() => handleSelectRecipe(recipe.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <h3>{recipe.title}</h3>
                  <img src={recipe.image} alt={recipe.title} />
                  <p>Used Ingredients: {recipe.usedIngredientCount}</p>
                  <p>Missing Ingredients: {recipe.missedIngredientCount}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="recipe-details-section" style={{ marginLeft: '20px', flex: 1 }}>
          {loading && recipeDetails && <p>Loading details...</p>}
          {selectedRecipeId && recipeDetails && (
            <div className="recipe-details">
              <h2>{recipeDetails.title}</h2>
              <img src={recipeDetails.image} alt={recipeDetails.title} />
              <h3>Ingredients:</h3>
              <ul>
                {recipeDetails.extendedIngredients.map((ingredient) => (
                  <li key={ingredient.id}>{ingredient.original}</li>
                ))}
              </ul>
              <h3>Instructions:</h3>
              <ul>
                {recipeDetails.analyzedInstructions.length > 0 ? (
                  recipeDetails.analyzedInstructions[0].steps.map((step) => (
                    <li key={step.number}>{step.step}</li>
                  ))
                ) : (
                  <p>No instructions available.</p>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Fridge;
