'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const fs = require('fs');
const handlebars = require('handlebars');
const moment = require('moment');
const _ = require('lodash');
const env = require('../env');

require('../models');

const Article = mongoose.model('Article');

let template = handlebars.compile(fs.readFileSync('./templates/email.hbs', 'utf8'));
let ad = fs.readFileSync('./templates/ad.html', 'utf8');
let authorIndex = 0;

const getContent = (afterDate, subscriptions) => {
	return Promise.map(subscriptions, (subscription) => {
		return Article.find({
			authorId: subscription.taxonomyId,
			publishDate: {$gt: new Date(afterDate)}
		}).execAsync();
	});
};

const getLastSentDateForUser = (user, logModel) => {
	return logModel.findOne(
		{userId: user._id, sent: true},
		{lastSent: 1, _id: 0}
	).execAsync();
};

exports.template = template;

exports.resetAuthorIndex = () => {
	authorIndex = 0;
};

exports.getArticles = (user, logModel) => {
	return getLastSentDateForUser(user, logModel).then(logItem => {
		let lastDate = null;
		if ( logItem ) {
			lastDate = moment(logItem.lastSent).format(env.dateFormat);
		} else if (user.hasOwnProperty('addedAt')) {
			lastDate = moment(user.addedAt).format(env.dateFormat);
		} else {
			lastDate = moment().subtract(1, 'days').format(env.dateFormat);
		}
		return getContent(lastDate, user.subscriptions);
	});
};

exports.prepareUserData = (articles, user) => {
	let articlesByAuthor = _.groupBy(articles, 'authorId');
	let userData = [];
	_.each(articlesByAuthor, (art, key) => {
		let userDataItem = {};
		userDataItem.authorName = _.result(_.find(user.subscriptions, {taxonomyId: key}), 'taxonomyName');
		userDataItem.authorId = key;
		userDataItem.stopAlertLink = `http://www.ft.com/thirdpartywrapper/unsubscribe?authorId=${key}&ftcamp=crm/email/follow/author//product`;
		userDataItem.articles = art;
		userData.push(userDataItem);
	});
	return userData;
};

exports.manageAd = (authorsNumber) => {
	handlebars.registerHelper('showad', () => {
		let lastIdx = authorsNumber - 1;
		let ret = '';
		if ((authorsNumber <= 3 && (authorIndex == lastIdx)) || ((authorsNumber > 3) && authorIndex == 2)) {
			ret = ad;
		}
		authorIndex += 1;
		return ret;
	});
};

exports.getSubject = (userData) => {
	const singular = 'article';
	const plural = 'articles';
	let articleNoun = singular;
	let postfix = '';
	let authors = userData.map(item => item.authorName);
	if ( userData.length > 1 || authors.length > 1 ) {
		articleNoun = plural;
	}
	if ( authors.length ) {
		if (authors.length > 3) {
			authors = authors.slice(0, 3);
			postfix = '...';
		}
		return `New ${articleNoun} by ${authors.join(', ')}${postfix}`;
	}
};
