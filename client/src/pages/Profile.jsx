import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

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
	mutation CreateRecipe($userId: ID!, $title: String!, $description: String!, $ingredients: [String!]!, $instructions: String!) {
		createRecipe(userId: $userId, title: $title, description: $description, ingredients: $ingredients, instructions: $instructions) {
			id
			title
			description
			ingredients
			instructions
			createdBy {
				id
				username
			}
			image
		}
	}
`;

const UPDATE_RECIPE = gql`
	mutation UpdateRecipe($recipeId: ID!, $title: String, $description: String, $ingredients: [String!], $instructions: String) {
		updateRecipe(recipeId: $recipeId, title: $title, description: $description, ingredients: $ingredients, instructions: $instructions) {
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
	const [createRecipe] = useMutation(CREATE_RECIPE, {
		refetchQueries: [{ query: GET_USER_PROFILE }],
	});
	const [updateRecipe] = useMutation(UPDATE_RECIPE, {
		refetchQueries: [{ query: GET_USER_PROFILE }],
	});
	const [deleteRecipe] = useMutation(DELETE_RECIPE, {
		refetchQueries: [{ query: GET_USER_PROFILE }],
	});

	const [profile, setProfile] = useState(null);
	const [activeSection, setActiveSection] = useState('saved');
	const [isFormOpen, setIsFormOpen] = useState(false);
	const [formType, setFormType] = useState('create');
	const [formValues, setFormValues] = useState({
		title: '',
		description: '',
		ingredients: [''],
		instructions: '',
		id: null
	});

	useEffect(() => {
		if (data) {
			console.log('Profile data fetched:', data);
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
			ingredients: [...prev.ingredients, '']
		}));
	};

	const handleRemoveIngredient = (index) => {
		const newIngredients = formValues.ingredients.filter((_, i) => i !== index);
		setFormValues((prev) => ({ ...prev, ingredients: newIngredients }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log('Form submitted');
		const { id, ...recipeInput } = formValues;

		try {
			if (formType === 'create') {
				console.log('Creating recipe with values:', recipeInput);
				const { data } = await createRecipe({
					variables: {
						userId: profile.user.id,
						title: formValues.title,
						description: formValues.description,
						ingredients: formValues.ingredients,
						instructions: formValues.instructions,
					},
				});
				console.log('Recipe created:', data);
			} else if (formType === 'update') {
				console.log('Updating recipe with ID:', id);
				const { data } = await updateRecipe({
					variables: {
						recipeId: formValues.id,
						title: formValues.title,
						description: formValues.description,
						ingredients: formValues.ingredients,
						instructions: formValues.instructions,
					},
				});
				console.log('Recipe updated:', data);
			}
			setIsFormOpen(false);
			setFormValues({
				title: '',
				description: '',
				ingredients: [''],
				instructions: '',
				id: null
			});
		} catch (error) {
			console.error('Error submitting form:', error);
		}
	};

	const handleOpenCreateForm = () => {
		console.log('Opening create form');
		setFormType('create');
		setFormValues({
			title: '',
			description: '',
			ingredients: [''],
			instructions: '',
			id: null
		});
		setIsFormOpen(true);
	};

	const handleEdit = (recipe) => {
		console.log('Editing recipe with ID:', recipe.id);
		setFormType('update');
		setFormValues({
			id: recipe.id,
			title: recipe.title,
			description: recipe.description,
			ingredients: recipe.ingredients,
			instructions: recipe.instructions
		});
		setIsFormOpen(true);
	};

	const handleDelete = async (id) => {
		console.log('Deleting recipe with ID:', id);
		await deleteRecipe({ variables: { recipeId: id } });
	};

	const renderSection = () => {
		if (activeSection === 'saved' && profile) {
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
					<button onClick={() => handleEdit(recipe)}>Update</button>
					<button onClick={() => handleDelete(recipe.id)}>Delete</button>
				</div>
			));
		} else if (activeSection === 'created' && profile) {
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
					<button onClick={() => handleEdit(recipe)}>Update</button>
					<button onClick={() => handleDelete(recipe.id)}>Delete</button>
				</div>
			));
		}
	};

	if (loading) return <p>Loading...</p>;
	if (error) {
		console.error('Error loading profile:', error);
		return <p>Error loading profile</p>;
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
					className={`tab-button ${activeSection === 'saved' ? 'active' : ''}`}
					onClick={() => setActiveSection('saved')}
				>
					Saved Recipes
				</button>
				<button
					className={`tab-button ${activeSection === 'created' ? 'active' : ''}`}
					onClick={() => setActiveSection('created')}
				>
					Created Recipes
				</button>
			</div>
			<div className="profile-container">
				<div className="profile-content">{renderSection()}</div>
			</div>
			{isFormOpen && (
				<div className="form-popup">
					{console.log('Rendering form')}
					<form onSubmit={handleSubmit}>
						<h2>{formType === 'create' ? 'Create Recipe' : 'Update Recipe'}</h2>
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
						<button type="submit">Submit</button>
						<button type="button" onClick={() => setIsFormOpen(false)}>
							Cancel
						</button>
					</form>
					{console.log('Form rendered')}
				</div>
			)}
		</div>
	);
};

export default Profile;
