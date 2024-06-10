import React, { useEffect, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USER_PROFILE = gql`
  query Query {
    getUserProfile {
      createdRecipes {
        title
        instructions
        ingredients
        description
        id
        createdAt
      }
      user {
        email
        username
        id
        savedRecipes {
          author {
            username
          }
          description
          id
          createdAt
          ingredients
          instructions
          title
        }
      }
    }
  }
`;

const CREATE_RECIPE = gql`
 mutation Mutation($userId: ID!, $title: String!, $description: String, $ingredients: [String], $instructions: String) {
  createRecipe(userId: $userId, title: $title, description: $description, ingredients: $ingredients, instructions: $instructions) {
    title
    description
    instructions
    ingredients
    author {
      username
    }
    createdAt
  }
}
`;

const UPDATE_RECIPE = gql`
  mutation UpdateRecipe(
    $recipeId: ID!
    $title: String
    $description: String
    $ingredients: [String!]
    $instructions: String
  ) {
    updateRecipe(
      recipeId: $recipeId
      title: $title
      description: $description
      ingredients: $ingredients
      instructions: $instructions
    ) {
      id
      title
      description
      ingredients
      instructions
    }
  }
`;

const DELETE_RECIPE = gql`
  mutation DeleteRecipe($recipeId: ID!) {
    deleteRecipe(recipeId: $recipeId)
  }
`;

const Profile = () => {
  const { loading, error, data } = useQuery(GET_USER_PROFILE);
  const [createRecipe] = useMutation(CREATE_RECIPE);
  const [updateRecipe] = useMutation(UPDATE_RECIPE);
  const [deleteRecipe] = useMutation(DELETE_RECIPE);

  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState("saved");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formType, setFormType] = useState("create");
  const [formValues, setFormValues] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    id: null,
  });

  useEffect(() => {
    if (data) {
      console.log("Profile data fetched:", data);
      setProfile(data.getUserProfile);
    }
  }, [data]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...formValues.ingredients];
    newIngredients[index] = value;
    setFormValues((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleAddIngredient = () => {
    setFormValues((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = formValues.ingredients.filter((_, i) => i !== index);
    setFormValues((prev) => ({ ...prev, ingredients: newIngredients }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { id, ...recipeInput } = formValues;

    console.log("Form values before submission:", recipeInput);
    console.log("Form type:", formType);

    try {
      if (formType === "create") {
        await createRecipe({
          variables: {
            userId: profile.user.id,
            title: recipeInput.title,
            description: recipeInput.description,
            ingredients: recipeInput.ingredients,
            instructions: recipeInput.instructions,
          },
        });
      } else if (formType === "update") {
        await updateRecipe({
          variables: {
            recipeId: id,
            title: recipeInput.title,
            description: recipeInput.description,
            ingredients: recipeInput.ingredients,
            instructions: recipeInput.instructions,
          },
        });
      }
      setIsFormOpen(false);
      setFormValues({
        title: "",
        description: "",
        ingredients: [""],
        instructions: "",
        id: null,
      });
    } catch (error) {
      console.error("Error during mutation:", error);
      if (error.networkError) {
        console.error("Network error details:", error.networkError);
      }
      if (error.graphQLErrors) {
        error.graphQLErrors.forEach(({ message, locations, path }) => {
          console.error(
            `GraphQL error details: Message: ${message}, Location: ${locations}, Path: ${path}`
          );
        });
      }
    }
  };

  const handleOpenCreateForm = () => {
    setFormType("create");
    setFormValues({
      title: "",
      description: "",
      ingredients: [""],
      instructions: "",
      id: null,
    });
    setIsFormOpen(true);
  };

  const handleEdit = (recipe) => {
    setFormType("update");
    setFormValues({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description,
      ingredients: recipe.ingredients,
      instructions: recipe.instructions,
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id) => {
    await deleteRecipe({ variables: { recipeId: id } });
  };

  const renderSection = () => {
    if (activeSection === "saved" && profile) {
      return profile.user.savedRecipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <h3>{recipe.title}</h3>
          {recipe?.image && <img src={recipe.image} alt={recipe.title} />}
          <p>{recipe.instructions}</p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <button onClick={() => handleEdit(recipe)} className="UD-btn">
            Update
          </button>
          <button onClick={() => handleDelete(recipe.id)} className="UD-btn">
            Delete
          </button>
        </div>
      ));
    } else if (activeSection === "created" && profile) {
      console.log("Rendering created recipes:", profile.createdRecipes);
      return profile.createdRecipes.map((recipe) => (
        <div key={recipe.id} className="recipe-card">
          <h3>{recipe.title}</h3>
          {recipe?.image && <img src={recipe.image} alt={recipe.title} />}
          <p>{recipe.instructions}</p>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
          <button onClick={() => handleEdit(recipe)} className="UD-btn">
            Update
          </button>
          <button onClick={() => handleDelete(recipe.id)} className="UD-btn">
            Delete
          </button>
        </div>
      ));
    }

    return null;
  };

  if (loading) return <p>Loading...</p>;
  if (error) {
    console.error("Error loading profile:", error);
    return <p>Error loading profile: Must be logged in</p>;
  }

  return (
    <div>
      <div className="profile-header">
        <h1 id="title">{profile?.user?.username}'s Profile</h1>
        <button className="create-recipe-button" onClick={handleOpenCreateForm}>
          Create Recipe
        </button>
      </div>
      <div className="profile-tabs">
        <button
          className={`tab-button ${activeSection === "saved" ? "active" : ""}`}
          onClick={() => setActiveSection("saved")}
        >
          Saved Recipes
        </button>
        <button
          className={`tab-button ${activeSection === "created" ? "active" : ""}`}
          onClick={() => setActiveSection("created")}
        >
          Created Recipes
        </button>
      </div>
      <div className="profile-container">
        <div className="profile-content">{renderSection()}</div>
      </div>
      {isFormOpen && (
        <>
          <div className="backdrop" onClick={() => setIsFormOpen(false)}></div>
          <div className="form-popup">
            <form onSubmit={handleSubmit}>
              <h2>{formType === "create" ? "Create Recipe" : "Update Recipe"}</h2>
              <label>
                Title:
                <input
                  type="text"
                  name="title"
                  value={formValues.title}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Description:
                <textarea
                  name="description"
                  value={formValues.description}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <label>
                Ingredients:
                {formValues.ingredients.map((ingredient, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={ingredient}
                      onChange={(e) => handleIngredientChange(index, e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => handleRemoveIngredient(index)}>
                      Remove
                    </button>
                  </div>
                ))}
                <button type="button" onClick={handleAddIngredient}>
                  Add Ingredient
                </button>
              </label>
              <label>
                Instructions:
                <textarea
                  name="instructions"
                  value={formValues.instructions}
                  onChange={handleInputChange}
                  required
                />
              </label>
              <button type="submit">
                {formType === "create" ? "Create" : "Update"}
              </button>
              <button type="button" onClick={() => setIsFormOpen(false)}>
                Cancel
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
