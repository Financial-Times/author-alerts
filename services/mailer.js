'use strict';

const request = require('request');
const env = require('../env');

const errPrefix = '[sendApi]:';

exports.send = (to, subject, body) => {
	let requestOpts = {
		method: 'POST',
		url: env.sendApi.url,
		headers: {
			'Authorization': env.sendApi.key
		},
		json: true,
		body: {
			transmissionHeader: {
				returnPath: 'email@ft.com',
				metadata: {
					userUuid: to
				}
			},
			from: {
				address: 'email@ft.com',
				name: 'FT Author Alerts'
			},
			subject: subject,
			htmlContent: body,
			plainTextContent: body
		}
	};
	return new Promise((resolve, reject) => {
		request(requestOpts, (error, response, body) => {
			if ( error || response.statusCode !== 200 ) {
				return reject(errPrefix + (error || response.statusCode) + body);
			}
			return resolve(body.results);
		});
	});
};
