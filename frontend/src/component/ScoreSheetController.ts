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
    private currentUsername = '';


    private constructor() {}

    receiveLogin(username: string): void {}
    receiveLogout(username: string): void {}
    public setCurrentUser(username:string):void {
        sscLogger(`Setting current user ${username}`);
        this.currentUsername = username;
    }
    public getCurrentUser():string {
        return this.currentUsername;
    }

    public initialise(view:ScoreSheetView) {
        this.scoreSheetView = view;
    }

    receiveInvitation(invite: Invitation): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        if (ChatManager.getInstance().isUserInBlockedList(invite.from)) {
            sscLogger(`Received invite from blocked user - ignoring`);
            return;
        }

        // is this a chat room or score sheet?
        if (invite.type === InviteType.ChatRoom) return; // ignore chat rooms


        if (invite.requiresAcceptDecline) {
            // notify the user of the invitation
            if (!controller.askUserAboutInvitation(invite)) {
                socketManager.sendDeclineInvite(invite.room,this.getCurrentUser());
            }; // user declines to join the scoresheet
        }
        else {
            // notify the user of the new chat
            notifier.show('Score Sheet',`Joining score sheet`,'info',7000);
            socketManager.joinChat(this.getCurrentUser(),invite.room);
            this.currentScoreRoom = invite.room;
            // change to the score sheet
            this.applicationView.handleShowScoreSheet(null);
        }
    }

    receiveQueuedMessages(messages: any): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
        if (!this.currentScoreRoom) return; // we are not in a room

        messages.forEach((message:Message) => {
            if (this.currentScoreRoom === message.room) {
                this.receiveMessage(message);
            }
        });
    }


    receiveQueuedInvites(invites: any): void {
        // not implemented, the user needs to be online for a scoresheet
    }

    receiveJoinedRoom(users: JoinLeft): void {
        if (this.currentScoreRoom !== users.room) return;

        // update the sheet to include the user
        XXX
    }

    receivedLeftRoom(users: JoinLeft): void {
        if (this.currentScoreRoom !== users.room) return;
        // update the sheet to remove the user
    }

    receiveUserList(users: string[]): void {} // will be managed in the transfer of sheet data


    public endScoreSheet():void {
        alert('Implement end score sheet');
        // send the final score to everyone
        if (controller.isLoggedIn()) {
            if (this.currentScoreRoom) {
                this.sendScoreSheetState(true);
            }
        }
    }

    private getDefaultScoreSheetTemplate(boardGame:any) {
        return {}
        XXXX
    }

    private getScoreSheetTemplate(boardGame:any) {
        return {

        }
        XXXX
    }

    public startScoreSheet(boardGame:any):void {
        if (boardGame) {
            sscLogger(`Starting score sheet for ${boardGame.name}`);
            this.currentlySelectedBoardGame = boardGame;
            this.currentScoreRoom = uuid.getUniqueId();
            this.currentScoreSheet = {
                room: this.currentScoreRoom,
                boardGameName: boardGame.name,
                sheetLayoutOptions: {},
                timer:0,
                sheetData: {},
                isFinished:false
            }

            // start a new chat room, will automatically manage if logged in or not
            if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
            socketManager.joinChat(this.getCurrentUser(),this.currentScoreRoom);
        }
    }

    public hasActiveScoreSheet():boolean {
        let result = false;
        if ((this.currentScoreRoom) && (this.currentScoreSheet)) result = true;
        return result;
    }

    public inviteUser(username:string) {
        // only the user who created the score sheet can do this as they are the only ones with a selected board game
        if ((this.currentScoreRoom) && (this.currentlySelectedBoardGame)) {
            sscLogger(`Inviting user ${username} to score sheet`);
            if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in
            socketManager.sendInvite(this.getCurrentUser(),username,this.currentScoreRoom,InviteType.ScoreSheet,true,this.currentlySelectedBoardGame.name);
        }
    }

    receiveMessage(message: Message): void {
        if (this.getCurrentUser().trim().length === 0) return;  // we are not logged in

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
                    XXX
                }
            }

        }
    }

    public sendScoreSheetState(isFinished:boolean = false) {
XXX
    }



}