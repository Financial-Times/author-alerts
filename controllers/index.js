'use strict';

const sessionApi = require('../services/session');
const Promise = require('bluebird');
const moment = require('moment');
const env = require('../env');
const mongoose = Promise.promisifyAll(require('mongoose'));
const _ = require('lodash');

const UserSubscription = mongoose.model('UserSubscription');

/** extract to helper **/
const createSubscriptionItem = (parts) => {
	return parts.split(',').reduce((item, value, index, values) => {
		item['taxonomyId'] = values[2];
		item['taxonomyName'] = values[1];
		item['immediate'] = (values[0] === 'immediate');
		return item;
	}, {});
};
const extractSubscriptionItems = (paramsList) => {
	return paramsList.map(createSubscriptionItem);
};

/*eslint-disable no-console */
const handleError = (error, res) => {
	console.log(error);
	res.statusCode(500).send('Error');
};
/*eslint-enable no-console */

exports.validate = (req, res, next) => {
	let sessionId = req.cookies['FTSession'];
	let params = req.query;
	let subscriptions = null;
	let subscriptionParam = params.follow || params.unfollow;

	if (!sessionId) {
		return res.end(env.errors.sessionIdRequired);
	}

	if (subscriptionParam) {
		subscriptions = extractSubscriptionItems([].concat(subscriptionParam));
	}

	if (_.isEmpty(subscriptions)) {
		return res.end(env.errors.noParameters);
	}

	req.subscriptions = subscriptions;
	req.sessionId = sessionId;
	next();
};

exports.follow = (req, res) => {
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			return Promise.all(req.subscriptions.map(subscription => {
				let userSubscriptionItem = {
					userId: userData.uuid,
					taxonomyId: subscription.taxonomyId,
					taxonomyName: subscription.taxonomyName,
					addedAt: moment().format(env.dateFormat),
					immediate: subscription.immediate
				};
				return UserSubscription.update({
					userId: userData.uuid,
					taxonomyId: subscription.taxonomyId
				}, userSubscriptionItem, {upsert: true}).execAsync();
			}));
		}).then(() => {
			res.end('done');
		}).catch((error) => {
			handleError(error, res);
		});
};

exports.unfollow = (req, res) => {
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			return Promise.all(req.subscriptions.map(subscription => {
				return UserSubscription.remove({
					userId: userData.uuid,
					taxonomyId: subscription.taxonomyId
				}).execAsync();
			}));
		}).then(() => {
			res.end('done');
		}).catch((error) => {
			handleError(error, res);
		});
};

exports.users = (req, res) => {
	let params = req.query;
	if ( !params.hasOwnProperty('id') ) {
		return res.end(env.errors.idParameterRequired);
	}
	UserSubscription.find({
		taxonomyId: params['id']
	}).select({userId: 1, _id: 0}).execAsync().then(users => {
		res.json(users);
	});
};
