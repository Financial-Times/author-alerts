'use strict';

const contentService = require('../services/content');
const expect = require('expect');
const env = require('../env');
const moment = require('moment');

describe('content service', () => {
	let testCall = null;
	let testAuthorId = 'Q0ItMDAwMDc5Ng==-QXV0aG9ycw==';

	before(() => {
		testCall = contentService.getArticles(testAuthorId, moment().format(env.dateFormat));
	});

	it('should return a response', (done) => {
		testCall.then(res => {
			expect(res).toBeAn(Array);
			expect(res.length).toEqual(0);
			done();
		});
	});
});
