/**
 * Socket.io configuration
 */

'use strict';

var _ = require('lodash');

// When the user disconnects.. perform this
function onDisconnect(socket) {

}

// When the user connects.. perform this
function onConnect(socket) {
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });
}

module.exports = function (socketio) {
    socketio.on('connection', function (socket) {
        console.log(socket.client.id);
        socket.address = socket.handshake.address !== null ?
        socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

        socket.connectedAt = new Date();

        // Call onDisconnect.
        socket.on('disconnect', function () {
            onDisconnect(socket);
            console.info('[%s] DISCONNECTED', socket.address);
        });

        // Call onConnect.
        onConnect(socket);
        console.info('[%s] CONNECTED', socket.address);
    });
};