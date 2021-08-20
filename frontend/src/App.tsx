/* eslint "react/react-in-jsx-scope":"off" */
/* eslint "react/jsx-no-undef":"off" */
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';
import moment from 'moment';

import controller from './Controller';
import CommentSidebarView from "./component/CommentSidebarView";
import BlogEntryView from "./component/BlogEntryView";
import {isSame} from "./util/EqualityFunctions";
import DetailsSidebarView from "./component/DetailsSidebarView";
import UserSearchSidebarView from "./component/UserSearchSidebarView";
import ChatSidebarView from "./component/ChatSidebarView";


const logger = debug('app');

class Root extends React.Component{
    private titleEl: any;
    private contentEl: any;
    private modalEl: any;
    // @ts-ignore
    private commentView: CommentSidebarView;
    // @ts-ignore
    private detailsView: DetailsSidebarView;

    // @ts-ignore
    private userSearchView: UserSearchSidebarView;
    // @ts-ignore
    private chatView: ChatSidebarView;

    // @ts-ignore
    private cancelBtnEl: HTMLElement | null;
    // @ts-ignore
    private confirmBtnEl: HTMLElement | null;
    // @ts-ignore
    private closeBtnEl: HTMLElement | null;

    constructor() {
        // @ts-ignore
        super();
        this.state = {
            isLoggedIn: false,
            loggedInUserId: -1,
            entries: [],
            selectedEntry: {},
            applyUserFilter:false,
            stateNames: {
                users: 'users',
                entries: 'entries',
                comments: 'comments',
                selectedEntry: 'selectedEntry',
                recentUserSearches: 'recentUserSearches',
            },
            apis: {
                users: '/users',
                entries: '/blog',
                entry: '/blog',
                comments: '/comment',
                login: '/login',
            },
            ui: {
                draggable: {
                    draggableDataKeyId: 'text/plain',
                    draggedType: 'draggedType',
                    draggedFrom: 'draggedFrom',
                    draggedTypeUser: 'user',
                    draggedTypeBoardGame: 'boardGame',
                    draggedFromUserSearch: 'userSearch',
                    draggedFromBoardGameSearch: 'boardGameSearch',
                },
                alert: {
                    modalId: "alert",
                    titleId: "alert-title",
                    contentId: "alert-content",
                    cancelButtonId: "alert-cancel",
                    confirmButtonId: "alert-confirm",
                    closeButtonId: "alert-close",
                    hideClass: "d-none",
                    showClass: "d-block",
                },
                navigation: {
                    showMyFavourites: 'navigationItemShowMyFavourites',
                    boardGameSearchId: 'navigationItemBoardGameSearch',
                    userSearchId: 'navigationItemUserSearch',
                    chatId: 'navigationItemChat'
                },
                blogEntry: {},
                entryDetailsSideBar: {
                    dom: {
                        sideBarId: 'detailsSideBar',
                        formId: 'details',
                        titleId: 'title',
                        contentId: 'content',
                        changedOnId: 'changedOn',
                        resultDataKeyId: 'id',
                        isDraggable: false,
                        isClickable: true,
                    },
                },
                chatSideBar: {
                    dom: {
                        sideBarId: 'chatSideBar',
                        resultsId: 'chatLogs',
                        resultsElementType: 'a',
                        resultsElementAttributes: [
                            ['href', '#'],
                        ],
                        resultsClasses: 'list-group-item my-list-item truncate-comment list-group-item-action',
                        resultDataKeyId: 'room',
                        resultLegacyDataKeyId: 'room',
                        resultDataSourceId: 'chatLogs',
                        modifierClassNormal: '',
                        modifierClassInactive: 'list-group-item-dark',
                        modifierClassActive: 'list-group-item-primary',
                        modifierClassWarning: '',
                        iconNormal: '',
                        iconInactive: '',
                        iconActive: '',
                        iconWarning: '',
                        isDraggable: false,
                        isClickable: true,
                        isDeleteable: false,
                        hasBadge: true,
                        resultContentDivClasses: 'd-flex w-100 justify-content-between',
                        resultContentTextElementType: 'span',
                        resultContentTextClasses: 'mb-1',
                        badgeElementType: 'span',
                        badgeElementAttributes: [
                            ['style', 'font-size:12pt'],
                        ],
                        badgeClasses: 'badge badge-pill badge-primary',
                        newFormId: "newMessage",
                        commentId: "message",
                        submitCommentId: "submitMessage",
                        chatLogId: 'chatLog',
                    },
                },
                userSearchSideBar: {
                    dom: {
                        sideBarId: 'userSearchSideBar',
                        resultsId: 'recentUserSearches',
                        favouriteUsersId: 'favouriteUsers',
                        blockedUsersId: 'blockedUsers',
                        favouriteUsersDropZone: 'favouriteUsersDropZone',
                        blockedUsersDropZone: 'blockedUsersDropZone',
                        resultsElementType: 'a',
                        resultsElementAttributes: [
                            ['href', '#'],
                        ],
                        resultsClasses: 'list-group-item my-list-item truncate-notification list-group-item-action',
                        resultDataKeyId: 'user-id',
                        resultLegacyDataKeyId: 'legacy-user-id',
                        resultDataSourceId: 'data-source',
                        resultDataSourceValue: 'recentUserSearches',
                        resultDataSourceFavUsers: 'favouriteUsers',
                        resultDataSourceBlockedUsers: 'blockedUsers',
                        modifierClassNormal: 'list-group-item-primary',
                        modifierClassInactive: 'list-group-item-light',
                        modifierClassActive: 'list-group-item-info',
                        modifierClassWarning: 'list-group-item-danger',
                        iconNormal: '   <i class="fas fa-comment"></i>',
                        iconInactive: '   <i class="fas fa-comment"></i>',
                        iconActive: '   <i class="fas fa-heart"></i>',
                        iconWarning: '  <i class="fas fa-exclamation-circle"></i>',
                        resultContentDivClasses: 'd-flex w-100 justify-content-between',
                        resultContentTextElementType: 'span',
                        resultContentTextClasses: 'mb-1',
                        isDraggable: true,
                        isClickable: true,
                        isDeleteable: true,
                        deleteButtonClasses: 'btn btn-circle btn-xsm',
                        deleteButtonText: '',
                        deleteButtonIconClasses:'fas fa-trash-alt',
                        extra: {
                            fastSearchInputId: 'fastSearchUserNames',
                        },
                    },
                },
            },
            uiPrefs: {
                navigation: {},
                blogEntry: {},
                userSearchSideBar: {
                    view: {
                        location: 'left',
                        expandedSize: '35%',
                    },
                },
                chatSideBar: {
                    view: {
                        location: 'right',
                        expandedSize: '50%',
                    },
                },
                entryDetailsSideBar: {
                    view: {
                        location: 'left',
                        expandedSize: '35%',
                    },
                }
            },
            controller: {
                events: {
                    entry: {
                        eventDataKeyId: 'entry-id',
                    },
                },
                dataLimit: {
                    recentUserSearches: 10,
                },
            },
        };
        // event handlers
        this.cancelDelete = this.cancelDelete.bind(this);
        this.confirmDelete = this.confirmDelete.bind(this);

        this.handleShowMyEntries = this.handleShowMyEntries.bind(this);
        this.handleSelectEntryComments = this.handleSelectEntryComments.bind(this);
        this.handleShowEditEntry = this.handleShowEditEntry.bind(this);
        this.handleUpdateEntry = this.handleUpdateEntry.bind(this);
        this.handleAddEntry = this.handleAddEntry.bind(this);
        this.handleAddComment = this.handleAddComment.bind(this);
        this.handleDeleteEntry = this.handleDeleteEntry.bind(this);
        this.handleDeleteComment = this.handleDeleteComment.bind(this);



        this.handleShowUserSearch = this.handleShowUserSearch.bind(this);
        this.handleShowChat = this.handleShowChat.bind(this);

        controller.connectToApplication(this, window.localStorage);
    }

