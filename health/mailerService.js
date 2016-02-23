'use strict';

const moment = require('moment');
const _ = require('lodash');
const mailerService = require('../services/mailer');
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
let to = 'zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz';

module.exports = () => {
	return mailerService.send(to, 'test-subject', 'test-content')
		.then(() => {
			_.extend(healthModel, {
				ok: true,
				lastUpdated: moment().format(env.dateFormat)
			});
			return Promise.resolve(_.omit(healthModel, ['checkOutput']));
		}).catch(error => {
			_.extend(healthModel, {
				checkOutput: error,
				lastUpdated: moment().format(env.dateFormat)
			});
			return Promise.resolve(healthModel);
		});
};
