"use strict";
const debug = require("debug");
const socket_io_1 = require("socket.io");
const socketDebug = debug('socket');
class SocketManager {
    constructor() {
        this.io = null;
    }
    connectToServer(httpServer) {
        socketDebug('Connecting up to the HTTP server');
        this.io = new socket_io_1.Server(httpServer);
    }
    listen() {
        socketDebug('starting to listen for connections');
        if (this.io)
            this.io.on('connection', (socket) => {
                socketDebug('Sockets: a user connected');
                socket.on('disconnect', () => {
                    socketDebug('Sockets: user disconnected');
                });
                socket.on('message', (msg) => {
                    socketDebug("Sockets: Received message " + msg);
                    if (this.io)
                        this.io.emit('message', msg);
                    socketDebug("Sockets: Sending message " + msg);
                });
            });
    }
    sendMessage(message) {
        socketDebug("Sending data " + message);
        if (this.io)
            this.io.emit('data', JSON.stringify(message));
    }
}
let socketManager = new SocketManager();
module.exports = socketManager;
//# sourceMappingURL=SocketManager.js.map