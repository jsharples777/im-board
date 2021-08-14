import debug from 'debug';
import {IDBPDatabase, IDBPObjectStore, IDBPTransaction, openDB} from "idb";

const idLogger = debug('indexeddb-ts');

type collection = {
    name:string,
    keyField:string
};

class IndexedDBUtil {
    private static instance: IndexedDBUtil;

    public static getDB(): IndexedDBUtil {
        if (!IndexedDBUtil.instance) {
            IndexedDBUtil.instance = new IndexedDBUtil();
        }
        return IndexedDBUtil.instance;
    }

    public async initialise(collections:collection[]) {
        await openDB('imboard-db', 1,{
            upgrade(db, oldVersion, newVersion, transaction) {
               collections.forEach((collection) => {
                   db.createObjectStore(collection.name, {keyPath: collection.keyField, autoIncrement: false});
               });
            },
            blocked() {
                // …
            },
            blocking() {
                // …
            },
            terminated() {
                // …
            },
        });
    }

    private constructor() {
        idLogger(`Constructor`);
    }

    private async checkForObjectStore(db: IDBPDatabase, key: string, keyField: string) {
        if (!db.objectStoreNames.contains(key)) {
            // @ts-ignore
            await db.createObjectStore(key, {keyPath: keyField, autoIncrement: false});
        }
    }

    private async saveItemsToCollection(objectStore: IDBPObjectStore, saveData: any[], keyField: string = 'id') {
        saveData.forEach((data) => {
            // @ts-ignore
            objectStore.add(data);
        });
    }


    public async saveWithCollectionKey(key: string, saveData: any[], keyField: string = 'id') {
        idLogger(`Saving with key ${key}`);
        idLogger(saveData);
        let db: IDBPDatabase = await openDB('imboard-db', 1,);
        await this.checkForObjectStore(db, key, keyField);
        // @ts-ignore
        let transaction: IDBPTransaction = db.transaction(key, "readwrite");
        // @ts-ignore
        let objectStore: IDBPObjectStore = transaction.store;
        // @ts-ignore
        await this.saveItemsToCollection(objectStore, saveData, keyField);
    }

    public async getWithCollectionKey(key: string, keyField: string = 'id'): Promise<any[]> {
        let savedResults: any[] = [];
        idLogger(`Loading with key ${key}`);
        let db: IDBPDatabase = await openDB('imboard-db', 1);
        await this.checkForObjectStore(db, key, keyField);;
        // @ts-ignore
        let transaction: IDBPTransaction = db.transaction(key);
        // @ts-ignore
        let objectStore: IDBPObjectStore = transaction.store;
        // @ts-ignore
        let cursor: IDBPCursor = await objectStore.openCursor();

        while (cursor) {
            // @ts-ignore
            savedResults.push(cursor.value);
            // @ts-ignore
            cursor = await cursor.continue();
        }


        return savedResults;
    }

    /* add a new item to the local storage if not already there */
    public async addNewItemToCollection(key: string, item: any, keyField: string = 'id') {
        if (item !== null) {
            idLogger(`Adding with key ${key}`);
            idLogger(item);
        }
        let db: IDBPDatabase = await openDB('imboard-db', 1);
        await this.checkForObjectStore(db, key, keyField);;
        // @ts-ignore
        let transaction: IDBPTransaction = db.transaction(key, "readwrite");
        // @ts-ignore
        let objectStore: IDBPObjectStore = transaction.store;
        this.saveItemsToCollection(objectStore, [item], keyField);
    }

    public async removeItemFromCollection(key: string, item: any, keyField: string = 'id') {
        if (item !== null) {
            idLogger(`Removing with key ${key}`);
            idLogger(item);
            let db: IDBPDatabase = await openDB('imboard-db', 1);
            await this.checkForObjectStore(db, key, keyField);;
            // @ts-ignore
            let transaction: IDBPTransaction = db.transaction(key, "readwrite");
            // @ts-ignore
            let objectStore: IDBPObjectStore = transaction.store;
            // @ts-ignore
            await objectStore.delete(item[keyField]);
            await transaction.done;

        }
    }

    public async updateItemInCollection(key: string, item: any, keyField: string = 'id') {
        if (item) {
            idLogger(`Updating item in storage ${key}`);
            idLogger(item);
            let db: IDBPDatabase = await openDB('imboard-db', 1);
            await this.checkForObjectStore(db, key, keyField);;
            // @ts-ignore
            let transaction: IDBPTransaction = db.transaction(key, "readwrite");
            // @ts-ignore
            let objectStore: IDBPObjectStore = transaction.store;
            let previousItem: any = await objectStore.get(item[keyField]);
            if (previousItem) {
                // @ts-ignore
                await objectStore.put(item, item[keyField]);
            } else {
                // @ts-ignore
                await objectStore.add(item, item[keyField]);
            }
            await transaction.done;
        }
    }
}

export default IndexedDBUtil;