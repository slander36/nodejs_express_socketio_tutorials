/**
 * 
 */

var app = require('express').createServer();
var fs = require('fs');

function start() {
	console.log('Client server started');
	app.get('*',function(req,res) {
		fs.readFile('./www/index.html',function(err,buffer) {
			res.send(buffer.toString());
		});
	});
	
	app.listen(1338);
};

exports.start = start;