import React, { useState } from 'react';

const Fridge = () => {
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');

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

      <div className="recipes-section">
        {/* Display recipes based on ingredients */}
      </div>
    </div>
  );
};

export default Fridge;
