'use strict';
const path = require('path');
const health = require('./health');

const gtgReducer = (res, item) => {
	if(item.ok === false) {
		res = false;
	}
	return res;
};
module.exports = {
	manifestPath: path.join(__dirname, 'package.json'),
	about: {
		schemaVersion: 1,
		name: 'author-alerts'
	},
	goodToGoTest() {
		return health.check().then(r => r.reduce(gtgReducer, true));
	},
	healthCheck() {
		return health.check();
	}
};
