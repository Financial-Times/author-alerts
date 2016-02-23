'use strict';

const moment = require('moment');
const _ = require('lodash');
const contentService = require('../services/content');
const env = require('../env');

let healthModel = {
	name: 'Content API',
	id: 'content-api',
	ok: false,
	technicalSummary: 'Query articles by date and author',
	severity: 2,
	businessImpact: 'No articles will be cached',
	checkOutput: '',
	panicGuide: 'Check logs for content worker',
	lastUpdated: null
};

module.exports = () => {
	return contentService.getArticles('test', moment().format(env.dateFormat))
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
