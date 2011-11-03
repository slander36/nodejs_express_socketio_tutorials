/**
 * 
 */

var app = require('express').createServer();
var io = require('socket.io').listen(app);
var fs = require('fs');

function start() {
	console.log('Server started');
	io.sockets.on('connection', function(socket) {
		socket.emit('welcome',{message:'Welcome, user.'});
	});
	
	app.get('*',function(req,res) {
		fs.readFile('./www/index.html',function(err,buffer) {
			res.write(buffer.toString());
		});
	});
	
	app.listen(1337);
};

exports.start = start;