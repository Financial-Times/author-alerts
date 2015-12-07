'use strict';

const express = require('express');
const cookieParser = require('cookie-parser');
const sessionApi = require('./services/session');
const app = express();

app.use(cookieParser());

/*eslint-disable no-console */
app.get('/', (req, res) => {
	let sessionId = req.cookies['FTSession'];
	if ( !sessionId ) {
		res.end('No session id found.');
	}
	sessionApi.getUserData(sessionId)
		.then((userData) => {
			res.end(userData.uuid);
		}).catch((err) => {
			res.end(err.message);
		});
});
/*eslint-enable no-console */

app.listen(process.env['PORT'] || 4000);
