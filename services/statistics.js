'use strict';

const moment = require('moment');

class Statistics {
	constructor(type, model) {
		this.model = model;
		this.statItem = {
			type: type,
			startTime: 0,
			endTime: 0,
			successItems: 0,
			failedItems: 0,
			msg: ''
		};
	}
	start(date) {
		this.statItem.startTime = moment(date).unix();
	}
	end(date) {
		this.statItem.endTime = moment(date).unix();
	}
	success(num) {
		num = num || 1;
		this.statItem.successItems += num;
	}
	failed(num) {
		num = num || 1;
		this.statItem.failedItems += num;
	}
	get(key) {
		if ( key && this.statItem.hasOwnProperty(key) ) {
			return this.statItem[key];
		}
		return this.statItem;
	}
	save(cb) {
		return this.model.create(this.statItem, cb);
	}
}

module.exports = Statistics;
