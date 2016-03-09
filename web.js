'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const port = process.env['PORT'] || 4000;
const app = express();


const throng = require('throng');
const concurrency = process.env.WEB_CONCURRENCY || 1;

module.exports = app;


throng(start, {
	workers: concurrency,
	lifetime: Infinity
});

function start() {
	console.log('Started worker');

	process.on('SIGTERM', function() {
		console.log('Worker exiting');
		process.exit();
	});

	require('./models');

	app.use(cookieParser());
	app.use((req, res, next) => {
		res.setHeader('Cache-Control', 'no-cache');
		return next();
	});

	require('express-ftwebservice')(app, require('./ftwebserviceOpts'));
	require('./routes')(app);

	require('./services/db').connect(listen);

	function listen() {
		app.listen(port);
	}
}
