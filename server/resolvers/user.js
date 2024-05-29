const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

const userResolvers = {
  Query: {
    getUser: async (_, { userId }) => {
      return await User.findById(userId);
    },
    getUserRecipes: async (_, { userId }) => {
      return await Recipe.find({ createdBy: userId });
    },
  },
  Mutation: {
    register: async (_, { username, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ username, email, password: hashedPassword });
      await user.save();
      return user;
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        throw new Error('Invalid password');
      }

      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return token;
    },
  },
  User: {
    recipes: async (parent) => {
      return await Recipe.find({ createdBy: parent.id });
    },
  },
};

module.exports = userResolvers;
