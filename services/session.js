'use strict';

const request = require('request');
const env = require('../env');

const errPrefix = '[sessionApi]:';

const getUserData = (sessionId) => {
	if ( !sessionId ) {
		return Promise.reject(new Error('A valid session id must be provided.'));
	}
	let options = {
		url: env.sessionApi.url + sessionId,
		headers: {
			'FT_Api_Key': env.sessionApi.key
		}
	};
	return new Promise((resolve, reject) => {
		request(options, (error, response, body) => {
			if ( error || response.statusCode !== 200 ) {
				return reject(errPrefix + (error || response.body));
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
