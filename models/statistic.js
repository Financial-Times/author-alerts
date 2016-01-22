'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatisticSchema = new Schema({
	type: {type: String, index: true},
	startTime: Number,
	endTime: Number,
	successItems: Number,
	failedItems: Number,
	msg: String
});

StatisticSchema.set('versionKey', false);

mongoose.model('Statistic', StatisticSchema);
