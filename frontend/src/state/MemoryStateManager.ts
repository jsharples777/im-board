import debug from 'debug';
import {AbstractStateManager,stateValue} from './AbstractStateManager';

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
  }

  public _isStatePresent(name:string):boolean {
    let foundIndex = this.applicationState.findIndex(element => element.name === name);
    return (foundIndex >= 0);
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

  public _saveState(name:string,stateObject:any):void {}

}

export default MemoryStateManager;
