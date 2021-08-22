/* eslint "react/react-in-jsx-scope":"off" */
/* eslint "react/jsx-no-undef":"off" */
import React from 'react';
import ReactDOM from 'react-dom';
import debug from 'debug';

import controller from './Controller';
import UserSearchSidebarView from "./component/UserSearchSidebarView";
import ChatSidebarView from "./component/ChatSidebarView";
import BoardGameSearchSidebarView from "./component/BoardGameSerachSidebarView";
import BoardGameView from "./component/BoardGameView";


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
    private bggSearchView: BoardGameSearchSidebarView;
    // @ts-ignore
    private chatView: ChatSidebarView;

    // @ts-ignore
    private cancelBtnEl: HTMLElement | null;
    // @ts-ignore
    private confirmBtnEl: HTMLElement | null;
    // @ts-ignore
    private closeBtnEl: HTMLElement | null;

    // @ts-ignore
    private thisEl: HTMLDivElement | null;

    constructor() {
        // @ts-ignore
        super();
        this.state = {
            isLoggedIn: false,
            loggedInUserId: -1,
            boardGames: [],
            selectedEntry: {},
            stateNames: {
                users: 'users',
                boardGames: 'boardGames',
                scores: 'scores',
                selectedEntry: 'selectedEntry',
                recentUserSearches: 'recentUserSearches',
                bggSearchResults: 'bggSearchResults'
            },
            apis: {
                login: '/api/login',
                graphQL: '/graphql',
                bggSearchCall: 'query {\n' +
                    '  findBoardGames(query: "@") {\n' +
                    '    id, name, year\n' +
                    '  }\n' +
                    '} ',
                bggSearchCallById: {
                    queryString: 'query {\n' +
                            '  getBoardGameDetails(id: {id:@}) {\n' +
                        '    id,thumb,image,name,description,year, minPlayers, maxPlayers, minPlayTime, maxPlayTime, minAge, designers, artists, publisher, numOfRaters, averageScore, rank, categories  \n' +
                        '  }\n' +
                        '}',
                    resultName:'getBoardGameDetails',
                },
                findUsers: {
                    queryString: 'query {\n  findUsers {\n    id, username\n  }\n}',
                    resultName: 'findUsers',
                },


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
                        isDeleteable: true,
                        deleteButtonClasses: 'btn btn-circle btn-xsm',
                        deleteButtonText: '',
                        deleteButtonIconClasses:'fas fa-trash-alt',
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
                        chatLogRoomId: 'chatLogRoom',
                        leaveChatId: 'leaveChat'
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
                boardGameSearchSideBar: {
                    dom: {
                        sideBarId: 'boardGameSearchSidebar',
                        resultsId: 'bggSearchResults',
                        resultsElementType: 'a',
                        resultsElementAttributes: [
                            ['href', '#'],
                        ],
                        resultsClasses: 'list-group-item my-list-item truncate-notification list-group-item-action',
                        resultDataKeyId: 'bgg-id',
                        resultLegacyDataKeyId: 'bgg-id',
                        resultDataSourceId: 'data-source',
                        resultDataSourceValue: 'bggSearch',
                        modifierClassNormal: 'list-group-item-primary',
                        modifierClassInactive: 'list-group-item-light',
                        modifierClassActive: 'list-group-item-info',
                        modifierClassWarning: 'list-group-item-danger',
                        iconNormal: '   <i class="fas fa-dice"></i>',
                        iconInactive: '   <i class="fas fa-dice"></i>',
                        iconActive: '   <i class="fas fa-dice"></i>',
                        iconWarning: '  <i class="fas fa-dice"></i>',
                        resultContentDivClasses: 'd-flex w-100 justify-content-between',
                        resultContentTextElementType: 'span',
                        resultContentTextClasses: 'mb-1',
                        isDraggable: true,
                        isClickable: true,
                        isDeleteable: true,
                        deleteButtonClasses: 'btn btn-circle btn-xsm',
                        deleteButtonText: '',
                        deleteButtonIconClasses:'fas fa-trash-alt',
                        formId: 'bggSearch',
                        queryId: 'queryText',
                        buttonId: 'bggSearchButton'
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
                boardGameSearchSideBar: {
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

        this.handleShowUserSearch = this.handleShowUserSearch.bind(this);
        this.handleShowChat = this.handleShowChat.bind(this);
        this.handleShowBGGSearch = this.handleShowBGGSearch.bind(this);

        this.handleDragOver = this.handleDragOver.bind(this);
        this.handleDrop = this.handleDrop.bind(this);

        controller.connectToApplication(this, window.localStorage);
    }

    private handleDragOver(event:DragEvent) {
        event.preventDefault();
    }

    private handleDrop(event:Event) {
        // @ts-ignore
        const draggedObjectJSON = event.dataTransfer.getData(this.state.ui.draggable.draggableDataKeyId);
        logger(draggedObjectJSON);
        const draggedObject = JSON.parse(draggedObjectJSON);
        logger(draggedObject);
        // @ts-ignore
        if (draggedObject[this.state.ui.draggable.draggedType] === this.state.ui.draggable.draggedTypeBoardGame) {
            this.addBoardGame(draggedObject);
        }

    }

    public addBoardGame(draggedObject:any) {
        // ok, we are just the dumb view, pass this onto the controller to work out the logic for us
        controller.addBoardGame(draggedObject);
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
        let boardGames:any[] = this.state.boardGames;
        logger(boardGames);

        const games = boardGames.map((entry, index:number) =>
            <BoardGameView
                key={index}
                boardGame={entry}
                deleteEntryHandler={() => {}}
                showScoresHandler={() => {}}
            />
        );

        return (
            <div className="root container-fluid">
                <div className="card-group">
                    {games}
                </div>
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
        let id = this.modalEl.getAttribute(this.state.controller.events.entry.eventDataKeyId);
        logger(`Handling Delete with id ${id}`);
    }

    async componentDidMount() {
        logger('component Did Mount');


        this.chatView = new ChatSidebarView(this,document,controller.getStateManager());
        this.chatView.onDocumentLoaded();

        this.userSearchView = new UserSearchSidebarView(this,document,controller.getStateManager());
        this.userSearchView.onDocumentLoaded();


        this.bggSearchView = new BoardGameSearchSidebarView(this,document,controller.getStateManager());
        this.bggSearchView.onDocumentLoaded();

        // navigation item handlers
        if (document) {
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.showMyFavourites).addEventListener('click', () => {});
            // @ts-ignore
            document.getElementById(this.state.ui.navigation.boardGameSearchId).addEventListener('click', this.handleShowBGGSearch);
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

        // a reference to the div containing ourselves
        // @ts-ignore
        this.thisEl = document.getElementById('root');
        if (this.thisEl) {
            this.thisEl.addEventListener('dragover', this.handleDragOver);
            this.thisEl.addEventListener('drop', this.handleDrop);
        }

        // ok lets try get things done
        controller.initialise();
    }

    hideAllSideBars() {
        this.chatView.eventHide(null);
        this.userSearchView.eventHide(null);
        this.bggSearchView.eventHide(null);
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

    handleShowBGGSearch(event:Event) {
        logger('Handling Show BGG Search View');
        event.preventDefault();
        this.hideAllSideBars();
        // prevent anything from happening if we are not logged in
        if (!controller.isLoggedIn()) {
            // @ts-ignore
            window.location.href = this.state.apis.login;
            return;
        }
        this.bggSearchView.eventShow(event);
    }

}

//localStorage.debug = 'app view-ts controller-ts socket-ts api-ts local-storage-ts state-manager-ts view-ts:blogentry view-ts:comments view-ts:details';
//localStorage.debug = 'app controller-ts socket-ts api-ts local-storage-ts state-manager-ts indexeddb-ts user-search-sidebar user-search-sidebar:detail state-manager-ms state-manager-api state-manager-aggregate state-manager-async';
//localStorage.debug = 'app controller-ts socket-ts socket-listener notification-controller chat-manager chat-sidebar chat-sidebar:detail';
localStorage.debug = 'app controller-ts api-ts board-game-search-sidebar board-game-search-sidebar:detail view-ts:boardgameview';
debug.log = console.info.bind(console);

// @ts-ignore
const element = <Root className="container-fluid justify-content-around"/>;

ReactDOM.render(element, document.getElementById('root'));
