import debug from 'debug';
import StateChangeListener from './StateChangeListener';

const smLogger = debug('state-manager-ts');

import {equalityFunction} from '../util/EqualityFunctions';

export type stateValue = { name: string, value: any};
export type stateListeners = {name:string, listeners: StateChangeListener[]};

/** To Do - make state unchangeable outside of this class (i.e. deep copies) */
class StateManagementUtil {
  private static _instance:StateManagementUtil|null = null;

  /*
    Singleton
   */
  public static create():StateManagementUtil {
    if (StateManagementUtil._instance === null) {
      StateManagementUtil._instance = new StateManagementUtil();
    }
    return StateManagementUtil._instance;

  }

  protected applicationState:stateValue[];
  protected stateChangeListeners:stateListeners[];

  protected constructor() {
    this.applicationState = [];
    this.stateChangeListeners = [];
  }

  private isStatePresent(name:string):boolean {
    const result = (this.applicationState.findIndex(element => element.name === name) >= 0);
    smLogger(`State Manager: Checking state of ${name} is present = ${result}`);
    return result;
  }

  private informChangeListenersForStateWithName(name:string, stateObjValue:any) {
    smLogger(`State Manager: Informing state listeners of ${name}`);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      smLogger(`State Manager: Found state listeners of ${name}`);
      /* let each state change listener know */
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      for (let index = 0; index < changeListenersForName.listeners.length; index++) {
        smLogger(`State Manager: Found state listener of ${name} - informing`);
        const listener = changeListenersForName.listeners[index];
        listener.stateChanged(name, stateObjValue);
      }
    }
  }


  /*
      Add a state listener for a given state name
      the listener should be a function with two parameters
      name - string - the name of the state variable that they want to be informed about
      stateObjValue - object - the new state value
     */
  public addChangeListenerForName(name:string, listener:StateChangeListener):void {
    smLogger(`State Manager: Adding state listener for ${name}`);
    const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      const changeListenersForName = this.stateChangeListeners[foundIndex];
      changeListenersForName.listeners.push(listener);
    } else {
      smLogger(`State Manager: Adding state listener for ${name} - first occurrence`);
      const listenersNameArrayPair = {
        name,
        listeners: [listener],
      };
      this.stateChangeListeners.push(listenersNameArrayPair);
    }
  }

  public getStateByName(name:string):any {
    smLogger(`State Manager: Getting state for ${name}`);
    let stateValueObj = {};
    const foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      // get the current state
      const stateNameValuePair = this.applicationState[foundIndex];
      stateValueObj = stateNameValuePair.value;
      smLogger(`State Manager: Found previous state for ${name}`);
      smLogger(stateValueObj);
    } else {
      // create the state if not already present
      stateValueObj = this.addStateByName(name, []);
    }
    return stateValueObj;
  }

  public setStateByName(name:string, stateObjectForName:any):void {
    smLogger(`State Manager: Setting state for ${name}`);
    smLogger(stateObjectForName);
    const foundIndex = this.applicationState.findIndex(element => element.name === name);
    if (foundIndex >= 0) {
      // set the current state
      const stateNameValuePair = this.applicationState[foundIndex];
      stateNameValuePair.value = stateObjectForName;
    } else {
      // create the state if not already present
      this.addStateByName(name, stateObjectForName);
    }
    this.informChangeListenersForStateWithName(name, stateObjectForName);
    return stateObjectForName;
  }

  public addStateByName(name:string, stateObjForName:any):any {
    /* create a new state attribute for the application state */
    if (!this.isStatePresent(name)) {
      smLogger(`State Manager: Adding state for ${name} - first occurrence`);
      smLogger(stateObjForName, 201);
      const stateNameValuePair = {
        name,
        value: stateObjForName,
      };
      this.applicationState.push(stateNameValuePair);
    } else {
      /* get the current state value and replace it */
      this.setStateByName(name, stateObjForName);
    }
    return stateObjForName;
  }

  public addNewItemToState(name:string, item:any):void { // assumes state is an array
    smLogger(`State Manager: Adding item to state ${name}`);
    const state = this.getStateByName(name);
    state.push(item);
    smLogger(state);
    this.informChangeListenersForStateWithName(name, state);
  }

  public findItemInState(name:string, item:any, testForEqualityFunction:equalityFunction):any { // assumes state is an array
    let result = {};
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
    smLogger(`Finding item in state ${name} - found index ${foundIndex}`);
    smLogger(item);
    if (foundIndex >= 0) {
      result = state[foundIndex];
    }
    return result;
  }

  public isItemInState(name:string, item:any, testForEqualityFunction:equalityFunction):boolean { // assumes state is an array
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
    }
    return result;
  }

  public removeItemFromState(name:string, item:any, testForEqualityFunction:equalityFunction):boolean {
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
      // remove the item from the state
      smLogger('State Manager: Found item - removing ');
      state.splice(foundIndex, 1);
      smLogger(state);
      this.setStateByName(name, state);
    }
    return result;
  }

  public updateItemInState(name:string, item:any, testForEqualityFunction:equalityFunction):boolean {
    let result = false;
    const state = this.getStateByName(name);
    const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
    if (foundIndex >= 0) {
      result = true;
      // remove the item from the state
      smLogger('State Manager: Found item - replacing ');
      state.splice(foundIndex, 1, item);
      //state.push(item);
      smLogger(state);
      this.setStateByName(name, state);
    } else {
      // add the item to the state
      this.addNewItemToState(name, item);
    }
    return result;
  }
}

const stateManager:StateManagementUtil = StateManagementUtil.create();
export default stateManager;
