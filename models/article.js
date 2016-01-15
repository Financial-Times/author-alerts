'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
	articleId: {type: String, index: true},
	title: String,
	url: String,
	publishDate: {type: Date, index: true},
	summary: String,
	authorId: {type: String, index: true}
});

ArticleSchema.set('versionKey', false);
mongoose.model('Article', ArticleSchema);
