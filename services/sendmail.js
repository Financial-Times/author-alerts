'use strict';

const Promise = require('bluebird');
const messageService = require('./message');
const moment = require('moment');
const env = require('../env');
const mailer = require('./mailer');

let logModel = null;
let startDate = null;
let stats = null;

const addSuccessLog = (log, userId) => {
	return logModel.update(
		{userId: userId, sent: true},
		{
			userId: userId,
			sent: true,
			lastSent: startDate.format(env.dateFormat),
			logMessage: JSON.stringify(log)
		},
		{upsert: true}
	).execAsync();
};

const addFailedLog = (log, userId) => {
	let item = new logModel({
		userId: userId,
		sent: false,
		lastSent: startDate.format(env.dateFormat),
		logMessage: JSON.stringify(log)
	});
	return item.saveAsync();
};

const handleUser = (user) => {
	/** see the aggregate method in the worker **/
	let userId = user._id;
	return messageService.getArticles(user, logModel).then(articles => {
		let articlesList = [].concat(...articles);
		if ( articlesList.length ) {
			let userData = messageService.prepareUserData(articlesList, user);
			let subject = messageService.getSubject(userData) || `New articles from FT`;
			let now = moment();
			let data = {
				title: 'author alerts',
				date: now.format('dddd Do MMMM'),
				year: now.format('YYYY'),
				userData
			};
			messageService.resetAuthorIndex();
			messageService.manageAd(Object.keys(userData).length);
			let htmlBody = messageService.template.html(data);
			let textBody = messageService.template.text(data);
			return mailer.send(userId, subject, htmlBody, textBody)
				.then(res => {
					stats.success();
					return addSuccessLog(res, userId);
				}).catch(err => {
					stats.failed();
					return addFailedLog(err, userId);
				});
		}
	});
};

exports.processUserList = (userList, mailLogger, statsInstance) => {
	logModel = mailLogger;
	stats = statsInstance;
	startDate = moment.unix(stats.get('startTime'));
	return Promise.map(userList, handleUser, {concurrency: 100});
};
