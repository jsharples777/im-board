/// <reference types="node" />
import { Server } from 'socket.io';
import { Server as httpServer } from 'http';
import DataMessage from "./DataMessage";
declare class SocketManager {
    protected io: Server | null;
    constructor();
    connectToServer(httpServer: httpServer): void;
    listen(): void;
    sendMessage(message: DataMessage): void;
}
declare let socketManager: SocketManager;
export = socketManager;
