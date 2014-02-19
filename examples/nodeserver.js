// npm install esprima/jshint/jslint before turn on DEBUG
var DEBUG = true;

var http = require('http');
var jate = require(DEBUG ? '../jate.esprima' : '../jate'); // debug options: jate.esprima, jate.jshint, jate.jslint
jate.usecache = !DEBUG;

http.createServer(function (req, res) {
	console.log(req.url);
	res.writeHead(200, {'Content-Type': 'text/html'});

	res.end(jate.renderfile(__dirname + '/node.jate', {
		title: "JATE Ain't a Template Engine",
		url: 'https://github.com/fenivana/jate'
	}));

}).listen(1337, '127.0.0.1');

console.log('Server running at http://127.0.0.1:1337/');
