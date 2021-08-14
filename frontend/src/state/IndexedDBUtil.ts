import debug from 'debug';

const idLogger = debug('indexeddb-ts');

// @ts-ignore
window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB;
// @ts-ignore
window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || windows.msIDBTransaction || {READ_WRITE: "readWrite"};
// @ts-ignore
window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange ;


class IndexedDBUtil {
  private static instance:IndexedDBUtil;

  public static getDB():IndexedDBUtil {
    if (IndexedDBUtil.instance === null) {
      IndexedDBUtil.instance = new IndexedDBUtil();
    }
    return IndexedDBUtil.instance;
  }

  private request:IDBOpenDBRequest;
  // @ts-ignore
  private db:IDBDatabase;

  private constructor() {
    this.request = window.indexedDB.open('imboard-db', 1);
    if (this.request) { // @ts-ignore
      this.request.onerror((ev: Event) => {
        idLogger('Failed to open database');
      });
    }

    if (this.request) { // @ts-ignore
      this.request.onsuccess( (ev:Event) => {
        // @ts-ignore
        this.db = ev.target.result;
        if (this.db) { // @ts-ignore
          this.db.onerror( (event:Event) => {
              // @ts-ignore
              idLogger('Database Error: ' + event.target.errorCode);
          })
        }
      });
    }
  }

  private checkForObjectStore(transaction:IDBTransaction,key:string,keyField:string):IDBObjectStore {
    let store:IDBObjectStore;
    if (!this.db.objectStoreNames.contains(key)) {
      store = this.db.createObjectStore(key,{keyPath: keyField, autoIncrement:false});
    }
    else {
      store = transaction.objectStore(key);
    }
    return store;
  }

  private saveItemsToCollection(objectStore:IDBObjectStore,saveData:any[],keyField:string = 'id') {
    saveData.forEach((data) => {
      let request:IDBRequest = objectStore.add(data,data[keyField]);
    });
  }


  public saveWithCollectionKey(key:string, saveData:any[],keyField:string = 'id'):void {
    idLogger(`Saving with key ${key}`);
    idLogger(saveData);
    let transaction:IDBTransaction = this.db.transaction(key,"readwrite");
    // @ts-ignore
    transaction.oncomplete((event:Event) => {
      idLogger(`Save for key ${key} - completed.`)
    });
    let objectStore = this.checkForObjectStore(transaction,key,keyField);
    this.saveItemsToCollection(objectStore,saveData,keyField);
  }

  public getWithCollectionKey(key:string,keyField:string = 'id'):any[] {
    let savedResults:any[] = [];
    idLogger(`Loading with key ${key}`);
    let transaction:IDBTransaction = this.db.transaction(key);
    let objectStore:IDBObjectStore = this.checkForObjectStore(transaction,key,keyField);
    // @ts-ignore
    objectStore.openCursor().onsuccess( (event:Event) => {
        // @ts-ignore
      let cursor:IDBCursor = event.target.result;
        while (cursor) {
          // @ts-ignore
          savedResults.push(cursor.value);
          cursor.continue();
        }
    });

    return savedResults;
  }

  /* add a new item to the local storage if not already there */
  addNewItemToCollection(key:string, item:any,keyField:string = 'id'):void {
    if (item !== null) {
      idLogger(`Adding with key ${key}`);
      idLogger(item);
    }
    let transaction:IDBTransaction = this.db.transaction(key,"readwrite");
    // @ts-ignore
    transaction.oncomplete((event:Event) => {
      idLogger(`Add new item to key ${key} - completed.`)
    });
    let objectStore = this.checkForObjectStore(transaction,key,keyField);
    this.saveItemsToCollection(objectStore,[item],keyField);
  }

  public removeItemFromCollection(key:string, item:any, keyField:string = 'id'):void {
    if (item !== null) {
      idLogger(`Removing with key ${key}`);
      idLogger(item);
      let transaction:IDBTransaction = this.db.transaction(key,"readwrite");
      let objectStore = this.checkForObjectStore(transaction,key,keyField);
      let request = objectStore.delete(item[keyField]);
      // @ts-ignore
      request.onsuccess((event:Event) => {
        idLogger(`Removed item from key ${key} - completed.`)
      });
    }
  }

  public updateItemInCollection(key:string,item:any,keyField:string = 'id') {
     if (item) {
       idLogger(`Updating item in storage ${key}`);
       idLogger(item);
       let transaction:IDBTransaction = this.db.transaction(key,"readwrite");
       let objectStore = this.checkForObjectStore(transaction,key,keyField);
       let request = objectStore.get(item[keyField]);
       // @ts-ignore
       request.onsuccess((event:Event) => {
         // @ts-ignore
         let previousItem:any = event.target.result;
         if (previousItem) {
           objectStore.put(item,item[keyField]);
         }
         else {
           objectStore.add(item,item[keyField]);
         }
       });
     }
  }
}

export default IndexedDBUtil;