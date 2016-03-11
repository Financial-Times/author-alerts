'use strict';
const path = require('path');
const health = require('./health');

let healthChecks = health.check();

setInterval(function () {
	healthChecks = health.check();
}, 60000);

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
		return healthChecks.then(r => r.reduce(gtgReducer, true));
	},
	healthCheck() {
		return healthChecks;
	}
};
