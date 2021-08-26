import StateChangeListener from "../state/StateChangeListener";
import {ScoreSheetController} from "./ScoreSheetController";
import Handsontable from "handsontable";
import browserUtil from "../util/BrowserUtil";
import debug from 'debug';
import {ScoreSheet} from "../AppTypes";

const ssvLogger = debug('score-sheet-view');

export class ScoreSheetView implements StateChangeListener{
    private static _instance: ScoreSheetView;

    public static getInstance(): ScoreSheetView {
        if (!(ScoreSheetView._instance)) {
            ScoreSheetView._instance = new ScoreSheetView();
        }
        return ScoreSheetView._instance;
    }

    private applicationView:any|null = null;

    private thisEl:HTMLDivElement|null = null;
    private boardGameTitleEl:HTMLHeadingElement|null = null;
    private startStopTimer:HTMLButtonElement|null = null;
    private timerEl:HTMLDivElement|null = null;
    private endOrLeaveEl:HTMLButtonElement|null = null;
    private scoreSheetEl:HTMLDivElement|null = null;

    private table:Handsontable|null = null;

    private controller:ScoreSheetController;

    private constructor() {
        this.controller = ScoreSheetController.getInstance();
    }

    public onDocumentLoaded(applicationView:any) {
        this.applicationView = applicationView;
        this.resetDisplay();

        ScoreSheetController.getInstance().getStateManager().addChangeListenerForName(this.applicationView.state.stateNames.scoreSheet,this);

        // load references to the key elements on the page
        // @ts-ignore
        this.thisEl = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.dropZone);
        // @ts-ignore
        this.boardGameTitleEl = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.boardGame);
        // @ts-ignore
        this.startStopTimer = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.startStopTimer);
        // @ts-ignore
        this.timerEl = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.timer);
        // @ts-ignore
        this.endOrLeaveEl = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.end);
        // @ts-ignore
        this.scoreSheetEl = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.scoreSheet);

        // bind event handlers
        this.handleStartStopTimer = this.handleStartStopTimer.bind(this);
        this.handleEndOrLeave = this.handleEndOrLeave.bind(this);
        this.handleUserDrop = this.handleUserDrop.bind(this);

        // setup event handlers
        if (this.startStopTimer) this.startStopTimer.addEventListener('click',this.handleStartStopTimer);
        if (this.endOrLeaveEl) this.endOrLeaveEl.addEventListener('click',this.handleEndOrLeave);
        if (this.thisEl) {
            this.thisEl.addEventListener('dragover',(event) => {event.preventDefault()});
            this.thisEl.addEventListener('drop',this.handleUserDrop);
        }
    }

    handleEndOrLeave(event:MouseEvent) {
        ssvLogger('leave or end');
        // are we leaving or ending?
        if (this.controller.hasActiveScoreSheet() && this.controller.isSheetOwner()) {
            // finishing the score sheet
            // double check this is want we want
            if (!confirm("Are you sure you want to close the score sheet")) return;

            // user wants to finish
            this.controller.endScoreSheet();

            // reset the display
            this.resetDisplay();
        }
        else {
            // leavingg the score sheet
            // double check this is want we want
            if (!confirm("Are you sure you want to leave the score sheet")) return;

            // user wants to finish
            this.controller.leave();

            // reset the display
            this.resetDisplay();
        }
    }

    handleStartStopTimer(event:MouseEvent) {
        ssvLogger('start/pause timer');
        if (this.controller.isTimerGoing()) {
            this.controller.pauseTimer();
        }
        else {
            this.controller.startTimer();
        }
    }

    handleUserDrop(event:Event) {
        ssvLogger('drop event on current score sheet');
        if (this.controller.hasActiveScoreSheet() && this.controller.isSheetOwner()) {
            // @ts-ignore
            const draggedObjectJSON = event.dataTransfer.getData(this.applicationView.state.ui.draggable.draggableDataKeyId);
            const draggedObject = JSON.parse(draggedObjectJSON);
            ssvLogger(draggedObject);

            if (draggedObject[this.applicationView.state.ui.draggable.draggedType] === this.applicationView.state.ui.draggable.draggedTypeUser) {
                //add the user to the current chat if not already there
                this.controller.inviteUser(draggedObject.username);
            }
        }
    }


    private resetDisplay() {
        this.table = null;

        // reset the display
        if (this.boardGameTitleEl) this.boardGameTitleEl.innerText = '';
        if (this.startStopTimer) this.startStopTimer.innerHTML = 'Start ' + this.applicationView.state.ui.scoreSheet.dom.iconStart;
        if (this.startStopTimer) this.startStopTimer.setAttribute("disabled", "true");
        if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(0);
        if (this.endOrLeaveEl) this.endOrLeaveEl.innerHTML = this.applicationView.state.ui.scoreSheet.dom.iconLeave;
        if (this.scoreSheetEl) browserUtil.removeAllChildren(this.scoreSheetEl);
    }

    private createTimerDisplay(timer:number):string {
        let result = '';
        if (timer === 0) {
            result = '00:00';
        }
        else {
            if (timer >= 60) {
                let hours = Math.floor(timer/3600);
                let minutes = Math.floor(timer/60);
                let seconds = timer - (hours*3600) - (minutes*60);
                if (hours > 0) {
                    result += `${hours}:`;
                }
                if (minutes > 0) {
                    if (minutes < 10) {
                        result += `0${minutes}:`
                    }
                    else {
                        result += `${minutes}:`
                    }
                }
                else {
                    result += '00:';
                }
                if (seconds > 0) {
                    if (seconds < 10) {
                        result += `0${seconds}`;
                    }
                    else {
                        result += `${seconds}`;
                    }
                }
            }
            else {
                result = `00:`;
                if (timer > 0) {
                    if (timer < 10) {
                        result += `0${timer}`;
                    }
                    else {
                        result += `${timer}`;
                    }
                }
            }
        }
        return result;
    }


    public updateTimer(time:number, isPaused:boolean = false) {
        // update the view
        ssvLogger(`Updating timer ${time} ${isPaused}`);
        if (this.startStopTimer) {
            if (isPaused) {
                this.startStopTimer.innerHTML = 'Start   ' + this.applicationView.state.ui.scoreSheet.dom.iconStart;
            }
            else {
                this.startStopTimer.innerHTML = 'Pause   ' + this.applicationView.state.ui.scoreSheet.dom.iconInProgress;
            }
            this.startStopTimer.removeAttribute("disabled");
        }
        if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(time);
    }

    stateChanged(managerName: string, name: string, newValue: any): void {
        let scoreSheet:ScoreSheet = newValue;
        ssvLogger(`Processing new state`);
        ssvLogger(scoreSheet);
        if (this.startStopTimer) this.startStopTimer.removeAttribute("disabled");

        // update the board game name
        if (this.boardGameTitleEl) this.boardGameTitleEl.innerText = `${scoreSheet.boardGameName}`;

        // update the table
        if (this.table) {
            // process the data in the state change, will be array of array (rows) into what the table wants
            let tableData:any = [];
            // @ts-ignore
            scoreSheet.data.forEach((row:any[],rowIndex:number) => {
                row.forEach((column:any, columnIndex:number) => {
                    tableData.push([rowIndex, columnIndex, column]);
                });
            });
            ssvLogger(`Table data is `);
            ssvLogger(tableData);
            // @ts-ignore
            this.table.setDataAtCell(tableData);

        }
        else {
            // create a new table

            if (this.scoreSheetEl) {
                scoreSheet.sheetLayoutOptions.data = scoreSheet.data;
                this.table = new Handsontable(
                    this.scoreSheetEl,
                    scoreSheet.sheetLayoutOptions);
                // @ts-ignore
                this.table.addHook('afterChange',this.controller.userChangedValue);
            }
        }


        // update the timer
        if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(scoreSheet.timer);


    }

    public getTableData():any[] {
        if (this.table) {
            return this.table.getData();
        }
        else {
            return [];
        }
    }

    stateChangedItemAdded(managerName: string, name: string, itemAdded: any): void {}
    stateChangedItemRemoved(managerName: string, name: string, itemRemoved: any): void {}
    stateChangedItemUpdated(managerName: string, name: string, itemUpdated: any, itemNewValue: any): void {}
}