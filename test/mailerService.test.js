'use strict';

const mailerService = require('../services/mailer');
const env = require('../env');
const expect = require('expect');

describe('mailer service', () => {
	it('should be able to send emails', (done) => {
		let subject = 'test-subject';
		let body = 'test body';
		mailerService.send(env.sendApi.testDestination, subject, body).then(res => {
			expect(res).toBeAn(Object);
			expect(res.id).toExist();
			expect(res.total_accepted_recipients).toEqual(1);
			expect(res.total_rejected_recipients).toEqual(0);
			done();
		});
	});
});
