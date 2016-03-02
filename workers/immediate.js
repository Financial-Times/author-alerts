'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const sendmail = require('../services/sendmail');
const Statistics = require('../services/statistics');

require('../models');

const UserSubscription = mongoose.model('UserSubscription');
const ImmediateLog = mongoose.model('ImmediateLog');
const StatsModel = mongoose.model('Statistic');

const getImmediateUserSubscriptions = () => {
	return UserSubscription.aggregate([
		{
			$match: {
				immediate: true
			}
		},
		{
			$sort: {
				_id: -1
			}
		},
		{
			$group: {
				_id: '$userId',
				subscriptions: {
					$push: {
						taxonomyId: '$taxonomyId',
						taxonomyName: '$taxonomyName',
						addedAt: '$addedAt'
					}
				}
			}
		}
	]).execAsync();
};

/*eslint-disable no-console */
require('../services/db').connect(() => {
	let stats = new Statistics('immediate', StatsModel);
	stats.start();
	getImmediateUserSubscriptions()
		.then(list => {
			return sendmail.processUserList(list, ImmediateLog, stats);
		}).catch(console.log).finally(() => {
			stats.end();
			stats.save(() => mongoose.connection.close());
			console.log(JSON.stringify(stats.get()));
		});
});
