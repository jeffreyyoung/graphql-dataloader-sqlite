const db = require('sqlite');
const _ = require('lodash');
const faker = require('faker');
let dbQueries = 0;
async function createTables(db) {
	await db.run(`
		CREATE TABLE Persons (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			firstName TEXT,
			lastName TEXT
		);
	`);
	
	await db.run(`
		CREATE TABLE FollowerEdges (
			user_id NOT_NULL INTEGER,
			follower_id NOT_NULL INTEGER,
			FOREIGN KEY(user_id) REFERENCES Persons(id)
			FOREIGN KEY(follower_id) REFERENCES Persons(id)
			PRIMARY KEY(user_id,follower_id)
		);
	`)
	
	return true;
}

async function mockData(db) {
	let statement = await db.prepare(`INSERT INTO Persons (firstName, lastName) VALUES (?, ?)`);
	_.range(9).forEach(i => statement.run(faker.name.firstName(), faker.name.lastName()));
	await statement.finalize();
	const rows = await db.all(`SELECT * FROM Persons`);
	let edgesStatement = await db.prepare('INSERT INTO FollowerEdges (user_id, follower_id) VALUES (?, ?)');
	rows.forEach(person => {
		rows.filter(r => r.id !== person.id).forEach(personToFollow => {
			edgesStatement.run(personToFollow.id, person.id);
		})
	});
	await edgesStatement.finalize();
	
}

async function setupDB() {
	await db.open(':memory:')
	await createTables(db);
	await mockData(db);
	return Promise.resolve(true);
	//let followers = await batchGetFollowers(db, [1, 2]);
	//let users = await batchGetUsers(db, [1,2]);
}

module.exports = setupDB;


