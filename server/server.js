const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const protect = require('./utils/auth');
const cors = require('cors');

const typeDefs = require('./typeDefs/schema');
const resolvers = require('./resolvers');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
	typeDefs,
	resolvers,
	context: async ({ req }) => {
		const context = await protect({ req });
		console.log('Context:', context);
		return context;
	},
});

const startApolloServer = async () => {
	await server.start();

	app.use(express.urlencoded({ extended: false }));
	app.use(express.json());
	app.use(cors());

	app.use('/images', express.static(path.join(__dirname, '../client/images')));

	app.use(
		'/graphql',
		expressMiddleware(server, {
			context: async ({ req }) => {
				const context = await protect({ req });
				// console.log('GraphQL Context.user:', context.user);
				return context;
			},
		})
	);

	if (process.env.NODE_ENV === 'production') {
		app.use(express.static(path.join(__dirname, '../client/dist')));

		app.get('*', (req, res) => {
			res.sendFile(path.join(__dirname, '../client/dist/index.html'));
		});
	}

	db.once('open', () => {
		app.listen(PORT, () => {
			console.log(`API server running on port ${PORT}!`);
			console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
		});
	});
};

startApolloServer();
