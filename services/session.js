'use strict';

const request = require('request');
const env = require('../env');

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
				return reject(new Error(response.body));
			}
			try {
				let res = JSON.parse(body);
				return resolve(res);
			} catch(error) {
				return reject(error);
			}
		});
	});
};

exports.getUserData = getUserData;
