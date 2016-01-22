'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const sendmail = require('../services/sendmail');
const Statistics = require('../services/statistics');

require('../models');

const UserSubscription = mongoose.model('UserSubscription');
const DailyLog = mongoose.model('DailyLog');
const StatsModel = mongoose.model('Statistic');

const getDailyUserSubscriptions = () => {
	return UserSubscription.aggregate([
		{
			$match: {
				immediate: false
			}
		},
		{
			$group: {
				_id: '$userId',
				subscriptions: { $push: {
					taxonomyId: '$taxonomyId',
					taxonomyName: '$taxonomyName',
					addedAt: '$addedAt'
				}}
			}
		}
	]).execAsync();
};

/*eslint-disable no-console */
require('../services/db').connect(() => {
	let stats = new Statistics('daily', StatsModel);
	stats.start();
	getDailyUserSubscriptions()
		.then(list => {
			return sendmail.processUserList(list, DailyLog, stats);
		}).finally(() => {
			stats.end();
			stats.save(() => mongoose.connection.close());
			console.log(JSON.stringify(stats.get()));
		});
});
