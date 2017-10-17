const db = require('sqlite');
const _ = require('lodash');
const faker = require('faker');
const {getAllUsers, batchGetUsers, batchGetFollowers} = require('./queries');
const setup = require('./setup');

module.exports = {
	initialize: setup,
	batchGetUsers: batchGetUsers,
	batchGetFollowers: batchGetFollowers,
	getAllUsers: getAllUsers
};


