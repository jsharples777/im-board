import debug from 'debug';
import {AbstractStateManager,stateValue} from './AbstractStateManager';
import {equalityFunction} from "../util/EqualityFunctions";

const msManager = debug('state-manager-ms');

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
class MemoryStateManager extends AbstractStateManager {
  private static _instance:MemoryStateManager;

  public static getInstance() {
    if (!(MemoryStateManager._instance)) {
      MemoryStateManager._instance = new MemoryStateManager();
    }
    return MemoryStateManager._instance;
  }



  protected applicationState:stateValue[];

  protected constructor() {
    super();
    this.applicationState = [];
    this.forceSaves = true;
  }

  public _ensureStatePresent(name:string) {
    let foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex < 0) {
      let state:stateValue = {
        name:name,
        value:[]
      };
      this.applicationState.push(state);
    }
  }

  public _addNewNamedStateToStorage(state:stateValue):void {
    this.applicationState.push(state);
  }

  public _replaceNamedStateInStorage(state:stateValue):void {
     let foundIndex:number = this.applicationState.findIndex(element => element.name === state.name);
     if (foundIndex > 0) {
       this.applicationState.splice(foundIndex,1,state);
     }
  }

  public _getState(name:string):stateValue {
    // @ts-ignore
    return this.applicationState.find(element => element.name === name);
  }

  public _saveState(name:string,stateObject:any):void {
    let foundIndex:number = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex > 0) {
      let state:stateValue = this.applicationState[foundIndex];
      state.value = stateObject;
    }
  }

  _addItemToState(name: string, stateObj: any,isComplete:boolean = false): void {
    if (!isComplete) return; // dont add incomplete objects to the state
    let foundIndex:number = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex > 0) {
      let state:stateValue = this.applicationState[foundIndex];
      state.value.push(stateObj);
    }
  }

  _removeItemFromState(name: string, stateObj: any,testForEqualityFunction:equalityFunction): void {
    let foundIndex:number = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex > 0) {
      let state:stateValue = this.applicationState[foundIndex];
      const valueIndex = state.value.findIndex((element: any) => testForEqualityFunction(element, stateObj));
      if (valueIndex >= 0) {
        state.value.splice(valueIndex, 1);
      }
    }
  }

  _updateItemInState(name: string, stateObj: any,testForEqualityFunction:equalityFunction): void {
    let foundIndex:number = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex > 0) {
      let state:stateValue = this.applicationState[foundIndex];
      const valueIndex = state.value.findIndex((element: any) => testForEqualityFunction(element, stateObj));
      if (valueIndex >= 0) {
        state.value.splice(valueIndex, 1,stateObj);
      }
    }
  }

}

export default MemoryStateManager;
