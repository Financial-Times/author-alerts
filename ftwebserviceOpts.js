'use strict';
const path = require('path');
const health = require('./health');

let healthChecks;
let healthChecksStarted = false;

let startHealthchecks = () => {
	if (!healthChecksStarted) {
		healthChecksStarted = true;

		healthChecks = health.check();
		setInterval(() => {
			healthChecks = health.check();
		}, 60000);
	}
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
		if (!healthChecksStarted) {
			startHealthchecks();
		}

		return healthChecks.then(r => r.reduce(gtgReducer, true));
	},
	healthCheck() {
		if (!healthChecksStarted) {
			startHealthchecks();
		}

		return healthChecks;
	}
};
