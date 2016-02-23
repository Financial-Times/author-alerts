'use strict';

const workerHealth = require('../helpers/workerHealth');

const type = 'immediate';
const delta = 60 * 30;
let healthModel = {
	name: 'Immediate alerts worker',
	id: 'immediate-worker',
	ok: false,
	technicalSummary: 'Worker sends alerts at specific interval',
	severity: 2,
	businessImpact: 'No immediate alerts will be sent',
	checkOutput: '',
	panicGuide: 'Check logs for immediate worker',
	lastUpdated: null
};

module.exports = () => {
	return workerHealth(type, delta, healthModel);
};
