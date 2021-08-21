import {ChatLog} from "./ChatManager";
import {Message} from "./ChatReceiver";

export interface ChatEventListener {
    handleChatLogUpdated(log:ChatLog,wasOffline:boolean):void;
    handleChatLogsUpdated():void;
    handleChatStarted(log:ChatLog):void;
    handleOfflineMessagesReceived(messages:Message[]):void;

}

export interface ChatUserEventListener {
    handleLoggedInUsersUpdated(usernames: string[]): void;

    handleFavouriteUserLoggedIn(username: string): void;

    handleFavouriteUserLoggedOut(username: string): void;

    handleFavouriteUsersChanged(usernames: string[]):void;
    handleBlockedUsersChanged(usernames: string[]):void;
}