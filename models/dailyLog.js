'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DailyLogSchema = new Schema({
	userId: {type: String, index: true},
	sent: Boolean,
	lastSent: Date,
	logMessage: String
});

mongoose.model('DailyLog', DailyLogSchema);
