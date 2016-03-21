'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImmediateLogSchema = new Schema({
	userId: {type: String, index: true},
	sent: {type: Boolean, index: true},
	lastSent: {type: Date, index: true},
	logMessage: String
});

ImmediateLogSchema.index({sent: 1, userId: 1});
mongoose.model('ImmediateLog', ImmediateLogSchema);
