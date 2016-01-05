'use strict';

const env = require('../env');
const mongoose = require('mongoose');

function dbConnect() {
	let options = {
		server: {
			socketOptions: {
				keepAlive: 1
			}
		}
	};
	return mongoose.connect(env.mongodb.uri, options).connection;
}

/*eslint-disable no-console */
exports.connect = (openCb, errCb) => {
	errCb = errCb || console.log;
	dbConnect()
		.on('error', errCb)
		.on('disconnect', dbConnect)
		.on('open', openCb);
};
/*eslint-enable no-console*/

