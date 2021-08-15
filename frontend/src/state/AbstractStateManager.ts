import debug from 'debug';
import StateChangeListener from './StateChangeListener';
import {equalityFunction} from '../util/EqualityFunctions';

const smLogger = debug('state-manager-ts');

export type stateValue = { name: string, value: any};
export type stateListeners = {name:string, listeners: StateChangeListener[]};
export enum stateEventType {
    ItemAdded,
    ItemUpdated,
    ItemDeleted,
    StateChanged
}

export abstract class AbstractStateManager {
    protected stateChangeListeners: stateListeners[];
    protected suppressEventEmits:boolean = false;
    protected forceSaves:boolean = true;

    protected constructor() {
        this.stateChangeListeners = [];
        this.suppressEventEmits = false;
        this.forceSaves = true;
    }

    public suppressEvents() {
        this.suppressEventEmits = true;
    }

    public emitEvents() {
        this.suppressEventEmits = false;
    }

    public dontForceSavesOnAddRemoveUpdate() {
        this.forceSaves = false;
    }

    public forceSavesOnAddRemoveUpdate() {
        this.forceSaves = true;
    }

    private isStatePresent(name:string):boolean {
        const result = this._isStatePresent(name);
        smLogger(`Checking state of ${name} is present = ${result}`);
        return result;
    }

    protected informChangeListenersForStateWithName(name: string, stateObjValue: any, eventType:stateEventType = stateEventType.StateChanged, previousObjValue:any|null = null) {
        smLogger(`State Manager: Informing state listeners of ${name}`);
        if (this.suppressEventEmits) {
            smLogger(`State Manager: Events suppressed`);
            return;
        }
        const foundIndex = this.stateChangeListeners.findIndex(element => element.name === name);
        if (foundIndex >= 0) {
            smLogger(`State Manager: Found state listeners of ${name}`);
            /* let each state change listener know */
            const changeListenersForName = this.stateChangeListeners[foundIndex];
            for (let index = 0; index < changeListenersForName.listeners.length; index++) {
                smLogger(`State Manager: Found state listener of ${name} - informing`);
                const listener = changeListenersForName.listeners[index];
                switch (eventType) {
                    case (stateEventType.StateChanged): {
                        listener.stateChanged(name, stateObjValue);
                        break;
                    }
                    case (stateEventType.ItemAdded): {
                        listener.stateChangedItemAdded(name, stateObjValue);
                        break;
                    }
                    case (stateEventType.ItemUpdated): {
                        listener.stateChangedItemUpdated(name,previousObjValue,stateObjValue);
                        break;
                    }
                    case (stateEventType.ItemDeleted): {
                        listener.stateChangedItemRemoved(name,stateObjValue);
                        break;
                    }
                }

            }
        }
    }


    /*
          Add a state listener for a given state name
          the listener should be a function with two parameters
          name - string - the name of the state variable that they want to be informed about
          stateObjValue - object - the new state value
         */
    public addChangeListenerForName(name: string, listener: StateChangeListener): void {
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

    public abstract _isStatePresent(name:string):boolean;
    public abstract _addNewNamedStateToStorage(state:stateValue):void;
    public abstract _replaceNamedStateInStorage(state:stateValue):void;
    public abstract _getState(name:string):stateValue;
    public abstract _saveState(name:string,stateObj:any):void;
    public abstract _addItemToState(name:string,stateObj:any):void;
    public abstract _removeItemFromState(name:string,stateObj:any,testForEqualityFunction:equalityFunction):void;
    public abstract _updateItemInState(name:string,stateObj:any,testForEqualityFunction:equalityFunction):void;

    public addStateByName(name:string, stateObjForName:any):any {
        /* create a new state attribute for the application state */
        const state:stateValue = {
            name,
            value: stateObjForName,
        };
        if (!this.isStatePresent(name)) {
            smLogger(`State Manager: Adding state for ${name} - first occurrence`);
            smLogger(stateObjForName, 201);
            this._addNewNamedStateToStorage(state);
        } else {
            /* get the current state value and replace it */
            this._replaceNamedStateInStorage(state);
        }
        this.informChangeListenersForStateWithName(name,stateObjForName,stateEventType.StateChanged);
        return stateObjForName;
    }

    public getStateByName(name:string):any {
        smLogger(`State Manager: Getting state for ${name}`);
        let stateValueObj = {};
        if (this._isStatePresent(name)) {
            // get the current state
            const state:stateValue = this._getState(name);
            stateValueObj = state.value;
            smLogger(`State Manager: Found previous state for ${name}`);
            smLogger(stateValueObj);
        } else {
            // create the state if not already present
            stateValueObj = this.addStateByName(name, []);
        }
        return stateValueObj;
    }

    public setStateByName(name:string, stateObjectForName:any, informListeners:boolean = true):void {
        smLogger(`State Manager: Setting state for ${name}`);
        smLogger(stateObjectForName);
        if (this._isStatePresent(name)) {
            // set the current state
            const state:stateValue = this._getState(name);
            state.value = stateObjectForName;
        } else {
            // create the state if not already present
            this.addStateByName(name, stateObjectForName);
        }
        if (this.forceSaves) this._saveState(name,stateObjectForName);
        if (informListeners) this.informChangeListenersForStateWithName(name, stateObjectForName);
        return stateObjectForName;
    }

    public addNewItemToState(name:string, item:any):void { // assumes state is an array
        smLogger(`State Manager: Adding item to state ${name}`);
        const state = this.getStateByName(name);
        state.push(item);
        smLogger(state);
        this._addItemToState(name,item);
        this.informChangeListenersForStateWithName(name, state,stateEventType.ItemAdded);
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
            this._removeItemFromState(name,item,testForEqualityFunction);
            this.setStateByName(name, state,false);
            this.informChangeListenersForStateWithName(name,item, stateEventType.ItemDeleted);
        }
        return result;
    }

    public updateItemInState(name:string, item:any, testForEqualityFunction:equalityFunction):boolean {
        let result = false;
        const state = this.getStateByName(name);
        const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
        if (foundIndex >= 0) {
            result = true;
            let oldItem = state[foundIndex];
            smLogger('State Manager: Found item - replacing ');
            state.splice(foundIndex, 1, item);
            smLogger(state);
            this._updateItemInState(name,item,testForEqualityFunction);
            this.setStateByName(name, state,false);
            this.informChangeListenersForStateWithName(name,item,stateEventType.ItemUpdated,oldItem);
        } else {
            // add the item to the state
            this.addNewItemToState(name, item);
        }
        return result;
    }


}
