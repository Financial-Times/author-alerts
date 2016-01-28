'use strict';

const moment = require('moment');
const _ = require('lodash');
const env = require('../env');
const Promise = require('bluebird');
const mongoose = Promise.promisifyAll(require('mongoose'));

const Stats = mongoose.model('Statistic');

const getWorkerStat = (type) => {
	return Stats.findOne({type: type})
		.select({endTime: 1, _id: 0})
		.sort({endTime: -1})
		.limit(1)
		.execAsync();
};

module.exports = (type, delta, model) => {
	return getWorkerStat(type).then(stat => {
		if ( !stat ) {
			_.extend(model, {
				lastUpdated: moment().format(env.dateFormat),
				checkOutput: 'No statistics found.'
			});
			return Promise.resolve(_.pick(model, ['name', 'ok', 'lastUpdated', 'checkOutput']));
		}

		let lastRun = parseInt(stat.endTime, 10);
		_.extend(model, {
			lastUpdated: moment.unix(lastRun).format(env.dateFormat)
		});

		if (moment().unix() - lastRun >= delta) {
			_.extend(model, {
				checkOutput: stat.msg
			});
			return Promise.resolve(_.pick(model, ['name', 'ok', 'lastUpdated', 'checkOutput']));
		}

		_.extend(model, {
			ok: true
		});
		return Promise.resolve(_.pick(model, ['name', 'ok', 'lastUpdated']));
	});
};
