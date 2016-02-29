'use strict';

const config = {
	dateFormat: 'YYYY-MM-DD[T]HH:mm:ss[Z]',
	errors: {
		sessionIdRequired: 'A valid session id must be provided.',
		noParameters: 'No or not enough parameters found.',
		idParameterRequired: `'id' parameter is required.`
	},
	sessionApi: {
		url: process.env['SESSION_API_URL'],
		key: process.env['SESSION_API_KEY']
	},
	contentApi: {
		url: process.env['CONTENT_API_URL'],
		key: process.env['CONTENT_API_KEY']
	},
	sendApi: {
		url: process.env['SEND_API_URL'],
		key: process.env['SEND_API_KEY'],
		testDestination: process.env['TEST_SEND_UUID']
	},
	mongodb: {
		uri: process.env['MONGOLAB_URI']
	}
};

module.exports = config;
