'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment');

require('../models');

const Article = mongoose.model('Article');
const Statistic = mongoose.model('Statistic');
const DailyLog = mongoose.model('DailyLog');
const ImmediateLog = mongoose.model('ImmediateLog');

const limit = moment().subtract(15, 'days');

const cleanArticles = () => {
	return Article.remove({publishDate: {$lt: limit}}).execAsync();
};
const cleanDailyLogs = () => {
	return DailyLog.remove({lastSent: {$lt: limit}}).execAsync();
};
const cleanImmediateLogs = () => {
	return ImmediateLog.remove({lastSent: {$lt: limit}}).execAsync();
};
const cleanStatistics = () => {
	return Statistic.remove({endTime: {$lt: limit.unix()}}).execAsync();
};

const cleanUp = () => {
	return Promise.all([cleanArticles(), cleanDailyLogs(), cleanImmediateLogs(), cleanStatistics()]);
};

/*eslint-disable no-console */
require('../services/db').connect(() => {
	cleanUp().catch(console.log).finally(() => {
		mongoose.connection.close();
	});
});
