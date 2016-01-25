'use strict';

const fs = require('fs');
const Promise = require('bluebird');
const join = require('path').join;

const healthFiles = fs.readdirSync(__dirname)
		.filter(file =>  ~file.indexOf('.js') && (file.indexOf('index') === -1));

const checkHealth = (file) => require(join(__dirname, file))();

exports.check = () => {
	return Promise.map(healthFiles, checkHealth);
};
