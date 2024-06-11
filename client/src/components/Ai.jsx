import React, { useState } from 'react';

const Ai = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [recipe, setRecipe] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddIngredient = () => {
    if (inputValue.trim() !== '') {
      setIngredients([...ingredients, inputValue]);
      setInputValue('');
    }
  };

  const handleDeleteIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  const handleGenerateRecipe = async () => {
    try {
      const seedText = ingredients.join(', ');
      const response = await fetch('http://localhost:5000/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seed_text: seedText }),
      });
      const data = await response.json();
      if (response.ok) {
        setRecipe(data.recipe);
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="ai-container">
      <h1 id="center-updated">What's in the fridge?</h1>
      <input
        id="ingred-updated"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        placeholder="Enter an ingredient"
      />
      <div id="btn-updated">
        <button onClick={handleAddIngredient} id="add-updated">Add</button>
        <button onClick={handleGenerateRecipe} id="generate-updated">Generate Recipe</button>
      </div>
      <div className="ingredients-list">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-item">
            <span>{ingredient}</span>
            <button onClick={() => handleDeleteIngredient(index)}>X</button>
          </div>
        ))}
      </div>
      {recipe && (
        <div className="generated-recipe">
          <h2>Generated Recipe Instructions:</h2>
          <p>{recipe}</p>
        </div>
      )}
    </div>
  );
};

export default Ai;
