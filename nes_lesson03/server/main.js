/**
 * 
 */

// Create an Express app
var app = require('express').createServer();
// Create a socket listener for the app
var io = require('socket.io').listen(app);
// Initialize a file system
var fs = require('fs');

var webRoot = './www';

var users = [];

// Module's start function
function start() {
	console.log('Server started');
	io.sockets.on('connection', function(socket) {
		socket.userIndex = users.length;
		users.push(socket);
		socket.emit('welcome',{message:'Welcome, user.'});
		socket.on('message',function(e) {
			message(socket,e);
		});
		
		socket.on('setName',function(e) {
			socket.userName = e.name;
			hasJoined(socket);
			socket.emit('getName',{name:socket.userName});
		});
		
		socket.on('disconnect',function() {
			removeUser(socket.userIndex);
		});
	});
	
	function hasJoined(socket) {
		for(i in users) {
			if(users[i] != socket) {
				users[i].emit('hasJoined',{name:socket.userName});
			}
		}
	}
	
	function hasLeft(socket) {
		for(i in users) {
			if(users[i] != socket) {
				users[i].emit('hasLeft',{name:socket.userName});
			}
		}
	}
	
	function message(socket,e) {
		var message = socket.userName+" says: "+e.message;
		for(i in users) {
			users[i].emit('message',{message:message});
		}
	}
	
	function removeUser(i) {
		if(users[i].userName) {
			hasLeft(users[i]);
		}
		console.log('Removed user '+i);
		users.splice(i,1);
	}
	
	// Any html request now grabs the page and sends it to the user
	app.get('*.html',function(req,res) {
		var page = req.originalUrl;
		page = webRoot+page;
		fs.readFile(page,function(err,buffer) {
			if(err && err.errno == 32) {
				fs.readFile(webRoot+'/404.html',function(err,buffer) {
					if(err && err.errno == 32) {
						res.send('404 Page Not Found');
					} else {
						res.send(buffer.toString());
					}
				});
			} else {
				res.send(buffer.toString());
			}
		});
	});
	
	app.get('/',function(req,res) {
		fs.readFile(webRoot+'/index.html',function(err,buffer) {
			res.send(buffer.toString());
		});
	});
	
	app.get('*.css',function(req,res) {
		var style = req.originalUrl;
		var style = webRoot+style;
		fs.readFile(style,function(err,buffer) {
			if(!err)
				res.send(buffer.toString());
		});
	});
	
	app.get('*.js',function(req,res) {
		var js = req.originalUrl;
		js = webRoot+js;
		console.log(js);
		fs.readFile(js,function(err,buffer) {
			if(!err)
				res.send(buffer.toString());
		});
	});
	
	app.listen(1337);
};

exports.start = start;