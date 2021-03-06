var express = require('express');
var app = express();
var morgan = require('morgan');
var config = require('./config/config');
var client = require('twilio')(config.twilio.accountSid, config.twilio.authToken);

// set port
var port = process.env.PORT || 3001;

var server = require('http').createServer(app);

var socketio = require('socket.io')(server, {
	path: '/rtc/socket.io-client'
});

require('./config/socketio')(socketio, app);

// use morgan to log requests to the console
app.use(morgan('dev'));

require('./config/express')(app);

app.post('/api/webrtc', function (req, res) {
	socketio.sockets.emit('webrtc:save', req.body);
	return res.status(201).json(req.body)
});

app.get('/api/turn', function(req, res) {
	client.tokens.create({}, function(err, token) {
		return res.status(200).json(token.iceServers);
	});
});

app.get('/', function(request, response) {
	response.send('Hello World!');
});

server.listen(port, function () {
	console.log('FC WebRTC server listening on port: ', port);
});

require('./Signaling-Server.js')(server, function(socket) {
	try {
		var params = socket.handshake.query;

		// "socket" object is totally in your own hands!
		// do whatever you want!

		// in your HTML page, you can access socket as following:
		// connection.socketCustomEvent = 'custom-message';
		// var socket = connection.getSocket();
		// socket.emit(connection.socketCustomEvent, { test: true });

		if (!params.socketCustomEvent) {
			params.socketCustomEvent = 'custom-message';
		}

		socket.on(params.socketCustomEvent, function(message) {
			try {
				socket.broadcast.emit(params.socketCustomEvent, message);
			} catch (e) {}
		});
	} catch (e) {}
});


