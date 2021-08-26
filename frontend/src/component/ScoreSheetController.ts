import debug from 'debug';

import {Invitation, InviteType, JoinLeft, Message} from "../socket/Types";
import {ChatReceiver} from "../socket/ChatReceiver";
import controller from "../Controller";
import notifier from "../notification/NotificationManager";
import {ScoreSheetView} from "./ScoreSheetView";
import {ScoreSheet} from "../AppTypes";
import uuid from "../util/UUID";
import socketManager from "../socket/SocketManager";
import {ChatManager} from "../socket/ChatManager";
import {StateManager} from "../state/StateManager";
import BrowserStorageStateManager from "../state/BrowserStorageStateManager";

const sscLogger = debug('score-sheet-controller');

export class ScoreSheetController implements ChatReceiver {
    private static _instance: ScoreSheetController;

    public static getInstance(): ScoreSheetController {
        if (!(ScoreSheetController._instance)) {
            ScoreSheetController._instance = new ScoreSheetController();
        }
        return ScoreSheetController._instance;
    }

    private applicationView: any | null = null;
    private scoreSheetView: ScoreSheetView|null = null;
    private currentScoreRoom: string|null = null;
    private currentlySelectedBoardGame: any|null = null;
    private currentScoreSheet: ScoreSheet|null = null;
    private currentUsername:string = '';
    private isRoomCreator:boolean = false;
    private stateManager:StateManager;
    private currentUsersInScoreSheet:string[] = [];
    private intervalTimer:number = -1;


    private constructor() {
        this.stateManager = new BrowserStorageStateManager(true);
        socketManager.addChatReceiver(this);

        // bind events
        this.receiveLogin = this.receiveLogin.bind(this);
        this.receiveLogout = this.receiveLogout.bind(this);
        this.receiveInvitation = this.receiveInvitation.bind(this);
        this.receiveMessage = this.receiveMessage.bind(this);
        this.receiveQueuedMessages = this.receiveQueuedMessages.bind(this);
        this.receiveQueuedInvites = this.receiveQueuedInvites.bind(this);
        this.receiveJoinedRoom = this.receiveJoinedRoom.bind(this);
        this.receivedLeftRoom = this.receivedLeftRoom.bind(this);

        // reset state
        this.reset();

    }

    private reset():void {
        this.currentScoreRoom = null;
        this.currentScoreSheet = null;
        this.currentlySelectedBoardGame = null;
        this.isRoomCreator = false;
        this.currentUsersInScoreSheet = [];
    }

    public isTimerGoing(): boolean {
        let result = false;
        if (this.currentScoreSheet) {
            result = this.currentScoreSheet.timerGoing;
        }
        return result;
    }

    public getStateManager() {
        return this.stateManager;
    }


    receiveLogin(username: string): void {}
    receiveLogout(username: string): void {}

    public setCurrentUser(username:string):void {
        sscLogger(`Setting current user ${username}`);
        this.currentUsername = username;
    }
    public getCurrentUser():string {
        return this.currentUsername;
    }

    public initialise(applicationView:any) {
        this.applicationView = applicationView;
    }

    private isLoggedIn():boolean {
        return (this.getCurrentUser().trim().length > 0);
    }

    receiveInvitation(invite: Invitation): void {
        if (!this.isLoggedIn()) return;  // we are not logged in
        if (invite.type !== InviteType.ScoreSheet) return; //ignore non-score sheets

        if (ChatManager.getInstance().isUserInBlockedList(invite.from)) {
            sscLogger(`Received invite from blocked user - ignoring`);
            return;
        }

        // are we already in a scoresheet?
        if (this.currentScoreRoom) {
            // are we already in this score sheet?
            if (this.currentScoreRoom !== invite.room) {
                // decline the invite, only one score sheet at a time
                socketManager.sendDeclineInvite(invite.room,this.getCurrentUser());// user declines to join the scoresheet
            }
        }

        if (invite.requiresAcceptDecline) {
            // notify the user of the invitation
            if (!this.askUserAboutInvitation(invite)) {
                socketManager.sendDeclineInvite(invite.room,this.getCurrentUser());// user declines to join the scoresheet
            };
        }
        // notify the user of the new chat
        notifier.show('Score Sheet',`Joining score sheet`,'info',7000);
        socketManager.joinChat(this.getCurrentUser(),invite.room);
        this.currentScoreRoom = invite.room;
        // change to the score sheet
        this.applicationView.handleShowScoreSheet(null);
    }

