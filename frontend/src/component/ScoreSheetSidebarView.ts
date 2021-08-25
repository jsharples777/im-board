import debug from 'debug';
import SidebarView from './SidebarView';
import {StateManager} from '../state/StateManager';
import moment from "moment";





const csLogger = debug('score-sheet-sidebar');
const csLoggerDetail = debug('score-sheet-sidebar:detail');

class ScoreSheetSidebarView extends SidebarView {
    protected selectedBoardGame: any | null = null;

    constructor(applicationView: any, htmlDocument: HTMLDocument, stateManager: StateManager) {
        super(applicationView, htmlDocument, applicationView.state.ui.scoreSheetSideBar, applicationView.state.uiPrefs.scoreSheetSideBar, stateManager);

        this.config = applicationView.state;

        // handler binding
        this.updateView = this.updateView.bind(this);
        this.eventClickItem = this.eventClickItem.bind(this);
    }

    onDocumentLoaded() {
        super.onDocumentLoaded();
        this.updateView('', {});
    }

    getIdForStateItem(name: string, item: any) {
        return this.selectedBoardGame.boardGameId;
    }

    getLegacyIdForStateItem(name: string, item: any) {
        return this.selectedBoardGame.boardGameId;
    }

    /*
        <h5 class="card-title">Card title</h5>
    <p class="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
    <p class="card-text">Last updated 3 mins ago</p>
     */
    getDisplayValueForStateItem(name: string, item: any) {
        let buffer = '';
        /*
        type ScoreSheet {
            id:Int!
            players: [String],
            scores: [Int],
            jsonData: String,
            createdOn: Int
        }
        */
        buffer += `<h5 class="card-title">${this.selectedBoardGame.name} (${this.selectedBoardGame.year})</h5>`;
        buffer += `<p class="card-text">Played On: ${moment(item.createdOn,'YYYYMMDDHHmmss').format('dd/MM/YYYY')}</p>`;
        buffer += `<p class="card-text">Scores: `;
        if (item.players) {
            item.players.forEach((player:string,index:number) => {
                buffer += `${player} ${item.scores[index]} `;
            });
        }
        buffer += `</p>`;
        return buffer;
    }

    getModifierForStateItem(name: string, item: any) {
        return 'normal';
    }

    getSecondaryModifierForStateItem(name: string, item: any) {
        return this.getModifierForStateItem(name, item);
    }

    protected getBadgeValue(name: string, item: any): number {
        return 0;
    }

    protected getBackgroundImage(name: string, item: any): string {
        return this.selectedBoardGame.thumb;
    }


    eventClickItem(event: MouseEvent) {}
    protected eventDeleteClickItem(event: MouseEvent): void {
        throw new Error('Method not implemented.');
    }

    updateView(name: string, newState: any) {
        csLoggerDetail(`Updating state with selected board game`);
        if (this.selectedBoardGame) {
            if (this.selectedBoardGame.scores) {
                this.createResultsForState(name, this.selectedBoardGame.scores);
            }
        }

    }

    getDragData(event: DragEvent) {}



}

export default ScoreSheetSidebarView;
