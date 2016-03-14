'use strict';

module.exports = (state) => {
	const express = require('express');
	const cookieParser = require('cookie-parser');

	const app = express();

	require('./models');

	app.use(cookieParser());
	app.use((req, res, next) => {
		res.setHeader('Cache-Control', 'no-cache');
		return next();
	});

	if ( state.ftWebserviceOpts ) {
		require('express-ftwebservice')(app, state.ftWebserviceOpts);
	}

	require('./routes')(app);

	require('./services/db').connect(listen);

	function listen() {
		app.listen(state.port);
	}
	return app;
};


