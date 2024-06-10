const db = require('../config/connection');
const { User, Recipe } = require('../models');
const userSeeds = require('./userSeeds.json');
const recipeSeeds = require('./recipeSeeds.json');
const cleanDB = require('./cleanDB');

function getRandomIdx(anArray, idxUsed) {
	let randomIdx = Math.floor(Math.random() * anArray.length);
	while (idxUsed.includes(randomIdx)) {
		randomIdx = Math.floor(Math.random() * anArray.length);
	}
	return randomIdx;
}

db.once('open', async () => {
	try {
		await cleanDB('User', 'users');
		await cleanDB('Recipe', 'recipes');

		const createdUsers = await User.create(userSeeds);
		const userMap = {};
		createdUsers.forEach((user) => {
			userMap[user.username] = user._id;
		});
		const updatedRecipeSeeds = recipeSeeds.map((recipe) => {
			return {
				...recipe,
				author: userMap[recipe.username],
			};
		});

		const createdRecipes = await Recipe.create(updatedRecipeSeeds);

		// for (let recipe of createdRecipes) {
		// 	await User.findByIdAndUpdate(recipe.author, {
		// 		$push: { recipes: recipe._id },
		// 	});
		// }
		for (let user of createdUsers) {
			let idxUsed = [];
			for (let i = 0; i < 3; i++) {
				await User.findByIdAndUpdate(user._id, {
					$push: {
						savedRecipes:
							createdRecipes[getRandomIdx(createdRecipes, idxUsed)]._id,
					},
				});
			}
		}

		console.log('all done!');
		process.exit(0);
	} catch (err) {
		throw err;
	}
});
