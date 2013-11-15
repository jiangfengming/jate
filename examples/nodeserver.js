// npm install esprima/jshint/jslint before turn on DEBUG
var DEBUG = false;

var http = require('http');

http.createServer(function (req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	var jate = require('../jate.js');
	if (DEBUG) {
		// optional: jate.esprima.js, jate.jshint.js, jate.jslint.js
		require('../jate.esprima.js');
	}

	var fs = require('fs');
	fs.readFile('./node.jate', {encoding: 'utf8'}, function (err, data) {
		tmpfn = jate(data);
		res.end(tmpfn({
			title: "JATE Ain't a Template Engine",
			url: 'https://github.com/fenivana/jate'
		}));
	});
}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
