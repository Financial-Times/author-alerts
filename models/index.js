'use strict';

const fs = require('fs');
const join = require('path').join;

fs.readdirSync(__dirname)
	.filter(file =>  ~file.indexOf('.js') && (file.indexOf('index') === -1))
	.forEach(file => require(join(__dirname, file)));
