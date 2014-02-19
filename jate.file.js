'use strict';

var jate = require('./jate.js');
var fs = require('fs');
var path = require('path');

jate.cache = {};
jate.usecache = true;

jate.file = function(filename, _opts) {
	var opts = {};
	for (var p in jate.file.default)
		opts[p] = jate.file.default[p];
	for (p in _opts)
		opts[p] = _opts[p];

	filename = path.normalize(filename);

	opts.file = filename;

	if (jate.usecache && jate.cache[filename]) {
		return jate.cache[filename];
	} else {
		var tpl = fs.readFileSync(filename, {
			encoding: 'utf8'
		});
		return jate.cache[filename] = jate(tpl, opts);
	}
};

jate.file.default = {
	error: function(errors, opts) {
		delete errors.template;
		delete errors.translation;
		errors.file = opts.file;
		throw errors;
	},

	warn: function(errors, opts) {
		delete errors.template;
		delete errors.translation;
		errors.file = opts.file;
		console.warn(errors);
	}
};

jate.renderfile = function(filename, data) {
	return jate.file(filename)(data);
};

module.exports = jate;