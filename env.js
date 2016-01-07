'use strict';

const config = {
	sessionApi: {
		url: process.env['SESSION_API_URL'],
		key: process.env['SESSION_API_KEY']
	},
	contentApi: {
		url: process.env['CONTENT_API_URL'],
		key: process.env['CONTENT_API_KEY']
	},
	mongodb: {
		uri: process.env['MONGOLAB_URI']
	}
};

module.exports = config;
