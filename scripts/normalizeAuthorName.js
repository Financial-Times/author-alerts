'use strict';

const fs = require('fs');
const Base64 = require('js-base64').Base64;
const xml2js = require('xml2js');

const parser = new xml2js.Parser();

const suffix = '-' + Base64.encode('Authors');

const reducer = (tally, item) => {
	let author = {};
	author['authorId'] = Base64.encode(item['id'][0]) + suffix;
	author['authorName'] = item['name'][0];
	tally.push(author);
	return tally;
};

const activeAuthors = (author) => {
	return author['enabled'][0] === 'true';
};

module.exports = (callback) => {
	fs.readFile(__dirname + '/../../Authors.xml', (error, data) => {
		if ( error ) {
			return callback(error);
		}

		parser.parseString(data, (error, result) => {
			let authors = result['authorityFile']['terms'][0]['term'].filter(activeAuthors).reduce(reducer, []);

			return callback(error, authors);
		});
	});
};
