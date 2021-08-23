import {Account, BoardGame, ScoreSheet} from "../models";
import debug from "debug";

const mysqlLogger = debug('data-source-mysql');

class MySQLDataSourceDelegate {
    constructor() {}

    public getUsers() {
        mysqlLogger('Getting all user entries');

        return new Promise((resolve, reject) => {
            Account.findAll({attributes: ['id', 'username']})
                .then((users) => {
                    // be sure to include its associated Products
                    resolve(users);
                })
                .catch((err) => {
                    mysqlLogger(err);
                    reject(err);
                });
        });

    }

    public getMyBoardGameCollection(_:any,data:any) {
        mysqlLogger(`Getting board game collection for user ${data.userId}`);
        return new Promise( (resolve, reject) => {
            BoardGame.findAll({where: {createdBy: data.userId}, include: [ScoreSheet]
            })
            .then((boardGames) => {
                resolve(boardGames);
            })
            .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });

        });

    }

    //addToMyCollection(userId: Int, boardGame: BoardGameDetailInput): Int
    public addToMyCollection(_:any,data:any) {
        mysqlLogger(`Adding board game ${data.boardGame.id} to collection for user ${data.userId}`);

        return new Promise( (resolve, reject) => {
            // set the user id on the board game object for the database
            data.boardGame.createdBy = data.userId;
            mysqlLogger(data.boardGame);

            BoardGame.create(data.boardGame)
            .then((boardGame) => {
                // @ts-ignore
                resolve({id: boardGame.id});
            })
            .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });

        });
    }

    //removeFromMyCollection(userId: Int, boardGameId: Int):Boolean
    public removeFromMyCollection(_:any, data:any) {
        mysqlLogger(`Removing board game ${data.boardGameId} to collection for user ${data.userId}`);
        return new Promise( (resolve, reject) => {
            BoardGame.destroy({where: {id: data.boardGameId}})
                .then((result) => {
                    resolve({result});
                })
                .catch((err) => {
                    mysqlLogger(err);
                    reject(err);
                });
        });

    }

    //addScoreSheetToBoardGame(userId: Int, boardGameId: Int, sheet: ScoreSheetInput): Boolean
    public addScoreSheetToBoardGame(_:any, data:any) {
        mysqlLogger(`Adding score sheet to  board game ${data.boardGameId}  for user ${data.userId}`);
        mysqlLogger(data.sheet);
        return new Promise( (resolve, reject) => {
            data.sheet.scoreFor = data.boardGameId;
            ScoreSheet.create(data.sheet)
                .then((result) => {
                    mysqlLogger(result);
                    // @ts-ignore
                    resolve({id: result.id});
                })
                .catch((err) => {
                    mysqlLogger(err);
                    reject(err);
                });
        });
    }
}

export = MySQLDataSourceDelegate;

/*
type BoardGame {
    id: Int!
    name:String!
    year: Int
}

input IdInput {
    id:Int!
}

input BoardGameDetailInput {
    id: Int!
    thumb: String!
    image: String!
    name: String!
    description: String!
    year: Int
    minPlayers: Int
    maxPlayers: Int
    minPlayTime: Int
    maxPlayTime: Int
    minAge: Int
    designers: String
    artists: String
    publisher: String
    numOfRaters: Int
    averageScore: Float
    rank: Int
    categories: String
}

type BoardGameDetail {
    id: Int!
    thumb: String!
    image: String!
    name: String!
    description: String!
    year: Int
    minPlayers: Int
    maxPlayers: Int
    minPlayTime: Int
    maxPlayTime: Int
    minAge: Int
    designers: String
    artists: String
    publisher: String
    numOfRaters: Int
    averageScore: Float
    rank: Int
    categories: String
    scores: [ScoreSheet]
}

type ScoreSheet {
    id:Int!
    players: [String],
    scores: [Int],
    jsonData: String
}

input ScoreSheetInput {
    players: [String],
    scores: [Int],
    jsonData: String
}

type User {
    id: Int!,
    username: String!
}

##### top level declarations
type Query {
    findBoardGames(query:String!): [BoardGame]
    getBoardGameDetails(id:IdInput!): BoardGameDetail
    findUsers: [User]
    getMyBoardGameCollection(userId: Int): [BoardGameDetail]
}

type Mutation {
    addToMyCollection(userId: Int, boardGame: BoardGameDetailInput): Boolean
    removeFromMyCollection(userId: Int, boardGameId: Int):Boolean
    addScoreSheetToBoardGame(userId: Int, boardGameId: Int, sheet: ScoreSheetInput): Boolean
}

 */