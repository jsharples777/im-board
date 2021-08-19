import {ChatLog, ChatManager} from "./ChatManager";
import {ChatEventListener} from "./ChatEventListener";
import notifier from "../notification/NotificationManager";

export class NotificationController implements ChatEventListener {
    private static _instance: NotificationController;

    public static getInstance(): NotificationController {
        if (!(NotificationController._instance)) {
            NotificationController._instance = new NotificationController();
        }
        return NotificationController._instance;
    }

    private doNotDisturb:boolean = false;
    private chatManager:ChatManager;
    private chatListener:ChatEventListener|null;

    private constructor() {
        this.chatManager = ChatManager.getInstance();
        this.doNotDisturb = false;
        this.chatListener = null;

        //bind the methods
        this.handleChatLogUpdated = this.handleChatLogUpdated.bind(this);
        this.handleLoggedInUsersUpdated = this.handleLoggedInUsersUpdated.bind(this);
        this.handleFavouriteUserLoggedIn = this.handleFavouriteUserLoggedIn.bind(this);
        this.handleFavouriteUserLoggedOut = this.handleFavouriteUserLoggedOut.bind(this);

        this.chatManager.setChatEventHandler(this);
    }

    public setListener(listener:ChatEventListener) {
        this.chatListener = listener;
    }

    public setDoNotDisturb(dontDisturbMe = true) {
        this.doNotDisturb = dontDisturbMe;
    }

    public blackListUser(username:string, isBlackedListed:boolean = true) {
        if (isBlackedListed) {
            this.chatManager.addUserToBlockedList(username);
        }
        else {
            this.chatManager.removeUserFromBlockedList(username);
        }
    }

    public favouriteUser(username:string, isFavourited:boolean = true) {
        if (isFavourited) {
            this.chatManager.addUserToFavouriteList(username);
        }
        else {
            this.chatManager.removeUserFromFavouriteList(username);
        }
    }

    handleChatLogUpdated(log: ChatLog): void {
        // avoid no actual messages
        if (log.messages.length === 0) return;

        // pass on the changes
        if (this.chatListener) this.chatListener.handleChatLogUpdated(log);

        // provide visual notifications if do not disturb is not on
        if (this.doNotDisturb) return;

        // get the last message added, it won't be from ourselves (the chat manager takes care of that)
        const displayMessage = log.messages[log.messages.length - 1];
        notifier.show(displayMessage.from,displayMessage.message,'message',3000);
    }

    handleLoggedInUsersUpdated(usernames: string[]): void {
        // allow the view to change the user statuses
        if (this.chatListener) this.chatListener.handleLoggedInUsersUpdated(usernames);
    }

    handleFavouriteUserLoggedIn(username: string): void {
        // allow the view to change the user statuses
        if (this.chatListener) this.chatListener.handleFavouriteUserLoggedIn(username);

        // provide visual notifications if do not disturb is not on
        if (this.doNotDisturb) return;
        notifier.show(username,`User ${username} has logged in.`,'warning',5000);
    }

    handleFavouriteUserLoggedOut(username: string): void {
        // allow the view to change the user statuses
        if (this.chatListener) this.chatListener.handleFavouriteUserLoggedOut(username);

        // provide visual notifications if do not disturb is not on
        if (this.doNotDisturb) return;
        notifier.show(username,`User ${username} has logged out.`,'priority',4000);

    }

}
