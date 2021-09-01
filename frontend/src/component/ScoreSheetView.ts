import StateChangeListener from "../state/StateChangeListener";
import {ScoreSheetController} from "./ScoreSheetController";
import Handsontable from "handsontable";
import browserUtil from "../util/BrowserUtil";
import debug from 'debug';
import {ScoreSheet} from "../AppTypes";
import {TemplateManager} from "../template/TemplateManager";
import {StateManager} from "../state/StateManager";
import controller from "../Controller";

const ssvLogger = debug('score-sheet-view');

export class ScoreSheetView implements StateChangeListener {
    private static _instance: ScoreSheetView;
    // @ts-ignore
    protected ssFastSearchUserNames: HTMLElement;
    private applicationView: any | null = null;
    private stateManager: StateManager;

    private thisEl: HTMLDivElement | null = null;
    private boardGameTitleEl: HTMLHeadingElement | null = null;
    private startStopTimer: HTMLButtonElement | null = null;
    private timerEl: HTMLDivElement | null = null;
    private endOrLeaveEl: HTMLButtonElement | null = null;
    private scoreSheetEl: HTMLDivElement | null = null;
    private webrtcDiv: HTMLElement | null = null;
    private myVideoStream: MediaStream | null = null;


    private table: Handsontable | null = null;
    private controller: ScoreSheetController;
    private config: any;
    private peer: any | null = null;

    private constructor() {
        this.controller = ScoreSheetController.getInstance();
        this.stateManager = controller.getStateManager();
        this.eventUserSelected = this.eventUserSelected.bind(this);
    }

    public static getInstance(): ScoreSheetView {
        if (!(ScoreSheetView._instance)) {
            ScoreSheetView._instance = new ScoreSheetView();
        }
        return ScoreSheetView._instance;
    }

    public setApplication(applicationView: any) {
        this.config = applicationView.state;
        this.stateManager.addChangeListenerForName(this.config.stateNames.users, this);
    }

    public onDocumentLoaded(applicationView: any) {
        this.applicationView = applicationView;
        this.resetDisplay();

        // @ts-ignore
        this.ssFastSearchUserNames = document.getElementById(this.config.ui.scoreSheet.dom.ssFastSearchUserNames);
        // fast user search
        // @ts-ignore
        const fastSearchEl = $(`#${this.config.ui.scoreSheet.dom.ssFastSearchUserNames}`);
        fastSearchEl.on('autocompleteselect', this.eventUserSelected);


        ScoreSheetController.getInstance().getStateManager().addChangeListenerForName(this.applicationView.state.stateNames.scoreSheet, this);

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
        // @ts-ignore
        this.webrtcDiv = document.getElementById(this.applicationView.state.ui.scoreSheet.dom.webrtc);

        // bind event handlers
        this.handleStartStopTimer = this.handleStartStopTimer.bind(this);
        this.handleEndOrLeave = this.handleEndOrLeave.bind(this);
        this.handleUserDrop = this.handleUserDrop.bind(this);

        // setup event handlers
        if (this.startStopTimer) this.startStopTimer.addEventListener('click', this.handleStartStopTimer);
        if (this.endOrLeaveEl) this.endOrLeaveEl.addEventListener('click', this.handleEndOrLeave);
        if (this.thisEl) {
            this.thisEl.addEventListener('dragover', (event) => {
                event.preventDefault()
            });
            this.thisEl.addEventListener('drop', this.handleUserDrop);
        }
        if (controller.isLoggedIn()) {
            // @ts-ignore  - is for the WebRTC peer via Nodejs
            this.peer = new Peer(controller.getLoggedInUsername(), {path: '/peerjs', host: '/', port: '3000'});
            this.peer.on('open', (id:any) => {
                ssvLogger('My peer ID is: ' + id);
            });
        }

    }

    eventUserSelected(event: Event, ui: any) {
        event.preventDefault();
        event.stopPropagation();
        ssvLogger(`User ${ui.item.label} with id ${ui.item.value} selected`);
        // @ts-ignore
        event.target.innerText = '';

        // add to the chat, if one selected, and is scoresheet owner
        if (ScoreSheetController.getInstance().isSheetOwner()) {
            ScoreSheetController.getInstance().inviteUser(ui.item.label);
        }
    }


