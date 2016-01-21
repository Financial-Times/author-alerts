'use strict';

const expect = require('expect');
const mongoose = require('mongoose');

describe('database', () => {
	it('connection should exist', (done) => {
		expect(mongoose.connection).toExist();
		return done();
	});
	it('subscriptions from api routes tests should not exist in the database', (done) => {
		let UserSubscription = mongoose.model('UserSubscription');
		UserSubscription.find({userId: 'test-user-id'}).exec()
			.then(user => {
				expect(user.length).toEqual(0);
				done();
			});
	});
});
