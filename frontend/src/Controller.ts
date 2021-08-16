import debug from 'debug';
import MemoryBufferStateManager from "./state/MemoryBufferStateManager";
import {isSame} from "./util/EqualityFunctions";
import SocketListener from "./socket/SocketListener";
import StateChangeListener from "./state/StateChangeListener";
import {AbstractStateManager} from "./state/AbstractStateManager";
import {RESTApiStateManager} from "./state/RESTApiStateManager";
import notifier from "./notification/NotificationManager";
import socketManager from "./socket/SocketManager";

const cLogger = debug('controller-ts');

class Controller implements SocketListener, StateChangeListener {
    protected applicationView: any;
    protected clientSideStorage: any;
    protected config: any;
    protected stateManager: AbstractStateManager;
    protected apiStateManager:RESTApiStateManager;

    constructor() {
        this.stateManager = MemoryBufferStateManager.getInstance();
        this.apiStateManager = RESTApiStateManager.getInstance();
    }


    connectToApplication(applicationView: any, clientSideStorage: any) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;
        this.config = this.applicationView.state;

        // state listener
        this.stateChanged = this.stateChanged.bind(this);
        this.stateChangedItemAdded = this.stateChangedItemAdded.bind(this);
        this.stateChangedItemRemoved = this.stateChangedItemRemoved.bind(this);
        this.stateChangedItemUpdated = this.stateChangedItemUpdated.bind(this);

        this.getStateManager().addChangeListenerForName(this.config.stateNames.entries, this);
        this.getStateManager().addChangeListenerForName(this.config.stateNames.comments, this);

