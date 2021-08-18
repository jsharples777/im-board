require('dotenv').config();


import {BggSearch, parseBggXmlApi2SearchResponse} from "@code-bucket/board-game-geek";
import debug from 'debug';
import fs  from 'fs';
import {ApolloServer} from 'apollo-server-express';
import {Express} from 'express';
import request, {Response} from 'request';

const bggLogger = debug('bgg');

class BGGDataSource {
    private apolloServer:ApolloServer;

    constructor(serverApp:Express) {

        let resolvers = {
            Query: {
                findBoardGames: this.findBoardGames,
                getBoardGameDetails: this.getBoardGameDetails
            },
            Mutation: {
            },
        };

        // @ts-ignore
        const typeDefBuffer:Buffer = fs.readFileSync(process.env.QL_SCHEMA, "utf-8");
        bggLogger(typeDefBuffer);
        const isDevelopment = (process.env.MODE === 'Development');

        this.apolloServer = new ApolloServer({
            playground: isDevelopment,
            typeDefs: typeDefBuffer.toString(),
            resolvers: resolvers
        });
        this.apolloServer.applyMiddleware({app: serverApp, path: "/graphql"});

    }

    // @ts-ignore
    async findBoardGames(_:any, {query}) {
        bggLogger(`Requesting board games matching ${query}`);
        let url = process.env.URL_Search + query;

        await request(url, function (error:Error, response:Response, body:any) {
            bggLogger('error:', error); // Print the error if one occurred
            bggLogger('statusCode:', response && response.statusCode); // Print the response status code if a response was received
            bggLogger('body:', body);

            const bggResponse = parseBggXmlApi2SearchResponse(body+'');
            const search:BggSearch[] = bggResponse.items;
            let results:any[] = [];
            search.forEach((searchItem:BggSearch) => {
                let result = {
                    id: searchItem.id,
                    name: searchItem.name,
                    year: searchItem.yearpublished
                }
                results.push(result);
            });

            // @ts-ignore
            return results;
        });

    }

    // @ts-ignore
    getBoardGameDetails(_:any,{id}) {
        let url = process.env.URL_Search + id;
        bggLogger(`Looking for board game details for id ${id}`);
        return [];

    }

}

export = BGGDataSource;