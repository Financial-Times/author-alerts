'use strict';

const controllers = require('../controllers');

module.exports = (app) => {
	app.get('/follow', controllers.validate, controllers.follow);
	app.get('/unfollow', controllers.validate, controllers.unfollow);
	app.get('/users', controllers.users);
};
