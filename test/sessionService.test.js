'use strict';

const sessionService = require('../services/session');
const env = require('../env');
const expect = require('expect');

describe('session service', () => {
	it('should throw error if no session id is provided', (done) => {
		sessionService.getUserData().catch(err => {
			expect(err).toExist();
			expect(err.message).toEqual(env.errors.sessionIdRequired);
			done();
		});
	});
	it('should throw error if invalid session id is provided', (done) => {
		sessionService.getUserData('invalid-session-id').catch(err => {
			expect(err).toExist();
			done();
		});
	});
});
