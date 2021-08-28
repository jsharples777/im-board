import moment from "moment";
import {ScoreSheet} from "../AppTypes";

export class TemplateManager {
    private static _instance: TemplateManager;

    public static getInstance(): TemplateManager {
        if (!(TemplateManager._instance)) {
            TemplateManager._instance = new TemplateManager();
        }
        return TemplateManager._instance;
    }

    private constructor() {}

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
        return this.getDefaultScoreSheetTemplate(boardGame);
    }

    public getScoreSheetStartingData(boardGame:any):any[]|null {
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

    public getSaveData(boardGame:any,scoreSheet:ScoreSheet):any {
        return this.getDefaultSaveData(scoreSheet);
    }

}