'use strict';

const throng = require('throng');
const concurrency = process.env.WEB_CONCURRENCY || 1;

throng(start, {
	workers: concurrency,
	lifetime: Infinity
});

function start() {
	require('./web');
}
