import debug from 'debug';

import {AbstractStateManager, stateValue} from "./AbstractStateManager";
import {equalityFunction} from '../util/EqualityFunctions';

const lsLogger = debug('local-storage');

export default class BrowserStorageStateManager extends AbstractStateManager {
  protected storage:Storage;
  private static _instance:BrowserStorageStateManager;

  public static getInstance(useLocalStorage:boolean = false) {
    if (!(BrowserStorageStateManager._instance)) {
      BrowserStorageStateManager._instance = new BrowserStorageStateManager(useLocalStorage);
    }
    return BrowserStorageStateManager._instance;
  }


  protected constructor(useLocalStorage:boolean = false) {
    super();
    this.storage = window.sessionStorage;
    if (useLocalStorage) this.storage = window.localStorage;
    this.forceSaves = true;
  }

  public  _isStatePresent(name:string):boolean {
    return (this.storage.getItem(name) != null);
  }

  public  _addNewNamedStateToStorage(state:stateValue):void {
    lsLogger(`Local Storage: Saving with key ${state.name}`);
    lsLogger(state);
    const stringifiedSaveData:string = JSON.stringify(state.value);
    lsLogger(stringifiedSaveData);
    this.storage.setItem(state.name, stringifiedSaveData);

  }
  public  _replaceNamedStateInStorage(state:stateValue):void {
    this._addNewNamedStateToStorage(state);
  }
  public  _getState(name:string):stateValue {
    let savedResults = [];
    lsLogger(`Local Storage: Loading with key ${name}`);
    const savedResultsJSON = this.storage.getItem(name);
    lsLogger(savedResultsJSON);
    if (savedResultsJSON !== null) {
      savedResults = JSON.parse(savedResultsJSON);
    }
    return savedResults;
  }

  public  _saveState(name:string,newValue:any):void {
    this._addNewNamedStateToStorage({name:name,value:newValue});
  }

  _addItemToState(name: string, stateObj: any): void {}

  _removeItemFromState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {}

  _updateItemInState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {}

}