    askUserAboutInvitation(invite:Invitation):boolean {
        return confirm(`You have been invited by user ${invite.from} to joint a chat room for the board game ${invite.subject} score sheet`);
    }


    receiveQueuedMessages(messages: any): void {
        if (!this.isLoggedIn()) return;  // we are not logged in

        if (!this.currentScoreRoom) return; // we are not in a room

        messages.forEach((message:Message) => {
            if (message.type === InviteType.ScoreSheet) {  // only process offline messages for scoresheet and our current room
                if (this.currentScoreRoom === message.room) {
                    this.receiveMessage(message);
                }
            }
        });
    }


    receiveQueuedInvites(invites: any): void {
        // not implemented, the user needs to be online for a scoresheet
    }

    receiveDecline(room: string, username: string): void {
        if (this.currentScoreRoom) {
            if (this.currentScoreRoom === room) {
                notifier.show('Score Sheet',`User ${username} declined the invitation.`,'warning');
            }
        }
    }

    receiveJoinedRoom(users: JoinLeft): void {
        if (!this.isLoggedIn()) return;  // we are not logged in

        if (this.currentScoreRoom !== users.room) return;

        // update the sheet to include the user
        let index = this.currentUsersInScoreSheet.findIndex((username) => username === users.username);
        if (index < 0) {
            this.currentUsersInScoreSheet.push(users.username);
            // update the sheet data
            this.addUserToScoreSheet(users.username);
            // the owner of the sheet should send a sync message of the data
            if (this.isRoomCreator) {
                this.sendScoreSheetState(false);
            }
        }
    }

    receivedLeftRoom(users: JoinLeft): void {
        if (!this.isLoggedIn()) return;  // we are not logged in

        if (this.currentScoreRoom !== users.room) return;
        // update the sheet to remove the user
        let index = this.currentUsersInScoreSheet.findIndex((username) => username === users.username);
        if (index >= 0) {
            this.currentUsersInScoreSheet.splice(index,1);
            // update the sheet data
            this.removeUserFromScoreSheet(users.username);
            // the owner of the sheet should send a sync message of the data
            if (this.isRoomCreator) {
                this.sendScoreSheetState(false);
            }
        }
    }

    receiveUserList(users: string[]): void {} // will be managed in the transfer of sheet data


    public endScoreSheet():void { // this can only be done by the room creator
        // send the final score to everyone
        if (this.isLoggedIn()) {
            if (this.currentScoreRoom) {
                this.sendScoreSheetState(true);
                // if we are logged in and the scoresheet creator then we need to save the score sheet to the selected board game
                if (this.isLoggedIn() && this.isRoomCreator && this.currentScoreSheet) this.saveScoreSheetToBoardGame(this.currentScoreSheet);
                // reset the controller
                this.reset();
            }
        }
    }

    private saveScoreSheetToBoardGame(scoreSheet:ScoreSheet) {
        alert("Implement save");
    }


    private getDefaultScoreSheetTemplate(boardGame:any) {
        return {}
    }

    private getDefaultScoreSheetStartingData(boardGame:any) {
        return {}
    }

    private getScoreSheetTemplate(boardGame:any) {
        return this.getDefaultScoreSheetTemplate(boardGame);
    }

    private getScoreSheetStartingData(boardGame:any) {
        return this.getDefaultScoreSheetStartingData(boardGame);
    }

    public startScoreSheet(boardGame:any):void {
        if (boardGame) {
            sscLogger(`Starting score sheet for ${boardGame.name}`);
            this.currentlySelectedBoardGame = boardGame;
            this.currentUsersInScoreSheet = [this.getCurrentUser()];
            this.isRoomCreator = true;
            this.currentScoreRoom = uuid.getUniqueId();
            this.currentScoreSheet = {
                room: this.currentScoreRoom,
                boardGameName: boardGame.name,
                sheetLayoutOptions: this.getScoreSheetTemplate(boardGame),
                timer:0,
                timerGoing:false,
                sheetData: this.getScoreSheetStartingData(boardGame),
                isFinished:false
            }

            // store the score sheet locally
            this.stateManager.setStateByName(this.applicationView.stateNames.scoreSheet,this.currentScoreSheet,false);

            // start a new chat room, will automatically manage if logged in or not
            if (this.isLoggedIn()) socketManager.joinChat(this.getCurrentUser(),this.currentScoreRoom);
        }
    }