    getCurrentUser() {
        return controller.getLoggedInUserId();
    }

    alert(title:string,content:string) {
        this.titleEl.textContent = title;
        this.contentEl.textContent = content;
        // @ts-ignore
        this.modalEl.classList.remove(this.state.ui.alert.hideClass);
        // @ts-ignore
        this.modalEl.classList.add(this.state.ui.alert.showClass);
    }

    render() {
        logger("Rendering App");
        // @ts-ignore
        logger(this.state.entries);
        // @ts-ignore
        logger(`User filter ${this.state.applyUserFilter}`);

        // @ts-ignore
        let entriesToDisplay = this.state.entries;
        // @ts-ignore
        if (this.state.applyUserFilter && controller.isLoggedIn() && (controller.getLoggedInUserId() > 0)) {
            logger(`fitlering entries`);
            entriesToDisplay = entriesToDisplay.filter((entry:any) => {
                return (entry.createdBy === controller.getLoggedInUserId());
            });
        }
        const blog = entriesToDisplay.map((entry:any, index:number) =>
            <BlogEntryView
                key={index}
                entry={entry}
                showCommentsHandler={this.handleSelectEntryComments}
                editEntryHandler={this.handleShowEditEntry}
                deleteEntryHandler={this.handleDeleteEntry}
            />
        );
        return (
            <div className="Root row ml-1">
                {blog}
            </div>
        );
    }