        return this;
    }

    /*
  Get the base data for the application (users, entries)
 */
    public initialise():void {
        cLogger('Initialising data state');
        // listen for socket events
        socketManager.setListener(this);
        // setup the API calls
        this.apiStateManager.initialise([
            {
                stateName: this.config.stateNames.users,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.users,
                isActive:true
            },
            {
                stateName: this.config.stateNames.entries,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.entries,
                isActive:true
            },
            {
                stateName: this.config.stateNames.comments,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.comments,
                isActive:true
            }
        ]);
        this.apiStateManager.addChangeListenerForName(this.config.stateNames.entries, this);
        this.apiStateManager.addChangeListenerForName(this.config.stateNames.comments, this);
        this.apiStateManager.addChangeListenerForName(this.config.stateNames.users, this);

        // load the entries
        this.apiStateManager.getStateByName(this.config.stateNames.entries);
        // load the users
        this.apiStateManager.getStateByName(this.config.stateNames.users);
        // load the comments
        this.apiStateManager.getStateByName(this.config.stateNames.comments);
    }
    
    public getStateManager():AbstractStateManager {
        return this.stateManager;
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
        return result;
    }



    // Lets delete a comment
    deleteComment(id:number) {
        let entry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);
        if (entry) {
            cLogger(`Handling delete comment for ${entry.id} and comment ${id}`);
            this.getStateManager().removeItemFromState(this.config.stateNames.comments,{id:id},isSame)
            // send the api call
            this.apiStateManager.removeItemFromState(this.config.stateNames.comments,{id:id},isSame);
        }
    }

    public deleteEntry(entry:any):void {
        if (entry) {
            cLogger(`Handling delete entry for ${entry.id}`);
            // update the state manager
            this.getStateManager().removeItemFromState(this.config.stateNames.entries, entry, isSame);
            // send the api call
            this.apiStateManager.removeItemFromState(this.config.stateNames.entries,{id:entry.id},isSame);
        }
    }

    public updateEntry(entry:any):void {
        if (entry) {
            cLogger(entry);
            if (entry.id) {
                cLogger(`Handling update for entry ${entry.id}`);
                // update the state manager
                this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, isSame);
                // send the api call
                this.apiStateManager.updateItemInState(this.config.stateNames.entries,entry,isSame);

            } else {
                cLogger(`Handling create for entry`);
                // send the api call and let the completed entry with id come back asynchronously
                this.apiStateManager.addNewItemToState(this.config.stateNames.entries,entry, false);
            }
        }
    }

    public addComment(comment:any):void  {
        if (comment) {
            cLogger(comment);
            cLogger(`Handling create for comment`);
            // send the api call and let the completed entry with id come back asynchronously
            this.apiStateManager.addNewItemToState(this.config.stateNames.comments,comment, false);
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
        cLogger(`Handling data change ${message.type} on object type ${message.stateName} made by user ${message.user}`);
        const changeUser = this.getStateManager().findItemInState(this.config.stateNames.users, {id: message.user}, isSame);
        let username = "unknown";
        if (changeUser) {
            username = changeUser.username;
        }
        cLogger(`Handling data change ${message.type} on object type ${message.stateName} made by user ${username}`);

        let stateObj = message.data;
        cLogger(stateObj);
        // ok lets work out where this change belongs
        try {
            switch (message.type) {
                case "create": {
                    switch (message.stateName) {
                        case this.config.stateNames.comments: {
                            this.getStateManager().addNewItemToState(this.config.stateNames.comments,stateObj,true);
                            // find the entry in question
                            const changedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries, {id: stateObj.commentOn}, isSame);
                            if (changedEntry) {
                                notifier.show(changedEntry.title, `${username} added comment ${stateObj.content}`);
                            }
                            break;
                        }
                        case this.config.stateNames.entries: {
                            this.getStateManager().addNewItemToState(this.config.stateNames.entries, stateObj,true);
                            notifier.show(stateObj.title, `${username} added new entry`);
                            break;
                        }
                        case this.config.stateNames.users: {
                            this.getStateManager().addNewItemToState(this.config.stateNames.users, stateObj,true);
                            notifier.show(stateObj.username, `${stateObj.username} has just registered.`, 'message');
                            break;
                        }
                    }
                    break;
                }
                case "update": {
                    switch (message.stateName) {
                        case this.config.stateNames.entries: {
                            this.getStateManager().updateItemInState(this.config.stateNames.entries, stateObj, isSame);
                            // the entry could be selected by this (different user) but that would only be for comments, which is not what changed, so we are done
                            break;
                        }
                    }
                    break;
                }
                case "delete": {
                    switch (message.stateName) {
                        case this.config.stateNames.comments: {
                            this.getStateManager().removeItemFromState(this.config.stateNames.comments,stateObj,isSame);
                            break;
                        }
                        case this.config.stateNames.entries: {
                            let deletedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries, stateObj, isSame);
                            this.getStateManager().removeItemFromState(this.config.stateNames.entries, stateObj, isSame);
                            notifier.show(deletedEntry.title, `${username} has deleted this entry.`, 'priority');
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

    //  State Management listening
    stateChangedItemAdded(managerName:string, name: string, itemAdded: any): void {
        cLogger(`State changed ${name} - item Added`);
        cLogger(itemAdded);
        switch (managerName) {
            case 'memory': {
                cLogger(`received state from ${managerName} for state ${name} - updating application view`);
                let selectedEntry = this.applicationView.state.selectedEntry;
                switch (name) {
                    case this.config.stateNames.entries: {
                        this.composeBlogEntry(itemAdded);
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        break;
                    }
                    case this.config.stateNames.comments: {
                        let updatedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries,{id:itemAdded.commentOn},isSame);
                        cLogger(`updating comments for entry ${updatedEntry.id} = ${updatedEntry.comments.length}`);
                        cLogger(updatedEntry);
                        this.composeBlogEntry(updatedEntry);
                        cLogger(`updating comments for entry ${updatedEntry.id} = ${updatedEntry.comments.length}`);
                        cLogger(updatedEntry);
                        this.composeBlogEntry(selectedEntry);
                        cLogger(`updating comments for entry ${updatedEntry.id} = ${updatedEntry.comments.length}`);

                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry,selectedEntry);
                        break;
                    }
                }
                break;
            }
            case 'restapi': {
                cLogger(`received state from ${managerName} for state ${name} - added items are unknown the the application`);
                if (name === this.config.stateNames.comments) {
                    cLogger(this.getStateManager().getStateByName(this.config.stateNames.comments).length);
                }
                this.getStateManager().addNewItemToState(name,itemAdded,true);
                if (name === this.config.stateNames.comments) {
                    cLogger(this.getStateManager().getStateByName(this.config.stateNames.comments).length);
                }
                break;
            }
        }
    }

    stateChangedItemRemoved(managerName:string, name: string, itemRemoved: any): void {
        cLogger(`State changed ${name} - item Removed`);
        cLogger(itemRemoved);
        switch (managerName) {
            case 'memory': {
                cLogger(`received state from ${managerName} for state ${name} - updating application view`);
                let selectedEntry = this.applicationView.state.selectedEntry;
                switch (name) {
                    case this.config.stateNames.entries: {
                        if (selectedEntry) {
                            if (isSame(selectedEntry,itemRemoved)) {
                                selectedEntry = {};
                                this.applicationView.hideAllSideBars();
                            }
                        }
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry,selectedEntry);
                        break;
                    }
                    case this.config.stateNames.comments: {
                        let updatedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries,{id:itemRemoved.commentOn},isSame);
                        this.composeBlogEntry(updatedEntry);
                        this.composeBlogEntry(selectedEntry);
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry,selectedEntry);
                        break;
                    }
                }
                break;
            }
            case 'restapi': {
                cLogger(`received state from ${managerName} for state ${name} - ignoring, should be in memory already`);
                break;
            }
        }
    }

    private composeBlogEntry(entry:any) {
        if (!entry) return;
        // find the user for the entry
        let user:any = controller.getStateManager().findItemInState(this.config.stateNames.users,{id:entry.createdBy},isSame);
        if (!user) user = { id:-1, username:'unknown'};

        const allComments:any[] = controller.getStateManager().getStateByName(this.config.stateNames.comments);
        // get the comments for the entry
        let comments = allComments.filter((comment:any) => comment.commentOn === entry.id);
        if (!comments) comments = [];

        entry.user = user;
        entry.comments = comments;
    }

    private composeAllBlogEntries() {
        let entries = this.getStateManager().getStateByName(this.config.stateNames.entries);
        entries.forEach((entry:any) => {
            this.composeBlogEntry(entry);
        });
    }

    stateChangedItemUpdated(managerName:string, name: string, itemUpdated: any, itemNewValue: any): void {
        cLogger(`State changed ${name} - item updated`);
        cLogger(itemUpdated);
        switch (managerName) {
            case 'memory': {
                cLogger(`received state from ${managerName} for state ${name} - updating application view`);
                let selectedEntry = this.applicationView.state.selectedEntry;
                switch (name) {
                    case this.config.stateNames.entries: {
                        this.composeBlogEntry(itemNewValue);
                        this.composeBlogEntry(selectedEntry);
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        break;
                    }
                }
                break;
            }
            case 'restapi': {
                cLogger(`received state from ${managerName} for state ${name} - ignoring, should be in memory already`);
                break;
            }
        }

    }

    stateChanged(managerName:string, name: string, values: any) {
        cLogger(`State changed ${name}`);
        cLogger(values);
        // what has changed and by whom?
        switch (managerName) {
            case 'memory': {
                cLogger(`received state from ${managerName} for state ${name} - sending to application view`);
                switch (name) {
                    case this.config.stateNames.entries: {
                        this.composeAllBlogEntries();
                        break;
                    }
                    case this.config.stateNames.comments: {
                        this.composeAllBlogEntries();
                        cLogger(this.getStateManager().getStateByName(this.config.stateNames.entries));
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: {},
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        break;
                    }
                    case this.config.stateNames.users: {
                        break;
                    }
                }
                break;
            }
            case 'restapi': {
                cLogger(`received state from ${managerName} for state ${name} - sending to application state manager`);
                this.getStateManager().setStateByName(name,values);
                break;
            }
        }
    }

}

const controller = new Controller();

export default controller;
