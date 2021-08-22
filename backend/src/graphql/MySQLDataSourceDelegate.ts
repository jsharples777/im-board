import {Account} from "../models";
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
}

export = MySQLDataSourceDelegate;