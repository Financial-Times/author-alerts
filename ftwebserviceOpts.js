'use strict';
const path = require('path');
const health = require('./health');

let cached = null;
let call = null;

const checkHealth = () => {
	return health.check().then(res => {
		clearTimeout(call);
		call = setTimeout(checkHealth, 10000);
		cached = res;
		return cached;
	});
};

const getHealth = () => {
	if (cached) {
		return Promise.resolve(cached);
	}
	return checkHealth();
};

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
		name: 'author-alerts',
		systemCode: 'author-alerts'
	},
	goodToGoTest() {
		return getHealth().then(r => r.reduce(gtgReducer, true));
	},
	healthCheck() {
		return getHealth();
	}
};
