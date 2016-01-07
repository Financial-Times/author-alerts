'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Article = new Schema({
	_id: String,
	title: String,
	url: String,
	publishDate: Date,
	summary: String
});

const AuthorSchema = new Schema({
	_id: String,
	articles: [Article]
});

AuthorSchema.set('versionKey', false);
mongoose.model('Author', AuthorSchema);
