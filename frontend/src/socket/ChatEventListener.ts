import {ChatLog} from "./ChatManager";
import {Invitation, Message} from "./ChatReceiver";

export interface ChatEventListener {
    handleChatLogUpdated(log:ChatLog,wasOffline:boolean):void;
    handleChatLogsUpdated():void;
    handleChatStarted(log:ChatLog):void;
    handleOfflineMessagesReceived(messages:Message[]):void;
    handleNewInviteReceived(invite:Invitation):boolean; // return false if the invite was rejected
}

export interface ChatUserEventListener {
    handleLoggedInUsersUpdated(usernames: string[]): void;

    handleFavouriteUserLoggedIn(username: string): void;

    handleFavouriteUserLoggedOut(username: string): void;

    handleFavouriteUsersChanged(usernames: string[]):void;
    handleBlockedUsersChanged(usernames: string[]):void;
}