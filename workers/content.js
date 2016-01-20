'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment');
const contentApi = require('../services/content');

const dateFormat = require('../env').dateFormat;

require('../models');
const UserSubscription = mongoose.model('UserSubscription');
const Article = mongoose.model('Article');

const getAuthorsIds = () => {
	return UserSubscription.distinct('taxonomyId').execAsync();
};

const insertArticle = (article) => {
	return Article.update({
		articleId: article.articleId,
		authorId: article.authorId,
		publishDate: article.publishDate
	}, article, {upsert: true}).execAsync();
};

const handleAuthorContent = (authorId) => {
	return Article.find({authorId: authorId}).sort({publishDate: -1}).limit(1).execAsync().then(article => {
		let afterDate = moment().subtract(1, 'days').format(dateFormat);
		if ( article.length ) {
			afterDate = moment(article.publishDate).format(dateFormat);
		}
		return contentApi.getArticles(authorId, afterDate).then(articles => {
			if (articles.length) {
				return Promise.all(articles.map(insertArticle));
			}
			return Promise.resolve([]);
		});
	});
};

const getContent = () => {
	getAuthorsIds().then(authorsIds => {
		return Promise.all(authorsIds.map(handleAuthorContent));
	}).finally(() => {
		setTimeout(getContent, 300000);
	});
};

require('../services/db').connect(getContent);
