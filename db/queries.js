const db = require('sqlite');
const _ = require('lodash');
const faker = require('faker');
let dbQueries = 0;
function logQuery(type) {
	console.log('query', type, ++dbQueries);
}

async function batchGetFollowers(user_ids) {
	logQuery('batchGetFollowers');
	const rows = await db.all(`SELECT Persons.firstName, Persons.lastName, Persons.id, FollowerEdges.user_id as following_id 
		FROM Persons 
		INNER JOIN FollowerEdges WHERE FollowerEdges.follower_id = Persons.id 
		AND FollowerEdges.user_id in (${user_ids.join(', ')})`)
	const rowsGroupedByUserID = _.groupBy(rows, 'following_id');
	return user_ids.map(id => rowsGroupedByUserID[id]);
}

async function batchGetUsers(user_ids) {
	logQuery('batchGetUsers');
	const rows = await db.all(`SELECT * from Persons WHERE id in (${user_ids.join(', ')})`);
	const keyedRows = _.keyBy(rows, 'id');
	return user_ids.map(id => keyedRows[id]);
}

async function getAllUsers() {
	logQuery('getAllUsers');
	return db.all(`SELECT * FROM Persons`);
}



module.exports = {
	batchGetUsers: batchGetUsers,
	batchGetFollowers: batchGetFollowers,
	getAllUsers: getAllUsers
};


