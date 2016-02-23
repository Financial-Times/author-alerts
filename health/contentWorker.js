'use strict';

const workerHealth = require('../helpers/workerHealth');

const type = 'content';
const delta = 60 * 15;
let healthModel = {
	name: 'Content caching worker',
	id: 'content-worker',
	ok: false,
	technicalSummary: 'Worker runs at specific interval to cache content from content api',
	severity: 2,
	businessImpact: 'No content for alerts will be available',
	checkOutput: '',
	panicGuide: 'Check logs for content worker',
	lastUpdated: null
};

module.exports = () => {
	return workerHealth(type, delta, healthModel);
};

