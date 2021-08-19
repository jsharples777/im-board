import {ChatLog} from "./ChatManager";

export interface ChatEventListener {
    handleChatLogUpdated(log:ChatLog):void;

}

export interface ChatUserEventListener {
    handleLoggedInUsersUpdated(usernames: string[]): void;

    handleFavouriteUserLoggedIn(username: string): void;

    handleFavouriteUserLoggedOut(username: string): void;

    handleFavouriteUsersChanged(usernames: string[]):void;
    handleBlockedUsersChanged(usernames: string[]):void;
}