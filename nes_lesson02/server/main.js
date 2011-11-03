/**
 * 
 */

// Create an Express app
var app = require('express').createServer();
// Create a socket listener for the app
var io = require('socket.io').listen(app);
// Initialize a file system
var fs = require('fs');

// Module's start function
function start() {
	// send server console (terminal) a message
	console.log('Server started');
	// Initialize sockets. On being sent 'connection' from a client
	// it will grab the client's information and send them back
	// the 'welcome' message (see index.html for the other side
	// of the equation
	io.sockets.on('connection', function(socket) {
		socket.emit('welcome',{message:'Welcome, user.'});
		// Tells this socket that whenever `message` is sent to it
		// it should take the contents and send it back to the client
		// after adding `You said:` to the front of the message
		socket.on('message',function(e) {
			var message = "You said:<br/>"+e.message;
			socket.emit('message',{message:message});
		});
	});
	
	// Tell the app that any request it gets from the user should
	// respond the same
	app.get('*',function(req,res) {
		// The file system will read index.html and send the file's
		// contents back as a string
		fs.readFile('./www/index.html',function(err,buffer) {
			res.send(buffer.toString());
		});
	});
	
	// Tell the app to use port 1337 to listen for any calls, whether
	// it be web page requests or socket requests
	app.listen(1337);
};

// Let other parts of Node.js know this is a module with a name
// This is how we let server.js know how to grab this module!
exports.start = start;