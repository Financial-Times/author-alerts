'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StatisticSchema = new Schema({
	type: {type: String, index: true},
	startTime: Number,
	endTime: {type: Number, index: true},
	successItems: Number,
	failedItems: Number,
	msg: String
});

StatisticSchema.index({type: 1, endTime: -1});
StatisticSchema.set('versionKey', false);

mongoose.model('Statistic', StatisticSchema);
