'use strict';

const controllers = require('../controllers');

module.exports = (app) => {
	app.get('/follow',
		controllers.validateSession,
		controllers.validateParams,
		controllers.follow);
	app.get('/unfollow',
		controllers.validateSession,
		controllers.validateParams,
		controllers.unfollow);
	app.get('/updateBulk',
		controllers.validateSession,
		controllers.validateParams,
		controllers.updateBulk);
	app.get('/unfollowall',
		controllers.validateSession,
		controllers.unfollowAll);
	app.get('/users', controllers.users);
	app.get('/subscriptions',
		controllers.validateSession,
		controllers.subscriptions);
};
