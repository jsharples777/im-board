import debug from 'debug';
import moment from "moment";

import {ChatReceiver, Invitation, JoinLeft, Message} from "./ChatReceiver";
import {ChatEmitter} from "./ChatEmitter";
import {StateManager} from "../state/StateManager";
import BrowserStorageStateManager from "../state/BrowserStorageStateManager";
import socketManager from "./SocketManager";
import {ChatEventListener} from "./ChatEventListener";
import uuid from "../util/UUID";

export type ChatLog = {
    roomName: string,
    users: string[],
    messages: Message[],
    lastViewed: number,
    numOfNewMessages: number
}

enum UserStatus {
    LoggedOut,
    LoggedIn
}

const cmLogger = debug('chat-manager');

export class ChatManager implements ChatReceiver,ChatEmitter {
    private static _instance: ChatManager;

    public static getInstance(): ChatManager {
        if (!(ChatManager._instance)) {
            ChatManager._instance = new ChatManager();
        }
        return ChatManager._instance;
    }

    // TO DO chat logs, blocked list, favourites per user
    protected chatLogs: ChatLog[];
    protected localStorage:StateManager;
    private static chatLogKey = 'im-board-chat-logs';
    private currentUsername = '';
    protected blockedList: string[] = [];
    private static blockedListKey = 'im-board-blocked-list';
    protected favouriteList: string[] = [];
    private static favouriteListKey = 'im-board-favourite-list';


    protected loggedInUsers: string[] = [];


    protected chatListener:ChatEventListener|null;

    public setChatEventHandler(receiver:ChatEventListener):void {
        this.chatListener = receiver;
    }


    private constructor() {
        cmLogger('Setting up chat logs, blocked list, and favourites');

        this.chatLogs = [];
        this.chatListener = null;
        this.localStorage = new BrowserStorageStateManager(true);
        // load previous logs
        let savedLogs = this.localStorage.getStateByName(ChatManager.chatLogKey);
        cmLogger(savedLogs);
        if (savedLogs) {
            this.chatLogs = savedLogs;
        }

        // load previous blocked list
        let blockedList = this.localStorage.getStateByName(ChatManager.blockedListKey);
        cmLogger(blockedList);
        if (blockedList) {
            this.blockedList = blockedList;
        }

        // load previous favourite list
        let favouriteList = this.localStorage.getStateByName(ChatManager.favouriteListKey);
        cmLogger(favouriteList);
        if (favouriteList) {
            this.favouriteList = favouriteList;
        }

        // connect to the socket manager
        socketManager.setChatReceiver(this);

        // bind the receiver methods
        this.receiveLogin = this.receiveLogin.bind(this);
        this.receiveLogout = this.receiveLogout.bind(this);
        this.receiveInvitation = this.receiveInvitation.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.receiveQueuedMessages = this.receiveQueuedMessages.bind(this);
        this.receiveQueuedInvites = this.receiveQueuedInvites.bind(this);
        this.receiveJoinedRoom = this.receiveJoinedRoom.bind(this);
        this.receivedLeftRoom = this.receivedLeftRoom.bind(this);
    }

    receiveUserList(users: string[]): void {
        this.loggedInUsers = users;
    }

    private saveLogs():void {
        this.localStorage.setStateByName(ChatManager.chatLogKey,this.chatLogs,false);
    }

    private saveBlockedList():void {
        this.localStorage.setStateByName(ChatManager.blockedListKey,this.blockedList, false);
    }

    private saveFavouriteList():void {
        this.localStorage.setStateByName(ChatManager.favouriteListKey,this.favouriteList, false);
    }

    public addUserToBlockedList(username:string):void {
        let index = this.blockedList.findIndex((blocked) => blocked === username);
        if (index < 0) {
            this.blockedList.push(username);
            this.saveBlockedList();
        }
    }

    public removeUserFromBlockedList(username:string):void {
        let index = this.blockedList.findIndex((blocked) => blocked === username);
        if (index >= 0) {
            this.blockedList.splice(index,1);
            this.saveBlockedList();
        }

    }

    public isUserInBlockedList(username:string):boolean {
        return (this.blockedList.findIndex((blocked) => blocked === username) >= 0);
    }


    public addUserToFavouriteList(username:string):void {
        let index = this.favouriteList.findIndex((favourite) => favourite === username);
        if (index < 0) {
            this.favouriteList.push(username);
            this.saveFavouriteList();
        }
    }

    public removeUserFromFavouriteList(username:string):void {
        let index = this.favouriteList.findIndex((blocked) => blocked === username);
        if (index >= 0) {
            this.favouriteList.splice(index,1);
            this.saveFavouriteList();
        }

    }

    public isUserInFavouriteList(username:string):boolean {
        return (this.favouriteList.findIndex((blocked) => blocked === username) >= 0);
    }


    public setCurrentUser(username:string):void {
        cmLogger(`Setting current user ${username}`);
        this.currentUsername = username;
    }

    public getCurrentUser():string {
        return this.currentUsername;
    }

    private ensureChatLogExists(room:string):ChatLog {
        let log:ChatLog;
        let index = this.chatLogs.findIndex((log) => log.roomName === room);
        if (index < 0) {
            log = {
                roomName: room,
                users: [this.getCurrentUser()],
                messages: [],
                lastViewed: parseInt(moment().format('YYYYMMDDHHmmss')),
                numOfNewMessages: 0
            }
            this.chatLogs.push(log);
            this.saveLogs();
        }
        else {
            log = this.chatLogs[index];
        }
        return log;
    }


