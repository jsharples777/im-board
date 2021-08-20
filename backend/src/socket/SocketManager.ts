       import debug = require('debug');
import {Server}  from 'socket.io';
import {Server as httpServer} from 'http';
import {ChatMessage, ChatRoom, ChatUser, DataMessage, InviteMessage, QueuedMessages} from "./SocketTypes";
import MessageQueueManager from "./MessageQueueManager";
import moment from "moment";

const socketDebug = debug('socket');

class SocketManager {
    protected io:Server|null;
    protected rooms:ChatRoom[] = [];
    protected users:ChatUser[] = [];

    constructor () {
        this.io = null;
    }

    private getUserList(): string[] {
        let results:string[] = [];
        this.users.forEach((user) => {
            results.push(user.username);
        });
        return results;
    }

    public connectToServer(httpServer:httpServer):void {
        socketDebug('Connecting up to the HTTP server');
        this.io = new Server(httpServer);
    }

    protected findUser(username:string):ChatUser|undefined {
        return this.users.find(value => value.username === username);
    }

    protected findUserBySocket(socketId:any):ChatUser|undefined {
        return this.users.find(value => value.socketId === socketId);
    }

    protected removeUserBySocket(socketId:any) {
        let index = this.users.findIndex((value) => value.socketId === socketId);
        if (index >= 0) {
            this.users.splice(index,1);
        }
    }

    protected removeUser(username:any) {
        let index = this.users.findIndex((value) => value.username === username);
        if (index >= 0) {
            this.users.splice(index,1);
        }
    }


    protected login(socketId:any, username:string) {
        // remove all instances of the user from the memory
        let chatUser:ChatUser = {socketId, username};
        this.removeUserFromAllRooms(chatUser);
        this.removeUser(username);

        this.users.push(chatUser);
        // let any other user know
        if (this.io) this.io.emit('login',username);
        return chatUser;
    }

    protected findOrCreateRoom(roomName:string):ChatRoom {
        let index = this.rooms.findIndex((value) => value.name === roomName);
        let room:ChatRoom;
        if (index >= 0) {
            room = this.rooms[index];
        }
        else {
            room = {name:roomName,users:[]};
            this.rooms.push(room);
        }
        return room;
    }

    protected getUserListForRoom(roomName:string):string[] {
        let results:string[] = [];
        let room:ChatRoom = this.findOrCreateRoom(roomName);
        room.users.forEach((user) => {
           results.push(user.username);
        });
        return results;
    }

    protected inviteUserToRoom(inviteFrom:string, inviteTo:string, roomName:string) {
        let receivingUser = this.findUser(inviteTo);
        let inviteMessage:InviteMessage = {
            from: inviteFrom,
            message: `You have been invited to the chat room ${roomName} by ${inviteFrom}`,
            room: roomName,
            created: parseInt(moment().format('YYYMMDDHHmmss'))
        }
        if (receivingUser) {
            this.sendInviteMessageToUser(receivingUser, inviteMessage);
        }
        else {
            MessageQueueManager.getInstance().queueInviteForUser(inviteTo,inviteMessage);

        }
    }

    protected sendInviteMessageToUser(receiver:ChatUser,message:InviteMessage) {
        // is the user offline?
        if (MessageQueueManager.getInstance().isUserLoggedIn(receiver.username)) {
            if (this.io) this.io.to(receiver.socketId).emit('invite', JSON.stringify(message));
        }
        else {
            MessageQueueManager.getInstance().queueInviteForUser(receiver.username,message);
        }
    }

    protected sendQueuedItemsToUser(user:ChatUser,queuedItems:QueuedMessages) {
        if (this.io) this.io.to(user.socketId).emit('queue',JSON.stringify(queuedItems));
    }

    protected createMessageForRoom(author:string, roomName:string, message:string,created:number):ChatMessage|null {
        let sender = this.findUser(author);
        let chatMessage:ChatMessage|null = null;
        if (sender) {
            chatMessage = {
                user:author,
                room: roomName,
                message: message,
                created: created
            };
        }
        return chatMessage;
    }



    protected addUserToRoom (username:string, roomName:string) {
        let user = this.findUser(username);
        if (user) {
            // find the room, create if not already existing
            let room = this.findOrCreateRoom(roomName);
            room.users.push(user);
        }
    }

