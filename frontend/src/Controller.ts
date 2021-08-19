import debug from 'debug';
import MemoryBufferStateManager from "./state/MemoryBufferStateManager";
import {isSame} from "./util/EqualityFunctions";
import StateChangeListener from "./state/StateChangeListener";
import {StateManager} from "./state/StateManager";
import {RESTApiStateManager} from "./state/RESTApiStateManager";
import socketManager from "./socket/SocketManager";
import AsyncStateManagerWrapper from "./state/AsyncStateManagerWrapper";
import {AggregateStateManager} from "./state/AggregateStateManager";
import SocketListenerDelegate from "./SocketListenerDelegate";
import BrowserStorageStateManager from "./state/BrowserStorageStateManager";
import {ChatManager} from "./socket/ChatManager";
import {NotificationController} from "./socket/NotificationController";

const cLogger = debug('controller-ts');
const cLoggerDetail = debug('controller-ts-detail');

class Controller implements StateChangeListener {
    protected applicationView: any;
    protected clientSideStorage: any;
    protected config: any;
    // @ts-ignore
    protected stateManager: StateManager;

    constructor() {
    }

    connectToApplication(applicationView: any, clientSideStorage: any) {
        this.applicationView = applicationView;
        this.clientSideStorage = clientSideStorage;
        this.config = this.applicationView.state;
        // setup the API calls
        let apiStateManager = RESTApiStateManager.getInstance();
        apiStateManager.initialise([
            {
                stateName: this.config.stateNames.users,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.users,
                isActive: true
            },
            {
                stateName: this.config.stateNames.entries,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.entries,
                isActive: true
            },
            {
                stateName: this.config.stateNames.comments,
                serverURL: this.getServerAPIURL(),
                api: this.config.apis.comments,
                isActive: true
            }
        ]);

        // let indexedDBSM = IndexedDBStateManager.getInstance();
        // indexedDBSM.initialise([
        //     {
        //         name:this.config.stateNames.users,
        //         keyField:"id"
        //     },
        //     {
        //         name:this.config.stateNames.entries,
        //         keyField:"id"
        //     },
        //     {
        //         name:this.config.stateNames.comments,
        //         keyField:"id"
        //     }
        // ]);

        let aggregateSM = AggregateStateManager.getInstance();
        let memorySM = MemoryBufferStateManager.getInstance();

        let asyncSM = new AsyncStateManagerWrapper(aggregateSM, apiStateManager);

        aggregateSM.addStateManager(memorySM, [], false);
        aggregateSM.addStateManager(BrowserStorageStateManager.getInstance(), [], false);
        //aggregateSM.addStateManager(indexedDBSM,[this.config.stateNames.selectedEntry],false );
        aggregateSM.addStateManager(asyncSM, [this.config.stateNames.selectedEntry], false);

        this.stateManager = aggregateSM;

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
    public initialise(): void {
        cLogger('Initialising data state');
        // listen for socket events
        let socketListerDelegate = new SocketListenerDelegate(this.config);
        socketManager.setListener(socketListerDelegate);

        // now that we have all the user we can setup the chat system but only if we are logged in
        cLogger(`Setting up chat system for user ${this.getLoggedInUserId()}: ${this.getLoggedInUsername()}`);
        if (this.getLoggedInUserId() > 0) {
            // setup the chat system
            let chatManager = ChatManager.getInstance(); // this connects the manager to the socket system

            // setup the chat notification system
            let chatNotificationController = NotificationController.getInstance();
            chatManager.setCurrentUser(this.getLoggedInUsername());
            chatManager.setChatEventHandler(chatNotificationController);

            chatManager.login();
        }


        // load the entries
        this.getStateManager().getStateByName(this.config.stateNames.entries);
        // load the users
        this.getStateManager().getStateByName(this.config.stateNames.users);
        // load the comments
        this.getStateManager().getStateByName(this.config.stateNames.comments);
    }

    public getStateManager(): StateManager {
        return this.stateManager;
    }

    /*
    *
    * Simple Application state (URL, logged in user)
    *
     */
    private getServerAPIURL(): string {
        let result = "/api";
        // @ts-ignore
        if ((window.ENV) && (window.ENV.serverURL)) {
            // @ts-ignore
            result = window.ENV.serverURL;
        }
        return result;
    }

    public isLoggedIn(): boolean {
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

    public getLoggedInUserId(): number {
        let result = -1;
        try {
            // @ts-ignore
            if (loggedInUserId) {
                // @ts-ignore
                result = loggedInUserId;
            }
        } catch (error) {
        }
        cLoggerDetail(`Logged in user id is ${result}`);
        return result;
    }

    public getLoggedInUsername(): string {
        let result = '';
        try {
            // @ts-ignore
            if (loggedInUsername) {
                // @ts-ignore
                result = loggedInUsername;
            }
        } catch (error) {
        }
        cLoggerDetail(`Logged in user is ${result}`);
        return result;
    }


    // Lets delete a comment
    deleteComment(id: number) {
        let entry = this.getStateManager().getStateByName(this.config.stateNames.selectedEntry);
        if (entry) {
            cLogger(`Handling delete comment for ${entry.id} and comment ${id}`);
            this.getStateManager().removeItemFromState(this.config.stateNames.comments, {id: id}, isSame, false)
            // send the api call
            //this.asyncSM.removeItemFromState(this.config.stateNames.comments,{id:id},isSame);
        }
    }

    public deleteEntry(entry: any): void {
        if (entry) {
            cLogger(`Handling delete entry for ${entry.id}`);
            // update the state manager
            this.getStateManager().removeItemFromState(this.config.stateNames.entries, entry, isSame, false);
            // send the api call
            //this.asyncSM.removeItemFromState(this.config.stateNames.entries,{id:entry.id},isSame);
        }
    }

    public updateEntry(entry: any): void {
        if (entry) {
            cLogger(entry);
            if (entry.id) {
                cLogger(`Handling update for entry ${entry.id}`);
                // update the state manager
                this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, isSame, false);
                this.getStateManager().updateItemInState(this.config.stateNames.entries, entry, isSame, false);
                // send the api call
                //this.asyncSM.updateItemInState(this.config.stateNames.entries,entry,isSame);

            } else {
                cLogger(`Handling create for entry`);
                // send the api call and let the completed entry with id come back asynchronously
                this.getStateManager().addNewItemToState(this.config.stateNames.entries, entry, false);
                //this.asyncSM.addNewItemToState(this.config.stateNames.entries,entry, false);
            }
        }
    }

    public addComment(comment: any): void {
        if (comment) {
            cLogger(comment);
            cLogger(`Handling create for comment`);
            // send the api call and let the completed entry with id come back asynchronously
            this.getStateManager().addNewItemToState(this.config.stateNames.comments, comment, false);
            //this.asyncSM.addNewItemToState(this.config.stateNames.comments,comment, false);
        }
    }

    /*
    *  sockets -
    *  Handling data changes by other users
    *
     */

    public handleMessage(message: string): void {
        cLogger(message);
    }

    public getCurrentUser(): number {
        return this.getLoggedInUserId();
    }

    /* Compositing Blod Entries from the state functions */
    private composeBlogEntry(entry: any) {
        if (!entry) return;
        // find the user for the entry
        let user: any = controller.getStateManager().findItemInState(this.config.stateNames.users, {id: entry.createdBy}, isSame);
        if (!user) user = {id: -1, username: 'unknown'};

        const allComments: any[] = controller.getStateManager().getStateByName(this.config.stateNames.comments);
        // get the comments for the entry
        let comments = allComments.filter((comment: any) => comment.commentOn === entry.id);
        if (!comments) comments = [];

        entry.user = user;
        entry.comments = comments;
    }

    private composeAllBlogEntries() {
        let entries = this.getStateManager().getStateByName(this.config.stateNames.entries);
        entries.forEach((entry: any) => {
            this.composeBlogEntry(entry);
        });
    }


    //  State Management listening
    stateChangedItemAdded(managerName: string, name: string, itemAdded: any): void {
        cLogger(`State changed ${name} from ${managerName} - item Added`);
        cLogger(itemAdded);
        switch (managerName) {
            case 'aggregate':
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
                        let updatedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries, {id: itemAdded.commentOn}, isSame);
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
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, selectedEntry, true);
                        break;
                    }
                }
                break;
            }
        }
    }

    stateChangedItemRemoved(managerName: string, name: string, itemRemoved: any): void {
        cLogger(`State changed ${name} from ${managerName}  - item Removed`);
        cLogger(itemRemoved);
        switch (managerName) {
            case 'aggregate':
            case 'memory': {
                cLogger(`received state from ${managerName} for state ${name} - updating application view`);
                let selectedEntry = this.applicationView.state.selectedEntry;
                switch (name) {
                    case this.config.stateNames.entries: {
                        if (selectedEntry) {
                            if (isSame(selectedEntry, itemRemoved)) {
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
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, selectedEntry, true);
                        break;
                    }
                    case this.config.stateNames.comments: {
                        let updatedEntry = this.getStateManager().findItemInState(this.config.stateNames.entries, {id: itemRemoved.commentOn}, isSame);
                        this.composeBlogEntry(updatedEntry);
                        this.composeBlogEntry(selectedEntry);
                        this.applicationView.setState({
                            isLoggedIn: this.isLoggedIn(),
                            loggedInUserId: this.getLoggedInUserId(),
                            selectedEntry: selectedEntry,
                            entries: this.getStateManager().getStateByName(this.config.stateNames.entries)
                        });
                        this.getStateManager().setStateByName(this.config.stateNames.selectedEntry, selectedEntry, true);
                        break;
                    }
                }
                break;
            }
        }
    }

    stateChangedItemUpdated(managerName: string, name: string, itemUpdated: any, itemNewValue: any): void {
        cLogger(`State changed ${name} from ${managerName} - item updated`);
        cLogger(itemUpdated);
        switch (managerName) {
            case 'aggregate':
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
        }

    }

    stateChanged(managerName: string, name: string, values: any) {
        cLogger(`State changed ${name} from ${managerName} `);
        cLogger(values);
        // what has changed and by whom?
        switch (managerName) {
            case 'aggregate':
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
        }
    }

}

const controller = new Controller();

export default controller;
