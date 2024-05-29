import React, { useState } from 'react';

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState('saved');

  const renderSection = () => {
    if (activeSection === 'saved') {
      return <div className="profile-section">Saved Recipes Section</div>;
    } else if (activeSection === 'created') {
      return <div className="profile-section">Created Recipes Section</div>;
    }
  };

  return (
    <div className="profile-container">
      <div className="overlay">
        <h1 className="title">My Profile</h1>
        <div className="profile-buttons">
          <button onClick={() => setActiveSection('saved')}>Saved Recipes</button>
          <button onClick={() => setActiveSection('created')}>Created Recipes</button>
        </div>
        <div className="create-recipe-button">
          <button>Create Recipe</button>
        </div>
        {renderSection()}
      </div>
    </div>
  );
};

export default MyProfile;