    public hasActiveScoreSheet():boolean {
        let result = false;
        if ((this.currentScoreRoom) && (this.currentScoreSheet)) result = true;
        return result;
    }

    public inviteUser(username:string) {
        if (!this.isLoggedIn()) return;  // we are not logged in
        // only the user who created the score sheet can do this as they are the only ones with a selected board game
        if ((this.currentScoreRoom) && (this.currentlySelectedBoardGame) && (this.isRoomCreator)) {
            sscLogger(`Inviting user ${username} to score sheet`);
            socketManager.sendInvite(this.getCurrentUser(),username,this.currentScoreRoom,InviteType.ScoreSheet,true,this.currentlySelectedBoardGame.name);
        }
    }

    public receiveMessage(message: Message): void {
        if (!this.isLoggedIn()) return;  // we are not logged in
        if (message.type !== InviteType.ScoreSheet) return; //ignore non-score sheets

        if (this.currentScoreRoom) { // are we in a room?
            if (this.currentScoreRoom === message.room) { // are we listening to this score sheet room?
                if (ChatManager.getInstance().isUserInBlockedList(message.from)) {
                    sscLogger(`Received message from blocked user - ignoring`);
                    return;
                }
                // are we scoring the right sheet?
                sscLogger(`Received message for score sheet ${message.room}`);
                sscLogger(message);
                if (message.attachment) {
                    // the attachment should be a ScoreSheet object
                    let scoreSheet:ScoreSheet = message.attachment;
                    // only update the scoresheet if the timer value is higher from the attachement
                    // @ts-ignore
                    if (scoreSheet.timer > this.currentScoreSheet.timer) {
                        this.currentScoreSheet = scoreSheet;
                    }
                    // save the new state
                    this.saveCurrentScoreSheet();
                }
            }

        }
    }

    private saveCurrentScoreSheet() {
        this.currentScoreSheet = this.createScoreSheetFromTable();
        this.stateManager.setStateByName(this.applicationView.stateNames.scoreSheet,this.currentScoreSheet,false);
    }

    public createScoreSheetFromTable():ScoreSheet {
        let tableData = ScoreSheetView.getInstance().getTableData();
        if (this.currentScoreSheet) {
            let scoreSheet:ScoreSheet = {
                room:
            }

        }

    }

    public sendScoreSheetState(isFinished:boolean = false):void {

    }

    public updateDisplay(scoreSheet:ScoreSheet) {

    }

    protected addUserToScoreSheet(username:string):void {

    }

    protected removeUserFromScoreSheet(username:string):void {

    }


    public startTimer() {
        if (!this.currentScoreSheet) return;

        this.currentScoreSheet.timerGoing = true;
        this.intervalTimer = setInterval(() => {
            if (this.currentScoreSheet && this.currentScoreSheet.timerGoing) {
                this.currentScoreSheet.timer ++;
                ScoreSheetView.getInstance().updateTimer(this.currentScoreSheet.timer,this.currentScoreSheet.timerGoing);
            }
            else {
                if (this.currentScoreSheet) this.currentScoreSheet.timerGoing = false;
            }
        },1000);
        if (this.isLoggedIn()) {
            // start the timer for everyone
            this.sendScoreSheetState(false);
        }
    }

    public pauseTimer() {
        if (this.intervalTimer > 0) {
            if (this.currentScoreSheet) this.currentScoreSheet.timerGoing = false;
            // ask everyone to pause their timers
            if (this.isLoggedIn()) {
                this.sendScoreSheetState(false);
            }
        }
    }

    public userChangedValue() {
        if (this.currentScoreSheet) {
            if (this.isLoggedIn()) {
                this.sendScoreSheetState(false);
            }
        }
    }
}
