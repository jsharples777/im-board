import {ChatLog} from "./ChatManager";

export interface ChatEventListener {
    handleChatLogUpdated(log:ChatLog):void;
    handleLoggedInUsersUpdated(usernames:string[]):void;
    handleFavouriteUserLoggedIn(username:string):void;
    handleFavouriteUserLoggedOut(username:string):void;
}