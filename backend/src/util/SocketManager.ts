import debug = require('debug');
import {Server}  from 'socket.io';
import {Server as httpServer} from 'http';
import DataMessage from "./DataMessage";

const socketDebug = debug('socket');

class SocketManager {
    protected io:Server|null;

    constructor () {
        this.io = null;
    }

    public connectToServer(httpServer:httpServer):void {
        socketDebug('Connecting up to the HTTP server');
        this.io = new Server(httpServer);
    }

    public listen():void {
        socketDebug('starting to listen for connections');
        if (this.io) this.io.on('connection', (socket) => {
            socketDebug('Sockets: a user connected');
            socket.on('disconnect', () => {
                socketDebug('Sockets: user disconnected');
            });
            socket.on('message', (msg) => {
                socketDebug("Sockets: Received message " + msg);
                if (this.io) this.io.emit('message', msg);
                socketDebug("Sockets: Sending message " + msg);
            });
        });
    }

    public sendMessage(message:DataMessage):void {
        socketDebug("Sending data " + message);
        if (this.io) this.io.emit('data', JSON.stringify(message));
    }
}

let socketManager = new SocketManager();

//module.exports = socketManager;
export = socketManager;