import debug from 'debug';
import downloader from "./network/DownloadManager";
import stateManager from "./state/StateManagementUtil";
import {isSame} from "./util/EqualityFunctions";
import notifier from "./notification/NotificationManager";
import SocketListener from "./socket/SocketListener";
import socketManager from "./socket/SocketManager";
import StateChangeListener from "./state/StateChangeListener";
import {jsonRequest, RequestType} from "./network/Types";
import {BlogEntry, Comment, User} from "./AppTypes";

const cLogger = debug('controller-ts');

class Controller implements SocketListener, StateChangeListener {
    protected applicationView: any;
    protected clientSideStorage: any;
    protected config: any;

    constructor() {
    }


    connectToApplication(applicationView: any, clientSideStorage: any) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;
        this.config = this.applicationView.state;

        // setup Async callbacks for the fetch requests
        this.callbackForUsers = this.callbackForUsers.bind(this);
        this.callbackForEntries = this.callbackForEntries.bind(this);
        this.callbackForCreateEntry = this.callbackForCreateEntry.bind(this);
        this.callbackForCreateComment = this.callbackForCreateComment.bind(this);

        // state listener
        this.stateChanged = this.stateChanged.bind(this);

        stateManager.addChangeListenerForName(this.config.stateNames.entries, this);

