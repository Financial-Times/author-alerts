'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const _ = require('lodash');
const moment = require('moment');
const contentApi = require('../services/content');

const dateFormat = 'YYYY-MM-DD[T]HH:mm:ss[Z]';

require('../models');
const UserSubscription = mongoose.model('UserSubscription');
const Author = mongoose.model('Author');

const getAuthorsIds = () => {
	return UserSubscription.distinct('subscriptions._id').execAsync();
};

const handleAuthorContent = (authorId) => {
	return Author.findById(authorId).exec().then(author => {
		let afterDate = moment().subtract(2, 'days').format(dateFormat);
		if ( author ) {
			let mostRecentIndex = author.articles.length - 1;
			afterDate = moment(author.articles[mostRecentIndex].publishDate).format(dateFormat);
		}
		return contentApi.getArticles(authorId, afterDate).then(articles => {
			if (articles.length) {
				let articlesToAdd = _.sortBy(articles, 'publishDate');
				let authorItem = {
					_id: authorId
				};
				return Author.update(authorItem, {$addToSet: {articles: {$each: articlesToAdd, $sort: {publishDate: 1}}}}, {upsert: true}).execAsync();
			}
		});
	});
};

const getContent = () => {
	getAuthorsIds().then(authorsIds => {
		return Promise.all(authorsIds.map(handleAuthorContent));
	}).catch(console.log).finally(() => setTimeout(getContent, 300000));
};

require('../services/db').connect(getContent);
