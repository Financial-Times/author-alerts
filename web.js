'use strict';

const fs = require('fs');
const join = require('path').join;
const env = require('./env');
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');

const models = join(__dirname, 'models');
const port = process.env['PORT'] || 4000;
const app = express();

module.exports = app;

fs.readdirSync(models)
	.filter(file => ~file.indexOf('.js'))
	.forEach(file => require(join(models, file)));

app.use(cookieParser());

require('express-ftwebservice')(app, require('./ftwebserviceOpts'));
require('./routes')(app);

/*eslint-disable no-console */
dbConnect()
	.on('error', console.log)
	.on('disconnect', dbConnect)
	.on('open', listen);
/*eslint-enable no-console*/

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

function listen() {
	app.listen(port);
}

