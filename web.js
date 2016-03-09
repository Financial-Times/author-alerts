'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const port = process.env['PORT'] || 4000;
const app = express();


const throng = require('throng');
const concurrency = process.env.WEB_CONCURRENCY || 1;


require('./models');

app.use(cookieParser());

require('express-ftwebservice')(app, require('./ftwebserviceOpts'));
require('./routes')(app);

require('./services/db').connect(listen);

function listen() {
	app.listen(port);
}

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


}
