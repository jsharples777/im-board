"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const models_1 = require("../models");
const debug_1 = __importDefault(require("debug"));
const mysqlLogger = debug_1.default('data-source-mysql');
class MySQLDataSourceDelegate {
    constructor() { }
    getUsers() {
        mysqlLogger('Getting all user entries');
        return new Promise((resolve, reject) => {
            models_1.Account.findAll({ attributes: ['id', 'username'] })
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
    convertDBScoreSheetsToQLScoreSheets(boardGame) {
        //const dbScores = boardGame.ScoreSheet;
    }
    getMyBoardGameCollection(_, data) {
        mysqlLogger(`Getting board game collection for user ${data.userId}`);
        return new Promise((resolve, reject) => {
            models_1.BoardGame.findAll({ where: { createdBy: data.userId }, include: [models_1.ScoreSheet]
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
    addToMyCollection(_, data) {
        mysqlLogger(data);
        mysqlLogger(`Adding board game ${data.boardGame.gameId} to collection for user ${data.userId}`);
        return new Promise((resolve, reject) => {
            // set the user id on the board game object for the database
            data.boardGame.createdBy = data.userId;
            mysqlLogger(data.boardGame);
            // make sure the user doesn't put duplicates in the database of the same board game
            models_1.BoardGame.findAll({ where: { createdBy: data.userId, gameId: data.boardGame.gameId } })
                .then((boardGames) => {
                if (boardGames.length > 0) {
                    //already in collection, return what we have
                    // @ts-ignore
                    resolve({ id: boardGames[0].id, gameId: boardGames[0].gameId });
                }
            })
                .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });
            // not in collection, create a new record
            models_1.BoardGame.create(data.boardGame)
                .then((boardGame) => {
                // @ts-ignore
                resolve({ id: boardGame.id, gameId: boardGame.gameId });
            })
                .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });
        });
    }
    //removeFromMyCollection(userId: Int, boardGameId: Int):Boolean
    removeFromMyCollection(_, data) {
        mysqlLogger(`Removing board game ${data.boardGameId} to collection for user ${data.userId}`);
        return new Promise((resolve, reject) => {
            models_1.BoardGame.destroy({ where: { createdBy: data.userId, gameId: data.boardGameId } })
                .then((result) => {
                resolve({ result });
            })
                .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });
        });
    }
    //addScoreSheetToBoardGame(userId: Int, boardGameId: Int, sheet: ScoreSheetInput): Boolean
    addScoreSheetToBoardGame(_, data) {
        mysqlLogger(`Adding score sheet to  board game ${data.boardGameId}  for user ${data.userId}`);
        mysqlLogger(data.sheet);
        // convert the input sheet to the database format
        let scoreSheet = {
            id: data.sheet.id,
            jsonData: data.sheet.jsonData,
            player1: 'P1',
            score1: 0,
            player2: 'P2',
            score2: 0,
            player3: 'P3',
            score3: 0,
            player4: 'P4',
            score4: 0,
            player5: 'P5',
            score5: 0,
            player6: 'P6',
            score6: 0,
            player7: 'P7',
            score8: 0,
            scoreFor: data.boardGameId
        };
        if (data.sheet.players) {
            for (let index = 1; index <= data.sheet.players.length; index++) {
                const playerName = data.sheet.players[index];
                const score = data.sheet.scores[index];
                // @ts-ignore
                scoreSheet[`player${index}`] = playerName;
                // @ts-ignore
                scoreSheet[`score${index}`] = parsetInt(score);
            }
        }
        mysqlLogger(scoreSheet);
        return new Promise((resolve, reject) => {
            models_1.ScoreSheet.create(scoreSheet)
                .then((result) => {
                mysqlLogger(result);
                // @ts-ignore
                resolve({ id: result.id });
            })
                .catch((err) => {
                mysqlLogger(err);
                reject(err);
            });
        });
    }
}
module.exports = MySQLDataSourceDelegate;
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
//# sourceMappingURL=MySQLDataSourceDelegate.js.map