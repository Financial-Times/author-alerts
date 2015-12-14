'use strict';
const path = require('path');

module.exports = {
	manifestPath: path.join(__dirname, 'package.json'),
	about: {
		schemaVersion: 1,
		name: 'author-alerts'
	},
	goodToGoTest() {
		return Promise.resolve('test');
	},
	healthCheck() {
		return Promise.resolve(['test1', 'test2']);
	}
};
