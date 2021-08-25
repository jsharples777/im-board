import debug from 'debug';
import SocketListener from "./SocketListener";
import {ChatReceiver} from "./ChatReceiver";
import {Invitation, InviteType, Message, Priority} from "./Types";

const sDebug = debug('socket-ts');

class SocketManager {
    protected listener:SocketListener|null;
    protected socket:any|null;
    protected chatReceiver:ChatReceiver|null;

    public setChatReceiver(receiver:ChatReceiver):void {
        this.chatReceiver = receiver;
    }


    constructor() {
        this.callbackForMessage = this.callbackForMessage.bind(this);
        this.callbackForData = this.callbackForData.bind(this);
        this.listener = null;
        this.socket = null;
        this.chatReceiver = null;
        this.callbackForMessage = this.callbackForMessage.bind(this);
        this.callbackForLogin = this.callbackForLogin.bind(this);
        this.callbackForLogout = this.callbackForLogout.bind(this);
        this.callbackForJoinRoom = this.callbackForJoinRoom.bind(this);
        this.callbackForExitRoom = this.callbackForExitRoom.bind(this);
        this.callbackForInvite = this.callbackForInvite.bind(this);
        this.callbackForChat = this.callbackForChat.bind(this);
        this.callbackForQueue = this.callbackForQueue.bind(this);
        this.callbackForUserList = this.callbackForUserList.bind(this);
    }

    private callbackForMessage(content:any):void {
        sDebug(`Received message : ${content}`);
        if (this.chatReceiver === null) return;
        try {
            // should be a server side ChatMessage {room, message,user}
            const dataObj = JSON.parse(content);
            this.chatReceiver.receiveMessage(dataObj);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }


    private callbackForLogin(message:any):void {
        sDebug(`Received login : ${message}`);
        if (this.chatReceiver === null) return;
        this.chatReceiver.receiveLogin(message);
    }


    private callbackForUserList(message:any):void {
        sDebug(`Received user list : ${message}`);
        if (this.chatReceiver === null) return;
        this.chatReceiver.receiveUserList(message);
    }

    private callbackForLogout(message:any):void {
        sDebug(`Received logout : ${message}`);
        if (this.chatReceiver === null) return;
        this.chatReceiver.receiveLogout(message);
    }

    private callbackForJoinRoom(data:any):void {
        sDebug(`Received joined room : ${data}`);
        if (this.chatReceiver === null) return;
        try {
            const dataObj = JSON.parse(data);
            sDebug(dataObj);
            this.chatReceiver.receiveJoinedRoom(dataObj);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    private callbackForExitRoom(data:any):void {
        sDebug(`Received left room : ${data}`);
        if (this.chatReceiver === null) return;
        try {
            const dataObj = JSON.parse(data);
            sDebug(dataObj);
            this.chatReceiver.receivedLeftRoom(dataObj);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    private callbackForInvite(data:any):void {
        sDebug(`Received invite : ${data}`);
        if (this.chatReceiver === null) return;
        try {
            const dataObj = JSON.parse(data);
            sDebug(dataObj);
            this.chatReceiver.receiveInvitation(dataObj);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    private callbackForDeclineInvite(data:any):void {
        sDebug(`Received declined invite : ${data}`);
        if (this.chatReceiver === null) return;
        try {
            const dataObj = JSON.parse(data);
            sDebug(dataObj);
            this.chatReceiver.receiveDecline(dataObj.room, dataObj.username);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    private callbackForChat(content:any):void {
        sDebug(`Received chat : ${content}`);
        if (this.chatReceiver === null) return;
        try {
            // should be a server side ChatMessage {room, message,user}
            const dataObj = JSON.parse(content);
            sDebug(dataObj);
            this.chatReceiver.receiveMessage(dataObj);
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    private callbackForQueue(data:any):void {
        sDebug(`Received queued items : ${data}`);
        if (this.chatReceiver === null) return;
        try {
            const dataObj = JSON.parse(data);
            sDebug(dataObj);
            // this object should contain two arrays of invites and messages
            if (dataObj.invites && (dataObj.invites.length > 0)) {
                this.chatReceiver.receiveQueuedInvites(dataObj.invites);
            }
            if (dataObj.messages && (dataObj.messages.length > 0)) {
                this.chatReceiver.receiveQueuedMessages(dataObj.messages);
            }
        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }


    /*
    *
    *  expecting a JSON data object with the following attributes
    *  1.  type: "create"|"update"|"delete"
    *  2.  objectType: string name of the object type changed
    *  3.  data: the new representation of the object
    *  4.  user: application specific id for the user who made the change
    *        - the application view is required to implement getCurrentUser() to compare the user who made the change
    *
     */
    private callbackForData(message:any):void {
        sDebug(`Received data`);
        try {
            const dataObj = JSON.parse(message);
            sDebug(dataObj);
            if (this.listener === null) return;
            if (dataObj.user === this.listener.getCurrentUser()) {
                sDebug("change made by this user, ignoring");
            }
            else {
                sDebug("change made by another user, passing off to the application");
                this.listener.handleDataChangedByAnotherUser(dataObj);
            }

        }
        catch (err) {
            sDebug('Not JSON data');
        }
    }

    public setListener(listener:SocketListener) {
        sDebug('Setting listener');
        this.listener = listener;
        sDebug('Creating socket connection');
        // @ts-ignore
        this.socket = io();
        sDebug('Waiting for messages');
        this.socket.on('message',this.callbackForMessage);
        this.socket.on('data',this.callbackForData);
        this.socket.on('login',this.callbackForLogin);
        this.socket.on('logout',this.callbackForLogout);
        this.socket.on('joinroom',this.callbackForJoinRoom);
        this.socket.on('exitroom',this.callbackForExitRoom);
        this.socket.on('invite',this.callbackForInvite);
        this.socket.on('declineinvite',this.callbackForDeclineInvite);
        this.socket.on('chat',this.callbackForChat);
        this.socket.on('queue',this.callbackForQueue);
        this.socket.on('userlist',this.callbackForUserList);
    }

    public login(username:string): void {
        this.socket.emit('login',{username});
    }

    public logout(username:string):void {
        this.socket.emit('logout',{username});
    }

    public joinChat(username:string, room:string):void {
        this.socket.emit('joinroom',{username,room});
    }

    public leaveChat(username:string, room:string):void {
        this.socket.emit('exitroom', {username,room});
    }

    public sendInvite(from:string, to:string, room:string, type:InviteType = InviteType.ChatRoom, requiresAcceptDecline:boolean = false,subject:string = '') {
        let inviteObj:any = {
            from:from,
            to:to,
            room: room,
            type: type,
            requiresAcceptDecline: requiresAcceptDecline,
            subject:subject
        }
        this.socket.emit('invite', inviteObj);
    }

    public sendMessage(from:string, room:string, message:string,created:number,priority: Priority = Priority.Normal, attachment:any = {}) {
        let messageObj:Message = {
            from: from,
            room: room,
            message:message,
            created:created,
            priority:priority,
            attachment: attachment
        }
        this.socket.emit('chat',messageObj);
    }

    public getUserList() {
        this.socket.emit('userlist');
    }

    public sendDeclineInvite(room:string,from:string) {
        this.socket.emit('declineinvite',{room,from});
    }
}

let socketManager = new SocketManager();
export default socketManager;