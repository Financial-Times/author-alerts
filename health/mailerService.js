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

module.exports = () => {
	return fetch(healthUrl).then(res => res.json()).then(json => {
		return json.checks.filter(check => check.ok !== true);
	}).then(failed => {
		return new Promise((resolve) => {
			if(!failed.length) {
				_.extend(healthModel, {
					ok: true,
					lastUpdated: moment().format(env.dateFormat)
				});
				resolve(_.omit(healthModel, ['checkOutput']));
			} else {
				_.extend(healthModel, {
					checkOutput: 'Send Api is down',
					lastUpdated: moment().format(env.dateFormat)
				});
				resolve(healthModel);
			}
		});
	});
};
