'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment');
const sendmail = require('../services/sendmail');

require('../models');

const UserSubscription = mongoose.model('UserSubscription');
const ImmediateLog = mongoose.model('ImmediateLog');

let startDate = moment();


const getImmediateUserSubscriptions = () => {
	return UserSubscription.aggregate([
		{
			$match: {
				immediate: true
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
	getImmediateUserSubscriptions()
		.then(list => {
			return sendmail.processUserList(list, ImmediateLog, startDate);
		}).finally(() => {
			sendmail.setStatsEndTime();
			console.log(sendmail.getStats());
			mongoose.connection.close();
		});
});
