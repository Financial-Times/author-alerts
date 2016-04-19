'use strict';

const moment = require('moment');
const _ = require('lodash');
const fetch = require('node-fetch');
const env = require('../env');

let healthModel = {
	name: 'Send API',
	id: 'send-api',
	ok: false,
	technicalSummary: 'Send email messages',
	severity: 2,
	businessImpact: 'No alerts will be sent',
	checkOutput: '',
	panicGuide: 'Check logs for both daily and immediate workers',
	lastUpdated: null
};

let healthUrl = env.sendApi.healthUrl;

const checkHealth = () => {
	return fetch(healthUrl).then(res => res.json()).then(json => {
		return json.checks.filter(check => check.ok !== true);
	}).then(failed => {
		if(!failed.length) {
			_.extend(healthModel, {
				ok: true,
				lastUpdated: moment().format(env.dateFormat)
			});
			healthModel = _.omit(healthModel, ['checkOutput']);
		} else {
			_.extend(healthModel, {
				checkOutput: 'Send Api is down',
				lastUpdated: moment().format(env.dateFormat)
			});
		}
	});
};

setInterval(checkHealth, 1000);

module.exports = () => {
	return Promise.resolve(healthModel);
};
