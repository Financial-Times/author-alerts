'use strict';

const env = require('../env');
const expect = require('expect');
const fetch = require('node-fetch');

describe('mailer service', () => {
	it('should be able to send emails', (done) => {
		fetch(env.sendApi.healthUrl).then(res => {
			return res.json();
		}).then(json => {
			return json.checks.filter(check => check.ok !== true);
		}).then(notOk => {
			expect(notOk.length).toEqual(0);
			done();
		});
	});
});