        return this;
    }

    stateChanged(name: string, value: any) {
        cLogger(`State changes ${name}`);
        cLogger(value);
        this.applicationView.setState({
            isLoggedIn: this.isLoggedIn(),
            loggedInUserId: this.getLoggedInUserId(),
            selectedEntry: {},
            entries: value
        });
    }

    /*
    *
    * Call back functions for database operations
    *
     */
    private callbackForUsers(data: any, status: number) {
        cLogger('callback for all users');
        let users:User[] = [];
        if (status >= 200 && status <= 299) { // do we have any data?
            cLogger(data);
            let cbUsers = data;
            // covert the data to the AppType User
            cbUsers.forEach((cbUser:any) => {
                let user:User = {
                    id:cbUser.id,
                    username:cbUser.username
                }
                users.push(user);
            });
        }
        stateManager.setStateByName(this.config.stateNames.users, users);
    }

    private static convertJSONCommentToComment(jsonComment:any):Comment {
        let comment:Comment = {
            id:jsonComment.id,
            content:jsonComment.content,
            createdBy:jsonComment.createdBy,
            changedOn:jsonComment.changedOn,
            commentOn:jsonComment.commentOn,
        };
        return comment;
    }

    private static convertJSONUserToUser(jsonUser:any):User {
        let user:User = {
            id:jsonUser.id,
            username:jsonUser.username,
        }
        return user;
    }

    private static convertJSONEntryToBlogEntry(jsonEntry:any):BlogEntry {
        let entry:BlogEntry = {
            id: jsonEntry.id,
            title:jsonEntry.title,
            content:jsonEntry.content,
            createdBy:jsonEntry.createdBy,
            changedOn:jsonEntry.changedOn,
            User:null,
            Comments:[],
        }
        const cbUser:User|null = jsonEntry.user;
        if (cbUser) {
            entry.User = Controller.convertJSONUserToUser(cbUser);
        }
        const cbComments:Comment[]|null = jsonEntry.comments;
        if (cbComments) {
            cbComments.forEach((cbComment:any) => {
                let comment = Controller.convertJSONCommentToComment(cbComment);
                entry.Comments.push(comment);
            });
        }
        return entry;
    }

    private callbackForEntries(data: any, status: number) {
        cLogger('callback for all entries');
        let entries:BlogEntry[] = [];
        if (status >= 200 && status <= 299) { // do we have any data?
            cLogger(data);
            data.forEach((cbEntry:any) => {
                let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(cbEntry);
                entries.push(entry);
            });
        }
        stateManager.setStateByName(this.config.stateNames.entries, entries);
    }

    private callbackForCreateEntry(data: any, status: number) {
        cLogger('callback for create entry');
        let entry = null;
        if (status >= 200 && status <= 299) { // do we have any data?
            cLogger(data);
            let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(data);
            stateManager.addNewItemToState(this.config.stateNames.entries, entry);
        }
    }

    private callbackForCreateComment(data: any, status: number) {
        cLogger('callback for create comment');
        let comment = null;
        if (status >= 200 && status <= 299) { // do we have any data?
            let comment:Comment = Controller.convertJSONCommentToComment(data);
            cLogger(comment);
            // find the corresponding entry in state
            let entry = <BlogEntry|null>stateManager.findItemInState(this.config.stateNames.entries, {id: comment.commentOn}, isSame);
            cLogger(entry);
            if (entry) {
                cLogger('callback for create comment - updating entry');
                // update the entry with the new comment
                entry.Comments.push(comment);
                // update the entry in the state manager
                stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame);
                // reselect the same entry
                stateManager.setStateByName(this.config.stateNames.selectedEntry, entry);
                cLogger(entry);
            }
        }

    }

    /*
    *
    *   API calls
    *
     */

    private getAllUsers(): void {
        cLogger('Getting All Users');
        const jsonRequest: jsonRequest = {
            url: this.getServerAPIURL() + this.config.apis.users,
            type: RequestType.GET,
            params: {},
            callback: this.callbackForUsers,
        };
        downloader.addApiRequest(jsonRequest, true);
    }

    private getAllEntries(): void {
        cLogger('Getting All Entries');
        const jsonRequest: jsonRequest = {
            url: this.getServerAPIURL() + this.config.apis.entries,
            type: RequestType.GET,
            params: {},
            callback: this.callbackForEntries,
        };
        downloader.addApiRequest(jsonRequest, true);
    }

    private apiDeleteComment(id: number):void {
        const deleteCommentCB = function (data: any, status: number) {
            cLogger('callback for delete comment');
            if (status >= 200 && status <= 299) { // do we have any data?
                cLogger(data);
            }
        }


        const jsonRequest: jsonRequest = {
            url: this.getServerAPIURL() + this.config.apis.comment,
            type: RequestType.DELETE,
            params: {
                id: id
            },
            callback: deleteCommentCB,
        };
        downloader.addApiRequest(jsonRequest);

    }

    private apiDeleteEntry(entry: BlogEntry):void {
        const deleteCB = function (data: any, status: number) {
            cLogger('callback for delete entry');
            if (status >= 200 && status <= 299) { // do we have any data?
                cLogger(data);
            }
        }

        if (entry) {
            const jsonRequest:jsonRequest = {
                url: this.getServerAPIURL() + this.config.apis.entries,
                type: RequestType.DELETE,
                params: {
                    id: entry.id
                },
                callback: deleteCB,
            };
            downloader.addApiRequest(jsonRequest);
        }
    }

    private apiCreateEntry(entry:BlogEntry):void {
        if (entry) {
            const jsonRequest:jsonRequest = {
                url: this.getServerAPIURL() + this.config.apis.entries,
                type: RequestType.POST,
                params: entry,
                callback: this.callbackForCreateEntry,
            };
            downloader.addApiRequest(jsonRequest, true);
        }
    }

    private apiCreateComment(comment:Comment):void {
        if (comment) {
            const jsonRequest:jsonRequest = {
                url: this.getServerAPIURL() + this.config.apis.comment,
                type: RequestType.POST,
                params: comment,
                callback: this.callbackForCreateComment,
            };
            downloader.addApiRequest(jsonRequest, true);
        }
    }

    private apiUpdateEntry(entry:BlogEntry):void {
        const updateCB = function (data: any, status: number) {
            cLogger('callback for update entry');
            if (status >= 200 && status <= 299) { // do we have any data?
                cLogger(data);
            }
        }

        if (entry) {
            const jsonRequest:jsonRequest = {
                url: this.getServerAPIURL() + this.config.apis.entries,
                type: RequestType.PUT,
                params: entry,
                callback: updateCB,
            };
            downloader.addApiRequest(jsonRequest);
        }
    }

    /*
    *
    * Simple Application state (URL, logged in user)
    *
     */
    private getServerAPIURL():string {
        let result = "/api";
        // @ts-ignore
        if ((window.ENV) && (window.ENV.serverURL)) {
            // @ts-ignore
            result = window.ENV.serverURL;
        }
        return result;
    }

    public isLoggedIn():boolean {
        let isLoggedIn = false;
        try {
            // @ts-ignore
            if (loggedInUserId) {
                isLoggedIn = true;
            }
        } catch (error) {
        }
        cLogger(`Are logged in: ${isLoggedIn}`);
        return isLoggedIn;
    }

    public getLoggedInUserId():number {
        let result = -1;
        try {
            // @ts-ignore
            if (loggedInUserId) {
                // @ts-ignore
                result = loggedInUserId;
            }
        } catch (error) {
        }
        cLogger(`Logged in user id: ${result}`);
        return result;
    }

    /*
      Get the base data for the application (users, entries)
     */
    public initialise():void {
        cLogger('Initialising data state');
        // listen for socket events
        socketManager.setListener(this);
        // load the users
        this.getAllUsers();
        // load the entries
        this.getAllEntries();
    }

    // Lets delete a comment
    deleteComment(id:number) {
        let entry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
        if (entry) {
            cLogger(`Handling delete comment for ${entry.id} and comment ${id}`);
            // find the comment in the entry and remove it from the state
            let comments = entry.Comments;
            const foundIndex = comments.findIndex((element: any) => element.id === id);
            if (foundIndex >= 0) {
                // remove comment from the array
                cLogger('Found comment in entry - removing');
                comments.splice(foundIndex, 1);
                cLogger(entry);
                // update the statement manager
                stateManager.setStateByName(this.config.stateNames.selectedEntry, entry);
                stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame);
            }
        }
        this.apiDeleteComment(id);
    }

    public deleteEntry(entry:BlogEntry):void {
        if (entry) {
            cLogger(`Handling delete entry for ${entry.id}`);
            // update the state manager
            stateManager.removeItemFromState(this.config.stateNames.entries, entry, isSame);
            // initiate a call to remove from the database
            this.apiDeleteEntry(entry);
        }
    }

    public updateEntry(entry:BlogEntry):void {
        if (entry) {
            cLogger(entry);
            if (entry.id) {
                cLogger(`Handling update for entry ${entry.id}`);
                // update the state manager
                stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame);
                // update the database
                this.apiUpdateEntry(entry);
            } else {
                cLogger(`Handling create for entry`);
                // new entry
                this.apiCreateEntry(entry);
            }
        }
    }

    public addComment(comment:Comment):void  {
        if (comment) {
            cLogger(comment);
            cLogger(`Handling create for comment`);
            this.apiCreateComment(comment);
        }
    }

    /*
    *  sockets -
    *  Handling data changes by other users
    *
     */

    public handleMessage(message:string):void {
        cLogger(message);
    }

    public getCurrentUser():number{
        return this.getLoggedInUserId();
    }

    public handleDataChangedByAnotherUser(message:any) {
        cLogger(`Handling data change ${message.type} on object type ${message.objectType} made by user ${message.user}`);
        const changeUser = stateManager.findItemInState(this.config.stateNames.users, {id: message.user}, isSame);
        let stateObj = message.data;
        cLogger(stateObj);
        // ok lets work out where this change belongs
        try {
            switch (message.type) {
                case "create": {
                    switch (message.objectType) {
                        case "Comment": {
                            // updating comments is more tricky as it is a sub object of the blog entry
                            // find the entry in question
                            const changedEntry = <BlogEntry|null>stateManager.findItemInState(this.config.stateNames.entries, {id: stateObj.commentOn}, isSame);
                            if (changedEntry) {
                                let comment:Comment = Controller.convertJSONCommentToComment(stateObj);
                                // add the new comment
                                changedEntry.Comments.push(comment);
                                // update the state
                                stateManager.updateItemInState(this.config.stateNames.entries, changedEntry, isSame);
                                // was this entry current open by the user?
                                const currentSelectedEntry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
                                if (currentSelectedEntry) {
                                    if (currentSelectedEntry.id === changedEntry.id) {
                                        stateManager.setStateByName(this.config.stateNames.selectedEntry, changedEntry);
                                    }
                                }
                                let username = "unknown";
                                if (changeUser) {
                                    username = changeUser.username;
                                }
                                notifier.show(changedEntry.title, `${username} added comment ${stateObj.content}`);
                            }
                            break;
                        }
                        case "BlogEntry": {
                            let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(stateObj);
                            cLogger("Converting to BlogEntry type for Create");
                            cLogger(entry);
                            // add the new item to the state
                            stateManager.addNewItemToState(this.config.stateNames.entries, entry);
                            let username = "unknown";
                            if (changeUser) {
                                username = changeUser.username;
                            }

                            notifier.show(stateObj.title, `${username} added new entry`);
                            break;
                        }
                        case "User": {
                            let user:User = Controller.convertJSONUserToUser(stateObj);
                            // add the new item to the state
                            stateManager.addNewItemToState(this.config.stateNames.users, user);

                            notifier.show(stateObj.username, `${stateObj.username} has just registered.`, 'message');
                            break;
                        }
                    }
                    break;
                }
                case "update": {
                    switch (message.objectType) {
                        case "BlogEntry": {
                            let entry:BlogEntry = Controller.convertJSONEntryToBlogEntry(stateObj);
                            cLogger("Converting to BlogEntry type for Update");
                            cLogger(entry);
                            // update the item in the state
                            stateManager.updateItemInState(this.config.stateNames.entries, entry, isSame);
                            // the entry could be selected by this (different user) but that would only be for comments, which is not what changed, so we are done
                            break;
                        }
                    }
                    break;
                }
                case "delete": {
                    switch (message.objectType) {
                        case "Comment": {
                            // removing comments is more tricky as it is a sub object of the blog entry
                            // find the entry in question
                            const changedEntry = <BlogEntry|null>stateManager.findItemInState(this.config.stateNames.entries, {id: stateObj.commentOn}, isSame);
                            cLogger(changedEntry);
                            if (changedEntry) {
                                // remove the comment
                                let comments = changedEntry.Comments;
                                const foundIndex = comments.findIndex((element:any) => element.id === stateObj.id);
                                if (foundIndex >= 0) {
                                    // remove comment from the array
                                    cLogger('Found comment in entry - removing');
                                    comments.splice(foundIndex, 1);
                                    cLogger(changedEntry);

                                    // update the state
                                    stateManager.updateItemInState(this.config.stateNames.entries, changedEntry, isSame);
                                    // was this entry current open by the user?
                                    const currentSelectedEntry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
                                    if (currentSelectedEntry) {
                                        if (currentSelectedEntry.id === changedEntry.id) {
                                            stateManager.setStateByName(this.config.stateNames.selectedEntry, changedEntry);
                                        }
                                    }
                                }

                            }
                            break;
                        }
                        case "BlogEntry": {
                            cLogger(`Deleting Blog Entry with id ${stateObj.id}`);
                            const deletedEntry = stateManager.findItemInState(this.config.stateNames.entries, stateObj, isSame);
                            cLogger(deletedEntry);
                            if (deletedEntry) {
                                cLogger(`Deleting Blog Entry with id ${deletedEntry.id}`);
                                stateManager.removeItemFromState(this.config.stateNames.entries, deletedEntry, isSame);
                                // the current user could be accessing the comments in the entry that was just deleted
                                const currentSelectedEntry = stateManager.getStateByName(this.config.stateNames.selectedEntry);
                                if (currentSelectedEntry) {
                                    if (currentSelectedEntry.id === deletedEntry.id) {
                                        cLogger(`Deleted entry is selected by user, closing sidebars`);
                                        // ask the application to close any access to the comments
                                        this.applicationView.hideAllSideBars();
                                    }
                                }
                                notifier.show(deletedEntry.title, `${deletedEntry.User.username} has deleted this entry.`, 'danger');
                            }

                            break;
                        }
                    }
                    break;
                }
            }
        } catch (err) {
            cLogger(err);
        }

    }

}

const controller = new Controller();

export default controller;
