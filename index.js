const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const db = require('./db')
const DataLoader = require('dataloader');

const userLoader = new DataLoader(async (keys) => {
	const rows = await db.batchGetUsers(keys);
	return rows.map(r => new User(r));
});
const followersLoader = new DataLoader(async (keys) => {
	const rows = await db.batchGetFollowers(keys);
	return rows.map(r => r.map(c =>new User(c)));
});
// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
  type User {
    firstName: String!
    lastName: String!
    followers: [User]
  }

  type Query {
    users: [User]
  }
`);

// This class implements the RandomDie GraphQL type
class User {
	constructor(data) {
		this.id = data.id;
		this.firstName = data.firstName;
		this.lastName = data.lastName;
	}

	async followers(a, b, c) {
		return followersLoader.load(this.id);
		return followers;
	}
}

// The root provides the top-level API endpoints
var root = {
  users: async function () {
    const rows = await db.getAllUsers();
		let result = rows.map(data => new User(data));
		return result;
  }
}

var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));

db.initialize().then(() => {
	app.listen(4000);
	console.log('Running a GraphQL API server at localhost:4000/graphql');
});