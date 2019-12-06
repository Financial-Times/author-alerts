'use strict';

const request = require('request');
const env = require('../env');

const errPrefix = '[sessionApi]:';

const getUserData = (sessionId) => {
	if ( !sessionId ) {
		return Promise.reject(new Error(env.errors.sessionIdRequired));
	}
	let options = {
		url: env.sessionApi.url + sessionId,
		headers: {
			'FT-Api-Key': env.sessionApi.key
		}
	};
	return new Promise((resolve, reject) => {
		request(options, (error, response, body) => {
			if (error) {
				return reject(error);
			}
			if (response.statusCode !== 200) {
				return reject(new Error(env.errors.sessionIdRequired));
			}
			try {
				let sessionData = JSON.parse(body);
				return resolve(sessionData);
			} catch(error) {
				return reject(errPrefix + error);
			}
		});
	});
};

exports.getUserData = getUserData;