    receiveJoinedRoom(users: JoinLeft): void {
        // we get this for all changes to a room, if the username is us can safely ignore
        if (users.username === this.currentUsername) return;

        this.ensureChatLogExists(users.room);

        let index = this.chatLogs.findIndex((log) => log.roomName === users.room);
        if (index >= 0) {
            cmLogger(`User list for room ${users.room} - ${users.userList.join(',')}`);
            let log = this.chatLogs[index];
            log.users = users.userList;
            this.saveLogs();

        }
    }

    receivedLeftRoom(users: JoinLeft): void {
        this.receiveJoinedRoom(users);
    }

    receiveInvitation(invite: Invitation): void {
        //  unless we are receiving an invite from someone in our blocked list, we automatically accept this invite
        if (!this.isUserInBlockedList(invite.from)) {
            this.ensureChatLogExists(invite.room);
            cmLogger(`Joining chat ${invite.room}`);
            cmLogger(invite);
            socketManager.joinChat(this.getCurrentUser(),invite.room)
        }
        else {
            cmLogger(`User ${invite.from} blocked`);
        }
    }


    receiveLogin(username: string): void {
        // keep track of the logged in users
        let index = this.loggedInUsers.findIndex((user) => user === username);
        if (index < 0) this.loggedInUsers.push(username);

        if (this.chatListener) this.chatListener.handleLoggedInUsersUpdated(this.loggedInUsers);

        // if the user in in favourites and not in blocked list passing this on to the listener
        if (!this.isUserInBlockedList(username) && this.isUserInFavouriteList(username)) {
            cmLogger(`User ${username} logging in`);
            if (this.chatListener) this.chatListener.handleFavouriteUserLoggedIn(username);
        }
    }

    receiveLogout(username: string): void {
        let index = this.loggedInUsers.findIndex((user) => user === username);
        if (index >= 0) this.loggedInUsers.splice(index,1);

        if (this.chatListener) this.chatListener.handleLoggedInUsersUpdated(this.loggedInUsers);

        // if the user in in favourites and not in blocked list passing this on to the listener
        if (!this.isUserInBlockedList(username) && this.isUserInFavouriteList(username)) {
            cmLogger(`User ${username} logging out`);
            if (this.chatListener) this.chatListener.handleFavouriteUserLoggedOut(username);
        }
    }

    private addMessageToChatLog(log:ChatLog, message:Message) {
        log.numOfNewMessages ++;
        log.messages.push(message);
        if (message.from === this.getCurrentUser()) {
            this.touchChatLog(log.roomName); // this will also save the logs
        }
        else {
            this.saveLogs();
        }
    }

    public touchChatLog(room:string):void {
        let chatLog = this.ensureChatLogExists(room);
        chatLog.numOfNewMessages = 0;
        chatLog.lastViewed = parseInt(moment().format('YYYYMMDDHHmmss'));
        this.saveLogs();
    }

    receiveMessage(message: Message): void {
        // double check the message is not from us somehow
        if (message.from === this.getCurrentUser()) return;

        // ok, so we need to add the message to the chat log, increase the new message count, save the logs and pass it on
        let chatLog = this.ensureChatLogExists(message.room);
        this.addMessageToChatLog(chatLog,message);
        cmLogger(`Message received`);
        cmLogger(message);

        if (this.chatListener) this.chatListener.handleChatLogUpdated(chatLog);
    }

    receiveQueuedInvites(invites: any): void {
        // just loop through and process each invite
        invites.forEach((invite:Invitation) => {
            this.receiveInvitation(invite);
        });
    }

    receiveQueuedMessages(messages: any): void {
        // just loop through a process each message
        messages.forEach((message:Message) => {
           this.receiveMessage(message)
        });
    }

    joinChat(room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        this.ensureChatLogExists(room);
        socketManager.joinChat(this.getCurrentUser(),room);
    }

    leaveChat(room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        // this.removeChatLog(room);  // leave the chat log for now (essentially history)
        socketManager.leaveChat(this.getCurrentUser(),room);
    }

    login(): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        socketManager.login(this.getCurrentUser());
        // get the current user list
        socketManager.getUserList();
        // setup a default room for the user
        //socketManager.joinChat(this.getCurrentUser(),uuid.getUniqueId());
    }

    logout(): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        socketManager.logout(this.getCurrentUser());
    }

    sendInvite(to: string, room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        // can't accidentally send an invite to blacklisted
        if (this.isUserInBlockedList(to)) return;
        socketManager.sendInvite(this.getCurrentUser(),to, room);
    }

    sendMessage(room: string, content: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        let log = this.ensureChatLogExists(room);
        // send the message
        let created = parseInt(moment().format('YYYYMMDDHHmmss'));
        socketManager.sendMessage(this.getCurrentUser(),room, content, created);

        // add the message to the chat log
        let sent:Message = {
            from:this.getCurrentUser(),
            room: room,
            message: content,
            created: created
        }
        this.addMessageToChatLog(log, sent);
    }

    public getChatLogs():ChatLog[] {
        return this.chatLogs;
    }
}
