// npm install esprima/jshint/jslint before turn on debug
var debug = true;

var http = require('http');
var jate = require(debug ? '../jate.esprima' : '../jate'); // debug options: jate.esprima, jate.jshint, jate.jslint
jate.usecache = !debug;

http.createServer(function(req, res) {
	console.log(req.url);
	res.setHeader('Content-Type', 'text/html');

	res.end(jate.file(__dirname + '/node.jate')({
		title: "JATE Ain't a Template Engine",
		url: 'https://github.com/fenivana/jate'
	}));

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');