    protected removeUserFromRoom(user:ChatUser, room:ChatRoom): void {
        let index = room.users.findIndex((value) => value.username === user.username);
        if (index >= 0) {
            room.users.splice(index,1);
        }
    }

    protected removeUserFromAllRooms(user:ChatUser):void {
        this.rooms.forEach((room) => {
            this.removeUserFromRoom(user, room);
        });
    }

    protected logout(socketId:any):ChatUser|undefined {
        // remove the user, but first exit them from rooms they are currently in
        let user = this.findUserBySocket(socketId);
        if (user) {
            socketDebug(`logging out user ${user.username} - tidying up users and rooms`);
            // remove the user from any rooms they are currently in
            this.removeUserBySocket(socketId);
            this.removeUserFromAllRooms(user);
            if (this.io) this.io.emit('logout',user.username);
        }
        return user;
    }


    public listen():void {
        socketDebug('starting to listen for connections');
        if (this.io) this.io.on('connection', (socket) => {
            socketDebug('a user connected');
            socket.on('disconnect', () => {
                // remove the user from being logged in and any rooms they are in
                let user:ChatUser|undefined = this.logout(socket.id);
                if (user) {
                    MessageQueueManager.getInstance().setUserHasLoggedOut(user.username);
                }
                socketDebug('user disconnected');
            });
            socket.on('login', ({username}) => {
                socketDebug(`Received login for ${username}`);
                // store the connected user
                let user:ChatUser = this.login(socket.id,username);
                let queuedItems:QueuedMessages|null = MessageQueueManager.getInstance().setUserHasLoggedInAndReturnQueuedItems(user.username);
                // send queued items, if we have any
                if (queuedItems && ((queuedItems.invites.length > 0) || (queuedItems.messages.length > 0))) {
                   this.sendQueuedItemsToUser(user, queuedItems);
                }
            });
            socket.on('logout', ({username}) => {
                socketDebug(`Received logout for ${username}`);
                // store the connected user
                let user:ChatUser|undefined = this.logout(socket.id);
                if (user) {
                    MessageQueueManager.getInstance().setUserHasLoggedOut(user.username);
                }
            });
            socket.on('joinroom', ({username,room}) => {
                socketDebug(`${username} joining room ${room} `);
                this.addUserToRoom(username,room);
                let userList:string[] = this.getUserListForRoom(room);
                if (this.io) this.io.to(room).emit(JSON.stringify({username:username,room: room,userList:userList}));
            });
            socket.on('exitroom', ({username,room}) => {
                socketDebug(`${username} joining room ${room} `);
                this.removeUserFromRoom(username,room);
                let userList:string[] = this.getUserListForRoom(room);
                if (this.io) this.io.to(JSON.stringify({username:username,room: room,userList:userList}));
            });
            socket.on('invite', ({from, to, room}) => {
                socketDebug(`${from} has sent an invitation to join room ${room} to ${to}`);
                this.inviteUserToRoom(from, to, room);
            });
            socket.on('chat', ({from, room, message,created}) => {
                socketDebug(`${from} has sent a message to room ${room}: ${message}`);
                // send the message to the rest of the room
                let cMessage = this.createMessageForRoom(from, room, message,created);
                if (cMessage) {
                    socket.to(room).emit('chat',JSON.stringify(cMessage));
                    // check for offline users and queue their messages
                    this.queueMessagesForOfflineRoomUsers(cMessage);
                }
            });
            socket.on('userlist', () => {
                // return the list of who is logged in
                socketDebug(`requesting current user list`);
                let userList:string[] = this.getUserList();
                if (this.io) this.io.to(socket.id).emit('userlist',userList);
            });
        });
    }

    protected queueMessagesForOfflineRoomUsers(message:ChatMessage):void {
        let room = this.findOrCreateRoom(message.room);
        room.users.forEach((user) => {
            if (!MessageQueueManager.getInstance().isUserLoggedIn(user.username)) {
                MessageQueueManager.getInstance().queueMessageForUser(user.username,message);
            }
        });
    }

    public sendDataMessage(message:DataMessage):void {
        socketDebug("Sending data " + message);
        if (this.io) this.io.emit('data', JSON.stringify(message));
    }
}

let socketManager = new SocketManager();

//module.exports = socketManager;
export = socketManager;