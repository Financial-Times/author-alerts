'use strict';

const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment');
const contentApi = require('../services/content');
const Statistics = require('../services/statistics');

const dateFormat = require('../env').dateFormat;

require('../models');
const UserSubscription = mongoose.model('UserSubscription');
const Article = mongoose.model('Article');
const StatsModel = mongoose.model('Statistic');

let stats = null;

const getAuthorsIds = () => {
	return UserSubscription.distinct('taxonomyId').execAsync();
};

/*eslint-disable no-console */
const insertArticle = (article) => {
	return Article.update({
		articleId: article.articleId,
		authorId: article.authorId,
		publishDate: article.publishDate
	}, article, {upsert: true}).execAsync().then(() => {
		stats.success();
		return Promise.resolve(article);
	}).catch(error => {
		stats.failed();
		console.log(JSON.stringify({error, article}));
	});
};

const handleAuthorContent = (authorId) => {
	return Article.findOne({authorId: authorId}).sort({publishDate: -1}).execAsync().then(article => {
		let afterDate = moment().subtract(1, 'days').format(dateFormat);
		if ( article ) {
			afterDate = moment(article.publishDate).format(dateFormat);
		}
		return contentApi.getArticles(authorId, afterDate).then(articles => {
			if (articles.length) {
				return Promise.map(articles, insertArticle);
			}
		}).catch(error => {
			console.log(JSON.stringify({error, authorId, afterDate}));
			stats.failed();
		});
	});
};

const getContent = () => {
	stats = new Statistics('content', StatsModel);
	stats.start();
	getAuthorsIds().then(authorsIds => {
		return Promise.map(authorsIds, handleAuthorContent, {concurrency: 100});
	}).catch(console.log).finally(() => {
		stats.end();
		stats.save(() => setTimeout(getContent, 300000));
		console.log(JSON.stringify(stats.get()));
	});
};

require('../services/db').connect(getContent);
