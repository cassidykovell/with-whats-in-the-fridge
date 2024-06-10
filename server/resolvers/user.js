const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Recipe, User } = require('../models');

const userResolvers = {
	Query: {
		getUserProfile: async (_, __, { user }) => {
			const userProfile = await User.findById(user._id).populate({
				path: 'savedRecipes',
				populate: { path: 'author', model: User },
			});
			const createdRecipes = await Recipe.find({ author: user._id });
			console.log('createdRecipes', createdRecipes);
			return { user: userProfile, createdRecipes };
		},
		// getUserRecipes: async (_, { userId }) => {
		// 	return await Recipe.find({ createdBy: userId });
		// },
	},
	Mutation: {
		register: async (_, { username, email, password }) => {
			try {
				console.log('Registering user:', { username, email, password });
				const hashedPassword = await bcrypt.hash(password, 10);
				const user = new User({ username, email, password: hashedPassword });
				await user.save();

				if (!process.env.JWT_SECRET) {
					throw new Error('JWT_SECRET environment variable is not defined');
				}

				const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.EXPIRATION,
				});
				console.log('User registered:', user);
				return { token, user };
			} catch (error) {
				if (error.code === 11000) {
					const field = Object.keys(error.keyValue)[0];
					const value = error.keyValue[field];
					console.error(`Duplicate key error: ${field}: ${value}`);
					throw new Error(`The ${field} ${value} is already in use.`);
				}
				console.error('Error registering user:', error);
				throw new Error('Error registering user');
			}
		},
		login: async (_, { email, password }) => {
			console.log('process.env.EXPIRATION in login', process.env.EXPIRATION);
			try {
				const user = await User.findOne({ email });
				if (!user) {
					console.error('User not found');
					throw new Error('User not found');
				}
				const isValid = await bcrypt.compare(password, user.password);
				if (!isValid) {
					console.error('Invalid password');
					throw new Error('Invalid password');
				}

				if (!process.env.JWT_SECRET) {
					throw new Error('JWT_SECRET environment variable is not defined');
				}

				const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
					expiresIn: process.env.EXPIRATION,
				});
				console.log('User logged in:', user);
				return { token, user };
			} catch (error) {
				console.error('Error logging in user:', error);
				throw new Error('Error logging in user');
			}
		},
	},
};

module.exports = userResolvers;

