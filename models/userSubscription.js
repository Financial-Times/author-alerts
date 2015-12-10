'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Schema = mongoose.Schema;

const UserSubscriptionSchema = new Schema({
	_id: String,
	subscriptions: [{
		_id : String,
		taxonomyName: String,
		immediate: Boolean
	}]
});

UserSubscriptionSchema.methods = {
	setSubscriptions(subscriptionItems) {
		return this.update({$addToSet: {subscriptions: {$each: subscriptionItems}}}).exec();
	},
	removeSubscriptions(subscriptionItems) {
		this.subscriptions = this.subscriptions.filter(s => {
			return _.pluck(subscriptionItems, '_id').indexOf(s._id) === -1;
		});
		if (this.subscriptions.length) {
			return this.save();
		}
		return this.remove();
	}
};

UserSubscriptionSchema.statics = {
	createItem(id) {
		return Promise.resolve(this.create({_id: id}));
	},
	findByIdOrInsert(id) {
		return this.findById(id).exec()
				.then((item) => {
					if(_.isEmpty(item)) {
						return this.createItem(id);
					}
					return item;
				});
	}
};

mongoose.model('UserSubscription', UserSubscriptionSchema);



