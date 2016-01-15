'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment');
const sendmail = require('../services/sendmail');

require('../models');

const UserSubscription = mongoose.model('UserSubscription');
const DailyLog = mongoose.model('DailyLog');

let startDate = moment();

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
	getDailyUserSubscriptions()
		.then(list => {
			return sendmail.processUserList(list, DailyLog, startDate);
		}).finally(() => {
			sendmail.setStatsEndTime();
			console.log(sendmail.getStats());
			mongoose.connection.close();
		});
});
