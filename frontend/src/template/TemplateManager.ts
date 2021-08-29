import moment from "moment";
import {ScoreSheet} from "../AppTypes";
import debug from 'debug';

const templateLogger = debug('template-manager');

export class TemplateManager {
    private static _instance: TemplateManager;

    public static getInstance(): TemplateManager {
        if (!(TemplateManager._instance)) {
            TemplateManager._instance = new TemplateManager();
        }
        return TemplateManager._instance;
    }

    private constructor() {}

    private getOhanamiTemplate():any {
        let template = {
            colHeaders: false,
            rowHeaders: false,
            licenseKey: 'non-commercial-and-evaluation',
            manualColumnResize: false,
            manualRowResize: false,
            selectionMode: 'single',
            cells(row:number,column:number) {
                if ((column === 0) || (column === 1) || (row === 8)) {
                    return {
                        readOnly:true,
                        className: 'bg-readonly-heading'
                    }
                }
                if (column > 1) {
                    if ((row === 1) || (row === 2) || (row === 4)) {
                        return {
                            className: 'bg-ohanami-blue',
                            forceNumeric: true,
                        }
                    }
                    if ((row === 3) || (row === 5) ) {
                        return {
                            className: 'bg-ohanami-green',
                            forceNumeric: true,
                        }
                    }
                    if ((row === 6)) {
                        return {
                            className: 'bg-ohanami-grey',
                            forceNumeric: true,
                        }
                    }
                    if ((row === 7)) {
                        return {
                            className: 'bg-ohanami-pink',
                            forceNumeric: true,
                        }
                    }
                }

            }
        }
        templateLogger(template);
        return template;
    }

    private getOhanamiStartingData():any[] {
        return [
            ['Round','Mult.','P 1','P 2','P 3','P 4'],
            ['1','x3','0','0','0','0'],
            ['2','x3','0','0','0','0'],
            ['','x4','0','0','0','0'],
            ['3','x3','0','0','0','0'],
            ['','x4','0','0','0','0'],
            ['','x7','0','0','0','0'],
            ['','var','0','0','0','0'],
            ['Total','','0','0','0','0']
        ];
    }



    private getDefaultScoreSheetTemplate(boardGame:any):any {
        return {
            //width:'90%',
            //height:'90%',
            colHeaders:false,
            rowHeaders:false,
            licenseKey: 'non-commercial-and-evaluation',
            manualColumnResize:false,
            manualRowResize:false,
            selectionMode:'single',
            columnSummary: [
                {
                    destinationRow: 0,
                    destinationColumn:0,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:1,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:2,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:3,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:4,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:5,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
                {
                    destinationRow: 0,
                    destinationColumn:6,
                    reversedRowCoords: true,
                    type: 'sum',
                    forceNumeric:true
                },
            ]

        }
    }

    private getDefaultScoreSheetStartingData(boardGame:any):any[] {
        return [
            ['P 1','P 2','P 3','P 4','P 5','P 6','P 7'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
            ['0','0','0','0','0','0','0'],
        ];
    }


    public getScoreSheetTemplate(boardGame:any):any|null {
        if (boardGame.gameId === 270314) {
            return this.getOhanamiTemplate();
        }
        return this.getDefaultScoreSheetTemplate(boardGame);
    }

    public getScoreSheetStartingData(boardGame:any):any[]|null {
        if (boardGame.gameId === 270314) {
            return this.getOhanamiStartingData();
        }
        return this.getDefaultScoreSheetStartingData(boardGame);
    }

    private getDefaultSaveData(scoreSheet:ScoreSheet):any {
        let saveData = {
            id: scoreSheet.room,
            jsonData: JSON.stringify(scoreSheet),
            createdOn: moment().format('YYYYMMDDHHmmss'),
            players: [],
            scores: []
        }
        // process the table data for names and scores
        // the first row is the player names
        // @ts-ignore
        const playerNames: string[] = scoreSheet.data[0];
        // @ts-ignore
        const scores: any[] = scoreSheet.data[scoreSheet.data.length - 1]

        // @ts-ignore
        saveData.players = playerNames;
        // @ts-ignore
        saveData.scores = scores;
        return saveData;
    }

    private getOhanamiSaveData(scoreSheet:ScoreSheet):any {
        let saveData = {
            id: scoreSheet.room,
            jsonData: JSON.stringify(scoreSheet),
            createdOn: moment().format('YYYYMMDDHHmmss'),
            players: [],
            scores: []
        }
        // process the table data for names and scores
        // the first row is the player names, after the first two columns
        // @ts-ignore
        const playerNames: string[] = scoreSheet.data[0];
        // @ts-ignore
        const scores: any[] = scoreSheet.data[scoreSheet.data.length - 1]

        for (let index = 2;index < playerNames.length;index++) {
            // @ts-ignore
            saveData.players.push(playerNames[index]);
            // @ts-ignore
            saveData.scores.push(scores[index]);

        }
        templateLogger(`Save data for ohanami is`);
        templateLogger(saveData);
        return saveData;
    }


    public getSaveData(boardGame:any,scoreSheet:ScoreSheet):any {
        if (boardGame.gameId === 270314) {
            return this.getOhanamiSaveData(scoreSheet);
        }
        return this.getDefaultSaveData(scoreSheet);
    }

    private calculateOhanamiPinkScore(numOfCards:number):number {
        let score = 0;
        if (numOfCards > 0) {
            if (numOfCards > 15) numOfCards = 15;
            while (numOfCards > 0) {
                score += numOfCards;
                numOfCards --;
            }
        }
        return score;
    }

    private transformOhanamiData(scoreSheet:ScoreSheet) {
        // need to calculate the player scores
        for (let index = 0;index < 4;index++) {
            /*
             *  for each player the score is the sum of
             *  3 x row 1, 2, and 4
             *  4 x row 3 and 5
             *  7 x row 6
             *  row 7 is complicated
             */
            let score:number = 0;
            // @ts-ignore
            let parsed = parseInt(scoreSheet.data[1][index + 2]);
            if (!isNaN(parsed)) score += (3 * parsed);
            // @ts-ignore
            parsed = parseInt(scoreSheet.data[2][index + 2]);
            if (!isNaN(parsed)) score += (3 * parsed);
            // @ts-ignore
            parsed = parseInt(scoreSheet.data[4][index + 2]);
            if (!isNaN(parsed)) score += (3 * parsed);

            // @ts-ignore
            parsed = parseInt(scoreSheet.data[3][index + 2]);
            if (!isNaN(parsed)) score += (4 * parsed);
            // @ts-ignore
            parsed = parseInt(scoreSheet.data[5][index + 2]);
            if (!isNaN(parsed)) score += (4 * parsed);

            // @ts-ignore
            parsed = parseInt(scoreSheet.data[6][index + 2]);
            if (!isNaN(parsed)) score += (7 * parsed);

            // @ts-ignore
            parsed = parseInt(scoreSheet.data[7][index + 2]);
            if (!isNaN(parsed)) score += this.calculateOhanamiPinkScore(parsed);

            // @ts-ignore
            scoreSheet.data[8][index + 2] = score;
        }
    }

    public transformDataAfterUserChange(boardGame:any,scoreSheet:ScoreSheet):boolean {
        let result = false;
        if (boardGame.gameId === 270314) {
            result = true;
            this.transformOhanamiData(scoreSheet);
        }
        return result; // do nothing unless for a specific game
    }
}