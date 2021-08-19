import debug from 'debug';
import SidebarView from './SidebarView';
import {StateManager} from '../state/StateManager';
import {isSame} from '../util/EqualityFunctions';
import {ChatUserEventListener} from "../socket/ChatEventListener";
import {NotificationController} from "../socket/NotificationController";
import controller from "../Controller";

const vLogger = debug('view:user-search-sidebar');

class PatientSearchSidebarView extends SidebarView implements ChatUserEventListener {
    protected loggedInUsers:string[];

    constructor(applicationView: any, htmlDocument: HTMLDocument, stateManager: StateManager) {
        super(applicationView, htmlDocument, applicationView.state.ui.userSearchSideBar, applicationView.state.uiPrefs.userSearchSideBar, stateManager);


        this.config = applicationView.state;
        this.loggedInUsers = [];

        // handler binding
        this.updateView = this.updateView.bind(this);
        this.eventClickItem = this.eventClickItem.bind(this);
        this.eventUserSelected = this.eventUserSelected.bind(this);
        this.handleLoggedInUsersUpdated = this.handleBlockedUsersChanged.bind(this);

        // register state change listening
        stateManager.addChangeListenerForName(this.config.stateNames.users, this);
        stateManager.addChangeListenerForName(this.config.stateNames.recentUserSearches, this);
        NotificationController.getInstance().addUserListener(this);
    }

    handleLoggedInUsersUpdated(usernames: string[]): void {
        this.loggedInUsers = usernames;
    }

    handleFavouriteUserLoggedIn(username: string): void {}
    handleFavouriteUserLoggedOut(username: string): void {}
    handleFavouriteUsersChanged(usernames: string[]): void {}
    handleBlockedUsersChanged(usernames: string[]): void {}

    onDocumentLoaded() {
        super.onDocumentLoaded();
        // @ts-ignore
        const fastSearchEl = $(`#${this.uiConfig.dom.extra.fastSearchInputId}`);
        fastSearchEl.on('autocompleteselect', this.eventUserSelected);
    }

    getIdForStateItem(name: string, item: any) {
        return item.id;
    }

    getLegacyIdForStateItem(name: string, item: any) {
        return item.id;
    }

    getDisplayValueForStateItem(name: string, item: any) {
        return item.username;
    }

    getModifierForStateItem(name: string, item: any) {
        let result = 'normal';
        // if the user is currently logged out make the item inactive
        if (this.loggedInUsers.findIndex((user) => user === item.username) < 0) {
            result = 'inactive';
        }
        return result;
    }

    getSecondaryModifierForStateItem(name: string, item: any) {
        let result = 'normal';
        // if the user is in the black list then show warning and a favourite user is highlighted
        if (NotificationController.getInstance().isFavouriteUser(item.username)) {
            result = 'active';
        }
        if (NotificationController.getInstance().isBlockedUser(item.username)) {
            result = 'warning';
        }
        return result;
    }

    eventClickItem(event:MouseEvent) {
        event.preventDefault();
        console.log(event.target);
        // @ts-ignore
        const userId = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        // @ts-ignore
        vLogger(`User ${event.target.innerText} with id ${userId} clicked`);

        let user:any = this.stateManager.findItemInState(this.config.stateNames.users, {id:userId}, isSame);
        vLogger(user);
        NotificationController.getInstance().startChatWithUser(user.username);
    }

    eventUserSelected(event: Event, ui: any) {
        event.preventDefault();
        vLogger(`User ${ui.item.label} with id ${ui.item.value} selected`);
        // @ts-ignore
        event.target.innerText = '';

        // add the selected user to the recent user searches
        if (this.stateManager.isItemInState(this.config.stateNames.recentUserSearches, {id: ui.item.value}, isSame)) return;

        const recentUserSearches = this.stateManager.getStateByName(this.config.stateNames.recentUserSearches);
        vLogger(`saved searches too long? ${recentUserSearches.length}`);
        if (recentUserSearches.length >= this.config.controller.dataLimit.recentUserSearches) {
            vLogger('saved searches too long - removing first');
            // remove the first item from recent searches
            const item = recentUserSearches.shift();
            this.stateManager.removeItemFromState(this.config.stateNames.recentUserSearches, item, isSame,true);
        }
        // save the searches
        this.stateManager.addNewItemToState(this.config.stateNames.recentUserSearches, {id:ui.item.value,username:ui.item.label},true);
    }


  updateView(name:string, newState:any) {
        if (name === this.config.stateNames.recentUserSearches) {
            this.createResultsForState(name, newState);
        }
        if (name === this.config.stateNames.users) {
            // load the search names into the search field
            // what is my username?
            let myUsername = controller.getLoggedInUsername();
            // @ts-ignore
            const fastSearchEl = $(`#${this.uiConfig.dom.extra.fastSearchInputId}`);
            // for each name, construct the patient details to display and the id referenced
            const fastSearchValues:any = [];
            newState.forEach((item:any) => {
                const searchValue = {
                    label: item.username,
                    value: item.id,
                };
                if (myUsername !== item.username) fastSearchValues.push(searchValue); // don't search for ourselves
            });
            fastSearchEl.autocomplete({source: fastSearchValues});
            fastSearchEl.autocomplete('option', {disabled: false, minLength: 1});
        }
    }

    getDragData(event:DragEvent) {
        // use the actual id to pass the user to the droppable target
        // @ts-ignore
        const userId = event.target.getAttribute(this.uiConfig.dom.resultDataKeyId);
        // @ts-ignore
        vLogger(`User ${event.target.innerText} with id ${userId} dragging`);
        let user = this.stateManager.findItemInState(this.config.stateNames.users, {id:userId}, isSame);
        user[this.config.ui.draggable.draggedType] = this.config.ui.draggable.draggedTypeUser;
        user[this.config.ui.draggable.draggedFrom] = this.config.ui.draggable.draggedFromUserSearch;
        return user;
    }
}

export default PatientSearchSidebarView;
