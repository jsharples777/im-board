import StateChangeListener from "../state/StateChangeListener";
import {ScoreSheetController} from "./ScoreSheetController";

export class ScoreSheetView implements StateChangeListener{
    private static _instance: ScoreSheetView;

    public static getInstance(): ScoreSheetView {
        if (!(ScoreSheetView._instance)) {
            ScoreSheetView._instance = new ScoreSheetView();
        }
        return ScoreSheetView._instance;
    }

    private applicationView:any|null = null;

    private constructor() {
    }

    public onDocumentLoaded(applicationView:any) {
        this.applicationView = applicationView;
        ScoreSheetController.getInstance().getStateManager().addChangeListenerForName(this.applicationView.stateNames.scoreSheet,this);

        // load references to the key elements on the page
    }


    public updateTimer(time:number, isPaused:boolean = false) {
        // update the view

    }

    stateChanged(managerName: string, name: string, newValue: any): void {
        // update the table

        // update the timer

        // update the timer button

    }

    public getTableData():[][] {
        return [[]];
    }

    stateChangedItemAdded(managerName: string, name: string, itemAdded: any): void {}
    stateChangedItemRemoved(managerName: string, name: string, itemRemoved: any): void {}
    stateChangedItemUpdated(managerName: string, name: string, itemUpdated: any, itemNewValue: any): void {}
}