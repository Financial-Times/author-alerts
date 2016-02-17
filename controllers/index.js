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
		/** when unsubscribing the frequency (immediate|daily) is not passed **/
		if (values.length === 2) {
			values.unshift(null);
		}
		item['taxonomyId'] = values[2];
		item['taxonomyName'] = values[1];
		item['immediate'] = (values[0] === 'immediate');
		return item;
	}, {});
};

const extractSubscriptionItems = (paramsList) => {
	return paramsList.map(createSubscriptionItem);
};

const getTaxonomies = (list) => {
	if (list.length) {
		return list.map(item => {
			return {
				id: item.taxonomyId,
				name: item.taxonomyName,
				type: 'authors',
				frequency: item.immediate ? 'immediate' : 'daily'
			};
		});
	}
	return [];
};

const taxonomiesForUser = (userId) => {
	return UserSubscription.find({userId: userId}).execAsync()
		.then(subscriptions => {
			if (subscriptions.length) {
				return {
					status: 'success',
					message: 'following list retrieved',
					taxonomies: getTaxonomies(subscriptions)
				};
			}
			return {
				status: 'success',
				message: 'user has no following list',
				taxonomies: []
			};
		});
};

/*eslint-disable no-console */
const handleError = (error, res) => {
	console.log(error);
	res.statusCode(500).send('Error');
};
/*eslint-enable no-console */

exports.validateSession = (req, res, next) => {
	let sessionId = req.cookies['FTSession'];
	if (!sessionId) {
		return res.end(env.errors.sessionIdRequired);
	}
	req.sessionId = sessionId;
	next();
};

exports.validateParams = (req, res, next) => {
	let params = req.query;
	let follow = params.follow;
	let unfollow = params.unfollow;

	if (follow) {
		follow = extractSubscriptionItems([].concat(follow));
	}
	if (unfollow) {
		unfollow = extractSubscriptionItems([].concat(unfollow));
	}
	if (_.isEmpty(follow) && _.isEmpty(unfollow)) {
		return res.end(env.errors.noParameters);
	}

	req.follow = follow || [];
	req.unfollow = unfollow || [];
	next();
};

const addSubscription = (userId, subscription) => {
	let userSubscriptionItem = {
		userId: userId,
		taxonomyId: subscription.taxonomyId,
		taxonomyName: subscription.taxonomyName,
		addedAt: moment().format(env.dateFormat),
		immediate: subscription.immediate
	};
	return UserSubscription.update({
		userId: userId,
		taxonomyId: subscription.taxonomyId
	}, userSubscriptionItem, {upsert: true}).execAsync();
};

const removeSubscription = (userId, subscription) => {
	return UserSubscription.remove({
		userId: userId,
		taxonomyId: subscription.taxonomyId
	}).execAsync();
};

exports.follow = (req, res) => {
	let userId = null;
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			userId = userData.uuid;
			return Promise.map(req.follow, (subscription) => {
				return addSubscription(userId, subscription);
			});
		}).then(() => {
			taxonomiesForUser(userId).then(data => res.jsonp(data));
		}).catch((error) => {
			handleError(error, res);
		});
};

exports.unfollowAll = (req, res) => {
	let userId = null;
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			userId = userData.uuid;
			return UserSubscription.remove({
				userId: userId
			}).execAsync();
		}).then(() => {
			taxonomiesForUser(userId).then(data => res.jsonp(data));
		}).catch((error) => {
			handleError(error, res);
		});
};

exports.unfollow = (req, res) => {
	let userId = null;
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			userId = userData.uuid;
			return Promise.map(req.unfollow, (subscription) => {
				return removeSubscription(userId, subscription);
			});
		}).then(() => {
			taxonomiesForUser(userId).then(data => res.jsonp(data));
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

exports.subscriptions = (req, res) => {
	let userId = null;
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			userId = userData.uuid;
			return taxonomiesForUser(userId);
		}).then(data => res.jsonp(data)).catch((error) => {
			handleError(error, res);
		});
};

exports.updateBulk = (req, res) => {
	let userId = null;
	sessionApi.getUserData(req.sessionId)
		.then((userData) => {
			userId = userData.uuid;
			return Promise.join(
				Promise.map(req.follow, (subscription) => {
					return addSubscription(userId, subscription);
				}),
				Promise.map(req.unfollow, (subscription) => {
					return removeSubscription(userId, subscription);
				})
			);
		}).then(() => {
			taxonomiesForUser(userId).then(data => res.jsonp(data));
		}).catch((error) => {
			handleError(error, res);
		});
};
