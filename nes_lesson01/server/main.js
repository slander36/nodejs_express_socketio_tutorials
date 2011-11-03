/**
 * 
 */

var app = require('express').createServer();
var io = require('socket.io').listen(app);

function start() {
	console.log('Socket server started');
	io.sockets.on('connection', function(socket) {
		socket.emit('welcome',{message:'Welcome, user.'});
	});
	
	app.listen(1337);
};

exports.start = start;