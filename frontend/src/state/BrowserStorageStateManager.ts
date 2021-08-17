import debug from 'debug';

import {AbstractStateManager} from "./AbstractStateManager";
import {equalityFunction} from '../util/EqualityFunctions';
import {stateValue} from "./StateManager";

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
    super('browser');
    this.storage = window.sessionStorage;
    if (useLocalStorage) this.storage = window.localStorage;
    this.forceSaves = true;
  }

  public  _ensureStatePresent(name:string):void {
    if (this.storage.getItem(name) === null) {
      this._addNewNamedStateToStorage({name:name, value:[]});
    }
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
    return {name:name, value:savedResults};
  }

  public  _saveState(name:string,newValue:any):void {
    this._addNewNamedStateToStorage({name:name,value:newValue});
  }

  _addItemToState(name: string, stateObj: any,isPersisted:boolean = false): void {
     if (!isPersisted) return;

     let state:stateValue = this._getState(name);
     lsLogger(`adding item to state ${name}`);
     lsLogger(stateObj);
     state.value.push(stateObj);
     this._replaceNamedStateInStorage(state);
  }

  _removeItemFromState(name: string, stateObj: any, testForEqualityFunction: equalityFunction, isPersisted: boolean): void {
    let state:stateValue = this._getState(name);
    const valueIndex = state.value.findIndex((element: any) => testForEqualityFunction(element, stateObj));
    if (valueIndex >= 0) {
      lsLogger(`removing item from state ${name}`);
      lsLogger(stateObj);
      state.value.splice(valueIndex, 1);
    }
    this._replaceNamedStateInStorage(state);
  }

  _updateItemInState(name: string, stateObj: any, testForEqualityFunction: equalityFunction, isPersisted: boolean): void {
    let state:stateValue = this._getState(name);
    const valueIndex = state.value.findIndex((element: any) => testForEqualityFunction(element, stateObj));
    if (valueIndex >= 0) {
      state.value.splice(valueIndex, 1,stateObj);
      lsLogger(`updating item in state ${name}`);
      lsLogger(stateObj);
    }
    this._replaceNamedStateInStorage(state);
  }

}
