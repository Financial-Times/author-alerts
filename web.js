'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');

const port = process.env['PORT'] || 4000;
const app = express();

module.exports = app;

require('./models');

app.use(cookieParser());

require('express-ftwebservice')(app, require('./ftwebserviceOpts'));
require('./routes')(app);

require('./services/db').connect(listen);

function listen() {
	app.listen(port);
}

