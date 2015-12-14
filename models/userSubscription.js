'use strict';

const mongoose = require('mongoose');
const _ = require('lodash');
const Schema = mongoose.Schema;

const Subscriptions= new Schema({
	_id: String,
	taxonomyName: String,
	immediate: Boolean
});

const UserSubscriptionSchema = new Schema({
	_id: String,
	subscriptions: [Subscriptions]
});



UserSubscriptionSchema.methods = {
	filterSubscriptions(subscriptionItems) {
		let newIds = _.pluck(subscriptionItems, '_id');
		if ( this.subscriptions.length ) {
			this.subscriptions = this.subscriptions.filter(s => {
				return newIds.indexOf(s._id) === -1;
			});
		}
	},
	setSubscriptions(subscriptionItems) {
		this.filterSubscriptions(subscriptionItems);
		subscriptionItems.forEach((item) => {
			this.subscriptions.push(item);
		});
		return this.save();
	},
	removeSubscriptions(subscriptionItems) {
		this.filterSubscriptions(subscriptionItems);
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



