import debug from 'debug';

import {Invitation, Message} from "../socket/Types";
import {MessageEventListener} from "../socket/ChatEventListener";
import {ChatManager} from "../socket/ChatManager";

const sscLogger = debug('score-sheet-controller');

export class ScoreSheetController implements MessageEventListener{
    private static _instance: ScoreSheetController;

    public static getInstance(): ScoreSheetController {
        if (!(ScoreSheetController._instance)) {
            ScoreSheetController._instance = new ScoreSheetController();
        }
        return ScoreSheetController._instance;
    }

    private applicationView:any|null = null;
    private invitation:Invitation|null = null;

    private constructor() {}

    public setupScoreSheet(appView:any, invitation:Invitation):void{
        this.applicationView = appView;
        this.invitation = invitation;
        ChatManager.getInstance().addMessageListener(this);
    }

    public endScoreSheet():void {
        alert('Implement end score sheet');
        ChatManager.getInstance().removeMessageListener(this);
    }



    receiveMessage(message: Message): void {
        // the attachment should have all the data we need to display the scoresheet
        /*scoreSheet: {
              room: ''
                boardGameName: '',
                sheetLayoutOptions: {},
            timer: 0,
                sheetData: {}
        }*/
        // are we scoring the right sheet?
        sscLogger(`Received message for score sheet ${message.room}`);
        sscLogger(message);
        if (message.attachment && this.invitation) {
            if (message.room === this.invitation.room) {
                alert ('TO DO scoresheet')
            }

        }

    }

}