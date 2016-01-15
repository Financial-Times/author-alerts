'use strict';

const request = require('request');
const env = require('../env');

const errPrefix = '[contentApi]:';

const parseContentResult = (resObj, taxonomyId) => {
	if ( resObj.length && resObj[0].indexCount ) {
		return resObj[0].results.reduce((ret, item) => {
			ret.push({
				articleId: item.id,
				title: item.title.title,
				url: item.location.uri,
				publishDate: item.lifecycle.initialPublishDateTime,
				summary: item.summary.excerpt,
				authorId: taxonomyId
			});
			return ret;
		}, []);
	}
	return [];
};

exports.getArticles = (taxonomyId, newerThan) => {
	let requestOpts = {
		method: 'POST',
		url: env.contentApi.url,
		headers: {
			'X-Api-Key': env.contentApi.key
		},
		qs: {
			'apiKey': env.contentApi.key
		},
		json: true,
		body: {
			'queryString': `authorsId:="${taxonomyId}" AND initialPublishDateTime:>${newerThan}`,
			'queryContext' : {
				'curations' : ['ARTICLES']
			},
			'resultContext': {
				'maxResults': 100,
				'aspects': ['title', 'summary', 'location', 'lifecycle']
			}
		}
	};
	return new Promise((resolve, reject) => {
		request(requestOpts, (error, response, body) => {
			if ( error || response.statusCode !== 200 ) {
				return reject(errPrefix + (error || body.message || body));
			}
			return resolve(parseContentResult(body.results, taxonomyId));
		});
	});
};
