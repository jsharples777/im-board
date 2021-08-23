import {ChatLog, Invitation, Message} from "./Types";

export interface MessageEventListener{
    receiveMessage(message:Message):void;
}

export interface ChatEventListener {
    handleChatLogUpdated(log:ChatLog,wasOffline:boolean):void;
    handleChatLogsUpdated():void;
    handleChatStarted(log:ChatLog):void;
    handleOfflineMessagesReceived(messages:Message[]):void;
    handleNewInviteReceived(invite:Invitation):boolean; // return false if the invite was rejected
}

