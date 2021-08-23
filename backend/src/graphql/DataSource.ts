import BGGDataSourceDelegate from "./BGGDataSourceDelegate";

import debug from 'debug';
import fs from 'fs';
import {ApolloServer} from 'apollo-server-express';
import {Express} from 'express';
import MySQLDataSourceDelegate from "./MySQLDataSourceDelegate";

const dsLogger = debug('data-source');

class DataSource {
    protected apolloServer: ApolloServer;
    protected bggDelegate: BGGDataSourceDelegate;
    protected mysqlDelegate: MySQLDataSourceDelegate;


    constructor(serverApp:Express) {
        this.bggDelegate = new BGGDataSourceDelegate();
        this.mysqlDelegate = new MySQLDataSourceDelegate();

        let resolvers = {
            Query: {
                findBoardGames: this.bggDelegate.findBoardGames,
                getBoardGameDetails: this.bggDelegate.getBoardGameDetails,
                findUsers: this.mysqlDelegate.getUsers
            },
        };

        // @ts-ignore
        const typeDefBuffer:Buffer = fs.readFileSync(process.env.QL_SCHEMA, "utf-8");
        dsLogger(typeDefBuffer);
        const isDevelopment = (process.env.MODE === 'Development');

        this.apolloServer = new ApolloServer({
            playground: isDevelopment,
            typeDefs: typeDefBuffer.toString(),
            resolvers: resolvers
        });
        this.apolloServer.applyMiddleware({app: serverApp, path: "/graphql"});

    }

}


export = DataSource;