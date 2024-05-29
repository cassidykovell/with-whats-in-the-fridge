import React, { useState } from "react";

const MyProfile = () => {
  const [activeSection, setActiveSection] = useState("saved");

  const renderSection = () => {
    if (activeSection === "saved") {
      return <div className="profile-section">Saved Recipes Section</div>;
    } else if (activeSection === "created") {
      return <div className="profile-section">Created Recipes Section</div>;
    }
  };

  return (
    <div>
      <div className="profile-header">
        <h1 className="title">My Profile</h1>
        <button className="create-recipe-button">Create Recipe</button>
      </div>
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeSection === "saved" ? "active" : ""}`}
          onClick={() => setActiveSection("saved")}
        >
          Saved Recipes
        </button>
        <button
          className={`tab-button ${
            activeSection === "created" ? "active" : ""
          }`}
          onClick={() => setActiveSection("created")}
        >
          Created Recipes
        </button>
      </div>
      <div className="profile-container">
        <div className="profile-content">{renderSection()}</div>
      </div>
    </div>
  );
};

export default MyProfile;