    handleEndOrLeave(event: MouseEvent) {
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
        } else {
            // leaving the score sheet
            // double check this is want we want
            if (!confirm("Are you sure you want to leave the score sheet")) return;

            // user wants to finish
            this.controller.leave();


            // reset the display
            this.resetDisplay();
        }
    }

    handleStartStopTimer(event: MouseEvent) {
        ssvLogger('start/pause timer');
        if (this.controller.isTimerGoing()) {
            this.controller.pauseTimer();
        } else {
            this.controller.startTimer();
        }
    }

    handleUserDrop(event: Event) {
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


    public resetDisplay() {
        this.table = null;

        // reset the display
        if (this.boardGameTitleEl) this.boardGameTitleEl.innerText = '';
        if (this.startStopTimer) {
            this.startStopTimer.innerHTML = 'Start ' + this.applicationView.state.ui.scoreSheet.dom.iconStart;
            this.startStopTimer.setAttribute("disabled", "true");
            browserUtil.addRemoveClasses(this.startStopTimer, 'btn-warning', false);
            browserUtil.addRemoveClasses(this.startStopTimer, 'btn-success', true);
        }
        if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(0);
        if (this.endOrLeaveEl) this.endOrLeaveEl.innerHTML = this.applicationView.state.ui.scoreSheet.dom.iconLeave;
        if (this.scoreSheetEl) browserUtil.removeAllChildren(this.scoreSheetEl);

        if (this.webrtcDiv) browserUtil.removeAllChildren(this.webrtcDiv);
    }

    public updateTimer(time: number, isPaused: boolean = false) {
        // update the view
        ssvLogger(`Updating timer ${time} ${isPaused}`);
        if (this.startStopTimer) {
            if (isPaused) {
                this.startStopTimer.innerHTML = 'Start   ' + this.applicationView.state.ui.scoreSheet.dom.iconStart;
                browserUtil.addRemoveClasses(this.startStopTimer, 'btn-warning', false);
                browserUtil.addRemoveClasses(this.startStopTimer, 'btn-success', true);
            } else {
                this.startStopTimer.innerHTML = 'Pause   ' + this.applicationView.state.ui.scoreSheet.dom.iconInProgress;
                browserUtil.addRemoveClasses(this.startStopTimer, 'btn-warning', true);
                browserUtil.addRemoveClasses(this.startStopTimer, 'btn-success', false);
            }
            this.startStopTimer.removeAttribute("disabled");
        }
        if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(time);
    }

    stateChanged(managerName: string, name: string, newValue: any): void {
        if (name === this.config.stateNames.users) {
            // @ts-ignore
            const fastSearchEl = $(`#${this.config.ui.scoreSheet.dom.ssFastSearchUserNames}`);
            // what is my username?
            let myUsername = controller.getLoggedInUsername();
            // for each name, construct the patient details to display and the id referenced
            const fastSearchValues: any = [];
            newValue.forEach((item: any) => {
                const searchValue = {
                    label: item.username,
                    value: item.id,
                };
                // @ts-ignore
                if (myUsername !== item.username) fastSearchValues.push(searchValue); // don't search for ourselves
            });
            fastSearchEl.autocomplete({source: fastSearchValues});
            fastSearchEl.autocomplete('option', {disabled: false, minLength: 1});

        } else {
            let scoreSheet: ScoreSheet = newValue;
            ssvLogger(`Processing new state`);
            ssvLogger(scoreSheet);
            if (this.startStopTimer) this.startStopTimer.removeAttribute("disabled");

            // update the board game name
            if (this.boardGameTitleEl) this.boardGameTitleEl.innerText = `${scoreSheet.boardGameName}`;

            // update the table
            if (this.table) {
                // process the data in the state change, will be array of array (rows) into what the table wants
                let tableData: any = [];
                // @ts-ignore
                scoreSheet.data.forEach((row: any[], rowIndex: number) => {
                    row.forEach((column: any, columnIndex: number) => {
                        tableData.push([rowIndex, columnIndex, column]);
                    });
                });
                ssvLogger(`Table data is `);
                ssvLogger(tableData);
                // @ts-ignore
                this.table.setDataAtCell(tableData, ScoreSheetController.SOURCE_View);

            } else {
                // create a new table

                if (this.scoreSheetEl) {
                    const boardGame = this.controller.getSelectedBoardGame();
                    if (boardGame) {
                        scoreSheet.sheetLayoutOptions = TemplateManager.getInstance().getScoreSheetTemplate(boardGame);
                    }
                    scoreSheet.sheetLayoutOptions.data = scoreSheet.data;
                    this.table = new Handsontable(
                        this.scoreSheetEl,
                        scoreSheet.sheetLayoutOptions);
                    // @ts-ignore
                    this.table.addHook('afterChange', this.controller.userChangedValue);
                }
            }


            // update the timer
            if (this.timerEl) this.timerEl.innerText = this.createTimerDisplay(scoreSheet.timer);
        }

    }

    public getTableData(): any[] {
        if (this.table) {
            return this.table.getData();
        } else {
            return [];
        }
    }

    stateChangedItemAdded(managerName: string, name: string, itemAdded: any): void {
        this.stateChanged(managerName, name, this.stateManager.getStateByName(name));
    }

    stateChangedItemRemoved(managerName: string, name: string, itemRemoved: any): void {
    }

    stateChangedItemUpdated(managerName: string, name: string, itemUpdated: any, itemNewValue: any): void {
    }

    private createTimerDisplay(timer: number): string {
        let result = '';
        if (timer === 0) {
            result = '00:00';
        } else {
            if (timer >= 60) {
                let hours = Math.floor(timer / 3600);
                let minutes = Math.floor(timer / 60);
                let seconds = timer - (hours * 3600) - (minutes * 60);
                if (hours > 0) {
                    result += `${hours}:`;
                }
                if (minutes > 0) {
                    if (minutes < 10) {
                        result += `0${minutes}:`
                    } else {
                        result += `${minutes}:`
                    }
                } else {
                    result += '00:';
                }
                if (seconds > 0) {
                    if (seconds < 10) {
                        result += `0${seconds}`;
                    } else {
                        result += `${seconds}`;
                    }
                } else {
                    result += '00';
                }
            } else {
                result = `00:`;
                if (timer > 0) {
                    if (timer < 10) {
                        result += `0${timer}`;
                    } else {
                        result += `${timer}`;
                    }
                } else {
                    result += '00';
                }
            }
        }
        return result;
    }

    private addVideoStream(username: string, stream: MediaStream, isCurrentUser = false) {
        const videoCard = document.createElement('div');
        videoCard.setAttribute("id", username);
        browserUtil.addRemoveClasses(videoCard, 'card col-sm-12 col-md-4 col-lg-3');
        const videoCardTitle = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardTitle, 'card-header');
        videoCardTitle.innerHTML = `<h5 class="card-title">${username}</h5>`;
        const videoCardBody = document.createElement('div');
        browserUtil.addRemoveClasses(videoCardBody, 'card-body');
        const video = document.createElement('video');
        browserUtil.addRemoveClasses(video, 'video');

        videoCard.appendChild(videoCardTitle);
        videoCard.appendChild(videoCardBody);
        videoCardBody.appendChild(video);

        if (isCurrentUser) {
            const videoCardFooter = document.createElement('div');
            browserUtil.addRemoveClasses(videoCardFooter, 'card-footer');
            videoCardFooter.innerHTML = `<div class="d-flex w-100 justify-content-between mt-2"><button type=""button id="stopVideo" class="btn btn-circle btn-primary"><i class="fas fa-video-slash"></i></button><button type="button" id="muteButton" class="btn btn-circle btn-primary"><i class="fa fa-microphone"></i></button></div>`;
            videoCard.appendChild(videoCardFooter);
        }


        video.srcObject = stream;
        video.addEventListener("loadedmetadata", () => {
            video.play();
            if (this.webrtcDiv) this.webrtcDiv.append(videoCard);
        });
    };

    public callUser(userId: string) {
        ssvLogger(`Calling user ${userId}`);
        if (this.myVideoStream) {
            const call = this.peer.call(userId, this.myVideoStream);
            call.on('stream', (userVideoStream: any) => {
                ssvLogger(`User ${userId} answered, showing stream`);
                this.addVideoStream(userId, userVideoStream, false);
            });
        }
    };

    prepareToAnswerCallFrom(userId: string) {
        if (controller.isLoggedIn()) {
            ssvLogger(`Preparing to answer call from ${userId}`);
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                }).then((stream) => {
                    this.myVideoStream = stream;
                    this.addVideoStream(controller.getLoggedInUsername(), this.myVideoStream, true);
                    ssvLogger(`Awaiting call from ${userId}`);
                    this.peer.on('call', (call: any) => {
                        ssvLogger(`Answering call from ${userId}`);
                        call.answer(this.myVideoStream);
                        call.on('stream', (userVideoStream: any) => {
                            ssvLogger(`Have answered, showing stream`);
                            this.addVideoStream(userId, userVideoStream, false);
                        });
                    });
                });
            }
        }

    }

    public startScoreSheet() {
        if (controller.isLoggedIn()) {
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: true,
                }).then((stream) => {
                    this.myVideoStream = stream;
                    this.addVideoStream(controller.getLoggedInUsername(), this.myVideoStream, true);
                });
            }
        }
    }

}