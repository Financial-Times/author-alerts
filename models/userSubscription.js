'use strict';

const moment = require('moment');
const env = require('../env');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSubscriptionSchema = new Schema({
	userId: {type: String, index: true},
	taxonomyId: {type: String, index: true},
	taxonomyName: String,
	addedAt: {type: Date, default: moment().format(env.dateFormat)},
	immediate: Boolean
});

UserSubscriptionSchema.index({userId: 1, _id: -1});
UserSubscriptionSchema.set('versionKey', false);

mongoose.model('UserSubscription', UserSubscriptionSchema);



