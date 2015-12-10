'use strict';

const config = {
	sessionApi: {
		url: process.env['SESSION_API_URL'],
		key: process.env['SESSION_API_KEY']
	},
	mongodb: {
		uri: process.env['MONGODB_URI']
	}
};

module.exports = config;
