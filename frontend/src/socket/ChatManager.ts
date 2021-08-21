import debug from 'debug';
import moment from "moment";

import {ChatReceiver, Invitation, JoinLeft, Message} from "./ChatReceiver";
import {ChatEmitter} from "./ChatEmitter";
import {StateManager} from "../state/StateManager";
import BrowserStorageStateManager from "../state/BrowserStorageStateManager";
import socketManager from "./SocketManager";
import {ChatEventListener, ChatUserEventListener} from "./ChatEventListener";
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


    protected chatListeners:ChatEventListener[];
    protected chatUserListeners:ChatUserEventListener[];

    public addChatEventHandler(receiver:ChatEventListener):void {
        this.chatListeners.push(receiver);
    }

    public addChatUserEventHandler(receiver:ChatUserEventListener):void {
        this.chatUserListeners.push(receiver);
    }

    private constructor() {
        cmLogger('Setting up chat logs, blocked list, and favourites');

        this.chatLogs = [];
        this.chatListeners = [];
        this.chatUserListeners = [];
        this.localStorage = new BrowserStorageStateManager(true);

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

    public isUserLoggedIn(username:string) {
        return (this.loggedInUsers.findIndex((name) => name === username) >= 0);
    }

    receiveUserList(users: string[]): void {
        this.loggedInUsers = users;
        this.chatUserListeners.forEach((listener) => listener.handleLoggedInUsersUpdated(users));
    }

    private saveLogs():void {
        this.localStorage.setStateByName(ChatManager.chatLogKey+this.currentUsername,this.chatLogs,false);
    }

    private saveBlockedList():void {
        this.localStorage.setStateByName(ChatManager.blockedListKey+this.currentUsername,this.blockedList, false);
    }

    private saveFavouriteList():void {
        this.localStorage.setStateByName(ChatManager.favouriteListKey+this.currentUsername,this.favouriteList, false);
    }

    public addUserToBlockedList(username:string):void {
        let index = this.blockedList.findIndex((blocked) => blocked === username);
        if (index < 0) {
            this.blockedList.push(username);
            this.saveBlockedList();
            this.chatUserListeners.forEach((listener) => listener.handleBlockedUsersChanged(this.favouriteList));
        }
    }

    public removeUserFromBlockedList(username:string):void {
        let index = this.blockedList.findIndex((blocked) => blocked === username);
        if (index >= 0) {
            this.blockedList.splice(index,1);
            this.saveBlockedList();
            this.chatUserListeners.forEach((listener) => listener.handleBlockedUsersChanged(this.favouriteList));
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
            this.chatUserListeners.forEach((listener) => listener.handleFavouriteUsersChanged(this.favouriteList));
        }
    }

    public removeUserFromFavouriteList(username:string):void {
        let index = this.favouriteList.findIndex((blocked) => blocked === username);
        if (index >= 0) {
            this.favouriteList.splice(index,1);
            this.saveFavouriteList();
            this.chatUserListeners.forEach((listener) => listener.handleFavouriteUsersChanged(this.favouriteList));
        }

    }

    public isUserInFavouriteList(username:string):boolean {
        return (this.favouriteList.findIndex((user) => user === username) >= 0);
    }

    public getFavouriteUserList():string[] {
        return [...this.favouriteList];
    }

    public getBlockedUserList():string[] {
        return [...this.blockedList];
    }


    public setCurrentUser(username:string):void {
        cmLogger(`Setting current user ${username}`);
        this.currentUsername = username;
        // load previous logs
        let savedLogs = this.localStorage.getStateByName(ChatManager.chatLogKey+this.currentUsername);
        cmLogger(savedLogs);
        if (savedLogs) {
            this.chatLogs = savedLogs;
        }

        // load previous blocked list
        let blockedList = this.localStorage.getStateByName(ChatManager.blockedListKey+this.currentUsername);
        cmLogger(blockedList);
        if (blockedList) {
            this.blockedList = blockedList;
        }

        // load previous favourite list
        let favouriteList = this.localStorage.getStateByName(ChatManager.favouriteListKey+this.currentUsername);
        cmLogger(favouriteList);
        if (favouriteList) {
            this.favouriteList = favouriteList;
        }

        this.chatListeners.forEach((listener) => listener.handleChatLogsUpdated());


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

    private ensureChatLogExistsWithUser(username:string):ChatLog {
        let foundLog:ChatLog|null = null;
        let index = 0;
        while (index < this.chatLogs.length) {
            let log = this.chatLogs[index];
            if (log.users.length === 2) {
                // is the username in the two of this room?
                if (log.users.findIndex((value) => value === username) >= 0) {
                    foundLog = log;
                    index = this.chatLogs.length;
                }
            }
            index++;
        }
        if (!foundLog) {
            foundLog = {
                roomName: uuid.getUniqueId(),
                users: [this.getCurrentUser(),username],
                messages: [],
                lastViewed: parseInt(moment().format('YYYYMMDDHHmmss')),
                numOfNewMessages: 0
            }
            this.chatLogs.push(foundLog);
            this.saveLogs();
        }
        return foundLog;
    }


    receiveJoinedRoom(users: JoinLeft): void {
        // we get this for all changes to a room, if the username is us can safely ignore
        if (users.username === this.currentUsername) return;

        let log:ChatLog = this.ensureChatLogExists(users.room);

        cmLogger(`User list for room ${users.room} - ${users.userList.join(',')}`);
        log.users = users.userList;
        // add a "message" for joined user
        let created = parseInt(moment().format('YYYYMMDDHHmmss'));
        const joinDateTime = moment().format('DD/MM/YYYY HH:mm');
        let message:Message = {
            from:'',
            created: created,
            room: users.room,
            priority: 0,
            message: `${users.username} joined the chat on ${joinDateTime}`
        }
        log.messages.push(message);
        this.saveLogs();

        this.chatListeners.forEach((listener) => listener.handleChatLogUpdated(log,false));
    }

    receivedLeftRoom(users: JoinLeft): void {
        // we get this for all changes to a room, if the username is us can safely ignore
        if (users.username === this.currentUsername) return;

        let log:ChatLog = this.ensureChatLogExists(users.room);

        cmLogger(`User list for room ${users.room} - ${users.userList.join(',')}`);
        log.users = users.userList;
        // add a "message" for joined user
        let created = parseInt(moment().format('YYYYMMDDHHmmss'));
        const joinDateTime = moment().format('DD/MM/YYYY HH:mm');
        let message:Message = {
            from:'',
            created: created,
            room: users.room,
            priority: 0,
            message: `${users.username} left the chat on ${joinDateTime}`
        }
        log.messages.push(message);
        this.saveLogs();

        this.chatListeners.forEach((listener) => listener.handleChatLogUpdated(log,false));
    }

    receiveInvitation(invite: Invitation): void {
        //  unless we are receiving an invite from someone in our blocked list, we automatically accept this invite
        if (!this.isUserInBlockedList(invite.from)) {
            let chatLog:ChatLog = this.ensureChatLogExists(invite.room);
            // add the inviter to the user list for the room, if not already added
            if ((chatLog.users.findIndex((user) => user === invite.from)) < 0) chatLog.users.push(invite.from);

            this.saveLogs();
            cmLogger(`Joining chat ${invite.room}`);
            cmLogger(invite);
            socketManager.joinChat(this.getCurrentUser(),invite.room);
            this.chatListeners.forEach((listener) => listener.handleChatLogsUpdated());

        }
        else {
            cmLogger(`User ${invite.from} blocked`);
        }
    }


    receiveLogin(username: string): void {
        cmLogger(`Handle login received for ${username}`);
        // keep track of the logged in users
        let index = this.loggedInUsers.findIndex((user) => user === username);
        if (index < 0) this.loggedInUsers.push(username);
        cmLogger(this.loggedInUsers);

        this.chatUserListeners.forEach((listener) => listener.handleLoggedInUsersUpdated(this.loggedInUsers));

        // if the user in in favourites and not in blocked list passing this on to the listener
        if (!this.isUserInBlockedList(username) && this.isUserInFavouriteList(username)) {
            cmLogger(`User ${username} logging in`);
            this.chatUserListeners.forEach((listener) => listener.handleFavouriteUserLoggedIn(username));
        }
    }

    receiveLogout(username: string): void {
        let index = this.loggedInUsers.findIndex((user) => user === username);
        if (index >= 0) this.loggedInUsers.splice(index,1);

        this.chatUserListeners.forEach((listener) => listener.handleLoggedInUsersUpdated(this.loggedInUsers));

        // if the user in in favourites and not in blocked list passing this on to the listener
        if (!this.isUserInBlockedList(username) && this.isUserInFavouriteList(username)) {
            cmLogger(`User ${username} logging out`);
            this.chatUserListeners.forEach((listener) => listener.handleFavouriteUserLoggedOut(username));
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

    public getChatLog(room:string):ChatLog|null {
        let log:ChatLog|null = null;
        let index = this.chatLogs.findIndex((log) => log.roomName === room);
        if (index >= 0) log = this.chatLogs[index];
        return log;
    }

    receiveMessage(message: Message,wasOffline:boolean = false): void {
        // double check the message is not from us somehow
        if (message.from === this.getCurrentUser()) return;
        // don't receive messages from the blocked users
        if (!this.isUserInBlockedList(message.from)) {

            // ok, so we need to add the message to the chat log, increase the new message count, save the logs and pass it on
            let chatLog = this.ensureChatLogExists(message.room);
            this.addMessageToChatLog(chatLog, message);
            cmLogger(`Message received`);
            cmLogger(message);

            this.chatListeners.forEach((listener) => listener.handleChatLogUpdated(chatLog,wasOffline));
        }
        else {
            cmLogger(`Message received from user ${message.from} - is in blocked list, not passed on.`)
        }

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
           this.receiveMessage(message,true)
        });
        this.chatListeners.forEach((listener) => listener.handleOfflineMessagesReceived(messages));
    }

    joinChat(room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        this.ensureChatLogExists(room);
        socketManager.joinChat(this.getCurrentUser(),room);
    }

    private removeChatLog(room:string) {
        let index = this.chatLogs.findIndex((log) => log.roomName === room);
        if (index >= 0) {
            cmLogger(`Removing Chat log for room ${room}`);
            let result = this.chatLogs.splice(index,1);
            cmLogger(result.length);
            this.saveLogs();
        }
    }

    leaveChat(room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        this.removeChatLog(room);
        socketManager.leaveChat(this.getCurrentUser(),room);
    }

    login(): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        socketManager.login(this.getCurrentUser());
        // get the current user list
        socketManager.getUserList();
        // connect to the chat rooms already in logs
        this.chatLogs.forEach((log) => {
            socketManager.joinChat(this.currentUsername,log.roomName);
        });
    }

    logout(): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        socketManager.logout(this.getCurrentUser());
    }

    sendInvite(to: string, room: string): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        // can't accidentally send an invite to blacklisted
        if (this.isUserInBlockedList(to)) return;
        // only send an invite if the user isn't already in the room
        const log:ChatLog = this.ensureChatLogExists(room);
        if (log.users.findIndex((user) =>  user === to) < 0) {
            socketManager.sendInvite(this.getCurrentUser(),to, room);
        }
    }

    sendMessage(room: string, content: string, priority:number = 0): Message|null {
        if (this.getCurrentUser().trim().length === 0) return null;  // we are not logged in
        let log = this.ensureChatLogExists(room);
        // send the message
        let created = parseInt(moment().format('YYYYMMDDHHmmss'));
        socketManager.sendMessage(this.getCurrentUser(),room, content, created);

        // add the message to the chat log
        let sent:Message = {
            from:this.getCurrentUser(),
            room: room,
            message: content,
            created: created,
            priority: priority
        }
        this.addMessageToChatLog(log, sent);
        return sent;
    }

    public getChatLogs():ChatLog[] {
        return [...this.chatLogs];
    }


    public startChatWithUser(username:string) {
        if (username) {
            cmLogger(`Starting chat with ${username}`);
            // first thing, do we have a chat log with this user (and just this user) already?
            let chatLog: ChatLog = this.ensureChatLogExistsWithUser(username);
            this.chatListeners.forEach((listener) => listener.handleChatLogUpdated(chatLog,false));


            // invite the other user
            socketManager.sendInvite(this.getCurrentUser(), username, chatLog.roomName);
            // ok, lets connect to the server
            socketManager.joinChat(this.getCurrentUser(), chatLog.roomName);
        }
    }
}
