export enum Decorator  {
    Incomplete,
    Complete,
    Persisted,
    PersistedLocally = 3
}

export type ScoreSheet = {
    room: string,
    boardGameName: string,
    sheetLayoutOptions: any;
    timer: number,
    sheetData: any,
    isFinished: boolean,
    timerGoing: boolean
}