    cancelDelete(event:Event) {
        // @ts-ignore
        this.modalEl.classList.remove(this.state.ui.alert.showClass);
        // @ts-ignore
        this.modalEl.classList.add(this.state.ui.alert.hideClass);
        event.preventDefault();
    }

    confirmDelete(event:Event) {
        // @ts-ignore
        this.modalEl.classList.remove(this.state.ui.alert.showClass);
        // @ts-ignore
        this.modalEl.classList.add(this.state.ui.alert.hideClass);
        event.preventDefault();
        // @ts-ignore
        let entryId = this.modalEl.getAttribute(this.state.controller.events.entry.eventDataKeyId);
        logger(`Handling Delete Entry ${entryId}`);
        if (entryId) {
            // find the entry from the state manager
            entryId = parseInt(entryId);
            // @ts-ignore
            const entry = controller.getStateManager().findItemInState(this.state.stateNames.entries,{id:entryId},isSame);
            if (entry) {
                // delete the entry using the controller and remove the state manager
                controller.deleteEntry(entry);
                // @ts-ignore
                controller.getStateManager().removeItemFromState(this.state.stateNames.entries,entry,isSame);
            }
        }
    }

    async componentDidMount() {
        logger('component Did Mount');

        // add the additional views and configure them
        //this.commentView = new CommentSidebarView(this, document,controller.getStateManager());
        //this.commentView.onDocumentLoaded(); // reset the view state

        this.chatView = new ChatSidebarView(this,document,controller.getStateManager());
        this.chatView.onDocumentLoaded();

        this.detailsView = new DetailsSidebarView(this,document,controller.getStateManager());
        this.detailsView.onDocumentLoaded();


        this.userSearchView = new UserSearchSidebarView(this,document,controller.getStateManager());
        this.userSearchView.onDocumentLoaded();

        // navigation item handlers
        if (document) {
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.showMyFavourites).addEventListener('click', () => {});
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.boardGameSearchId).addEventListener('click', () => {});
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.userSearchId).addEventListener('click', this.handleShowUserSearch);
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.chatId).addEventListener('click', this.handleShowChat);
        }

        // alert modal dialog setup
        // @ts-ignore
        this.modalEl = document.getElementById(this.state.ui.alert.modalId);
        // @ts-ignore
        this.titleEl = document.getElementById(this.state.ui.alert.titleId);
        // @ts-ignore
        this.contentEl = document.getElementById(this.state.ui.alert.contentId);
        // @ts-ignore
        this.cancelBtnEl = document.getElementById(this.state.ui.alert.cancelButtonId);
        // @ts-ignore
        this.confirmBtnEl = document.getElementById(this.state.ui.alert.confirmButtonId);
        // @ts-ignore
        this.closeBtnEl = document.getElementById(this.state.ui.alert.closeButtonId);

        // event listeners for the confirm delete of entry
        if (this.cancelBtnEl) this.cancelBtnEl.addEventListener('click',this.cancelDelete);
        if (this.confirmBtnEl) this.confirmBtnEl.addEventListener('click',this.confirmDelete);
        if (this.closeBtnEl) this.closeBtnEl.addEventListener('click',this.cancelDelete);

        // ok lets try get things done
        controller.initialise();
    }

    hideAllSideBars() {
        //this.commentView.eventHide(null);
        //this.detailsView.eventHide(null);
    }

    handleShowMyEntries(event:Event) {
        logger('Handling Show My Entries');
        this.hideAllSideBars();
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        this.setState({applyUserFilter:true});
    }

    handleAllEntries(event:Event) {
        logger('Handling Show All Entries');
        this.setState({applyUserFilter:false});
        this.hideAllSideBars();
    }

    handleShowUserSearch(event:Event) {
        logger('Handling Show User Search');
        event.preventDefault();
        this.hideAllSideBars();
        // prevent anything from happening if we are not logged in
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        this.userSearchView.eventShow(event);
    }

    handleShowChat(event:Event) {
        logger('Handling Show Chat');
        event.preventDefault();
        this.hideAllSideBars();
        // prevent anything from happening if we are not logged in
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        this.chatView.eventShow(event);
    }

    handleAddEntry(event:Event) {
        logger('Handling Add Entry');
        event.preventDefault();
        this.hideAllSideBars();
        // prevent anything from happening if we are not logged in
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        // find the current user
        // @ts-ignore
        let creator = controller.getStateManager().findItemInState(this.state.stateNames.users,
            {id: controller.getLoggedInUserId()},
             isSame);
        logger(creator);
        // create an empty entry
        let entry = {
            title: '',
            content: '',
            createdBy: creator.id,
            changedOn: parseInt(moment().format('YYYYMMDDHHmmss')),
            Comments: [],
            User: {
                id: creator.id,
                username: creator.username
            }
        }
        logger(entry);
        this.setState({selectedEntry:entry});
        // @ts-ignore
        controller.getStateManager().setStateByName(this.state.stateNames.selectedEntry,entry);
        this.detailsView.eventShow(event);
    }

    handleAddComment(event:Event) {
        logger('Handling Add Comment');
        event.preventDefault();
        logger('entry comments');
        // @ts-ignore
        let entry = controller.getStateManager().getStateByName(this.state.stateNames.selectedEntry);
        logger(entry.comments.length);

        // get the comment element
        // @ts-ignore
        let commentEl:HTMLInputElement = document.getElementById(this.state.ui.commentSideBar.dom.commentId);
        if (commentEl && commentEl.value.trim().length === 0) return;

        // prevent anything from happening if we are not logged in
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        // find the current user
        // @ts-ignore
        let creator = controller.getStateManager().findItemInState(this.state.stateNames.users,
            {id: controller.getLoggedInUserId()},
                  isSame);
        logger('user');
        logger(creator);
        // find the selected entry
        if (entry && commentEl) {
            // create an empty comment
            // @ts-ignore

            let comment = {
                createdBy: creator.id,
                commentOn: entry.id,
                changedOn: parseInt(moment().format('YYYYMMDDHHmmss')),
                content: commentEl.value.trim()
            }
            commentEl.value = '';
            logger('comment');
            logger(comment);
            controller.addComment(comment);

        }
    }

    handleSelectEntryComments(event:MouseEvent) {
        logger('Handling Select Entry Comments');
        event.preventDefault();
        this.hideAllSideBars();
        // @ts-ignore
        let entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
        logger(`Handling Show Edit Entry ${entryId}`);
        if (entryId) {
            // find the entry from the state manager
            entryId = parseInt(entryId);
            // @ts-ignore
            const entry = controller.getStateManager().findItemInState(this.state.stateNames.entries,{id:entryId},isSame);
            logger(entry);
            if (entry) {
                // select the entry and open the details sidebar
                this.setState({selectedEntry:entry});
                // @ts-ignore
                controller.getStateManager().setStateByName(this.state.stateNames.selectedEntry,entry);
                this.commentView.eventShow(event);
            }
        }
    }

    handleShowEditEntry(event:Event) {
        event.preventDefault();
        this.hideAllSideBars();
        // @ts-ignore
        let entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
        logger(`Handling Show Edit Entry ${entryId}`);
        if (entryId) {
            // find the entry from the state manager
            entryId = parseInt(entryId);
            // @ts-ignore
            const entry = controller.getStateManager().findItemInState(this.state.stateNames.entries,{id:entryId},isSame);
            logger(entry);
            if (entry) {
                // select the entry and open the details sidebar
                this.setState({selectedEntry:entry});
                // @ts-ignore
                controller.getStateManager().setStateByName(this.state.stateNames.selectedEntry,entry);
                this.detailsView.eventShow(event);
            }
        }
    }

    handleDeleteEntry(event:Event) {
        event.preventDefault();
        this.hideAllSideBars();
        // @ts-ignore
        let entryId = event.target.getAttribute(this.state.controller.events.entry.eventDataKeyId);
        logger(`Handling Delete Entry ${entryId}`);
        if (entryId) {
            // @ts-ignore
            this.modalEl.setAttribute(this.state.controller.events.entry.eventDataKeyId,entryId);
            // find the entry from the state manager
            entryId = parseInt(entryId);
            // @ts-ignore
            const entry = controller.getStateManager().findItemInState(this.state.stateNames.entries,{id:entryId},isSame);
            this.alert(entry.title,"Are you sure you want to delete this blog entry?")
        }
    }

    handleDeleteComment(id:number):void {
        controller.deleteComment(id);
    }

    // @ts-ignore
    handleUpdateEntry(entry:any) {
        this.hideAllSideBars();
        controller.updateEntry(entry);
    }
}

//localStorage.debug = 'app view-ts controller-ts socket-ts api-ts local-storage-ts state-manager-ts view-ts:blogentry view-ts:comments view-ts:details';
//localStorage.debug = 'app controller-ts socket-ts api-ts local-storage-ts state-manager-ts indexeddb-ts user-search-sidebar user-search-sidebar:detail state-manager-ms state-manager-api state-manager-aggregate state-manager-async';
localStorage.debug = 'app controller-ts socket-ts socket-listener notification-controller chat-manager chat-sidebar chat-sidebar:detail';
debug.log = console.info.bind(console);

// @ts-ignore
const element = <Root className="container-fluid justify-content-around"/>;

ReactDOM.render(element, document.getElementById('root'));
