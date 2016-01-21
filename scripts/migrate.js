'use strict';

const Promise = require('bluebird');
const url = require('url');
const mongoose = Promise.promisifyAll(require('mongoose'));
const moment = require('moment-timezone');
const env = require('../env');
const _ = require('lodash');
const MongoClient = require('mongodb').MongoClient;
const request = require('request');
const localDb = require('../services/db');
const authorNames = require('./normalizeAuthorName');
require('../models');

const UserSubscription = mongoose.model('UserSubscription');

const date = moment().tz('Europe/London').format(env.dateFormat);

function getUserData(item, authors) {
	let requestOpts = {
		url: url.parse(process.env['USER_ID']),
		qs: {erightsId: item.userId},
		method: 'GET'
	};
	return new Promise((resolve, reject) => {
		request(requestOpts, (error, response, body) => {
			if (error || response.statusCode !== 200) {
				return reject(error || response.body);
			}
			try {
				let userIdData = JSON.parse(body);
				return resolve({
					userId: userIdData.user.id,
					taxonomyId: item.taxonomyId || null,
					taxonomyName:  item.taxonomyName || _.result(_.find(authors, {'authorId': item.taxonomyId}), 'authorName'),
					addedAt: date || '',
					immediate:  (item.immediate === 'true')
				});
			} catch(error) {
				return reject(`getUserDataError: ${error}`);
			}
		});
	});
}

/*eslint-disable no-console */
MongoClient.connect(process.env['OLD_MONGO'], (err, db) => {
	if (err) {
		console.log(err);
		return;
	}
	let col = db.collection('follow');
	let stream = col.find({}).sort({_id: 1}).batchSize(30);
	let count = 0;
	stream.on('error', (err) => {
		console.log(err);
	});
	localDb.connect(() => {
		authorNames((error, authors) => {
			stream.on('data', (doc) => {
				return getUserData(doc, authors).then((userObj) => {
					if (userObj['userId']) {
						return UserSubscription.update({
							userId: userObj.userId,
							taxonomyId: userObj.taxonomyId
						}, userObj, {upsert: true, new: true}).execAsync();
					}
				}).then((doc) => {
					count++;
					console.log(`[${count}]: ${JSON.stringify(doc)}`);
				}).catch((err) => {
					console.log(`Error processing ${JSON.stringify(doc)} ### ${err}`);
				});
			});
		});
	});
});
/*eslint-enable no-console */
