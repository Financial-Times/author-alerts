'use strict';

const throng = require('throng');
const concurrency = process.env.WEB_CONCURRENCY || 1;

let appState = {
	port: process.env['PORT'] || 4000,
	ftWebserviceOpts: require('./ftwebserviceOpts')
};

throng(start, {
	workers: concurrency,
	lifetime: Infinity
});

function start() {
	require('./web')(appState);
}
