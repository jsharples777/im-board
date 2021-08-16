import debug from 'debug';
import StateChangeListener from './StateChangeListener';
import {equalityFunction} from '../util/EqualityFunctions';
import {stateEventType, StateManager, stateValue} from "./StateManager";
import {StateChangeInformer} from "./StateChangeInformer";
import StateChangedDelegate from "./StateChangedDelegate";

const smLogger = debug('state-manager-ts');



export abstract class AbstractStateManager implements StateManager {

    protected forceSaves:boolean = true;
    protected managerName:string = '';
    protected delegate:StateChangeInformer;

    protected constructor(managerName:string) {
        this.delegate = new StateChangedDelegate(managerName);
        this.managerName = managerName;
        this.emitEvents();
        this.forceSaves = true;
    }

    suppressEvents(): void {
        this.delegate.suppressEvents();
    }
    emitEvents(): void {
        this.delegate.emitEvents();
    }



    public dontForceSavesOnAddRemoveUpdate() {
        this.forceSaves = false;
    }

    public forceSavesOnAddRemoveUpdate() {
        this.forceSaves = true;
    }

    informChangeListenersForStateWithName(name: string, stateObjValue: any, eventType: stateEventType = stateEventType.StateChanged, previousObjValue: any | null = null) {
        this.delegate.informChangeListenersForStateWithName(name,stateObjValue,eventType,previousObjValue);
    }


    addChangeListenerForName(name: string, listener: StateChangeListener): void {
        this.delegate.addChangeListenerForName(name,listener);
    }

    public abstract _ensureStatePresent(name:string):void;
    public abstract _addNewNamedStateToStorage(state:stateValue):void;
    public abstract _replaceNamedStateInStorage(state:stateValue):void;
    public abstract _getState(name:string):stateValue;
    public abstract _saveState(name:string,stateObj:any):void;
    public abstract _addItemToState(name:string,stateObj:any,isPersisted:boolean):void;
    public abstract _removeItemFromState(name:string,stateObj:any,testForEqualityFunction:equalityFunction):void;
    public abstract _updateItemInState(name:string,stateObj:any,testForEqualityFunction:equalityFunction):void;

    public addStateByName(name:string, stateObjForName:any):any {
        this._ensureStatePresent(name);
        /* create a new state attribute for the application state */
        const state:stateValue = {
            name,
            value: stateObjForName,
        };
        /* get the current state value and replace it */
        this._replaceNamedStateInStorage(state);
        this.informChangeListenersForStateWithName(name,stateObjForName,stateEventType.StateChanged);
        return stateObjForName;
    }

    getStateByName(name: string): any {
        this._ensureStatePresent(name);
        smLogger(`State Manager: Getting state for ${name}`);
        let stateValueObj = {};
        // get the current state
        const state: stateValue = this._getState(name);
        stateValueObj = state.value;
        smLogger(`State Manager: Found previous state for ${name}`);
        smLogger(stateValueObj);
        return stateValueObj;
    }

    setStateByName(name: string, stateObjectForName: any, informListeners: boolean = true): void {
        this._ensureStatePresent(name);
        smLogger(`State Manager: Setting state for ${name}`);
        smLogger(stateObjectForName);
        // set the current state
        const state: stateValue = this._getState(name);
        state.value = stateObjectForName;
        if (this.forceSaves) this._saveState(name, stateObjectForName);
        if (informListeners) this.informChangeListenersForStateWithName(name, stateObjectForName);
        return stateObjectForName;
    }

    addNewItemToState(name: string, item: any, isPersisted: boolean = false): void { // assumes state is an array
        this._ensureStatePresent(name);
        smLogger(`State Manager: Adding item to state ${name}`);
        // const state = this.getStateByName(name);
        // state.push(item);
        // smLogger(state);
        this._addItemToState(name, item, isPersisted);
        this.informChangeListenersForStateWithName(name, item, stateEventType.ItemAdded);
    }

    findItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): any { // assumes state is an array
        this._ensureStatePresent(name);
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

    isItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean { // assumes state is an array
        this._ensureStatePresent(name);
        let result = false;
        const state = this.getStateByName(name);
        const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
        if (foundIndex >= 0) {
            result = true;
        }
        return result;
    }

    removeItemFromState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean {
        this._ensureStatePresent(name);
        let result = false;
        const state = this.getStateByName(name);
        const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
        if (foundIndex >= 0) {
            result = true;
            let oldItem = state[foundIndex];
            // remove the item from the state
            smLogger('State Manager: Found item - removing ');
            //state.splice(foundIndex, 1);
            smLogger(state);
            this._removeItemFromState(name, item, testForEqualityFunction);
            this.setStateByName(name, state, false);
            this.informChangeListenersForStateWithName(name, oldItem, stateEventType.ItemDeleted);
        }
        return result;
    }

    updateItemInState(name: string, item: any, testForEqualityFunction: equalityFunction): boolean {
        this._ensureStatePresent(name);
        let result = false;
        const state = this.getStateByName(name);
        const foundIndex = state.findIndex((element: any) => testForEqualityFunction(element, item));
        if (foundIndex >= 0) {
            result = true;
            let oldItem = state[foundIndex];
            smLogger('State Manager: Found item - replacing ');
            state.splice(foundIndex, 1, item);
            smLogger(state);
            this._updateItemInState(name, item, testForEqualityFunction);
            this.setStateByName(name, state, false);
            this.informChangeListenersForStateWithName(name, item, stateEventType.ItemUpdated, oldItem);
        } else {
            // add the item to the state
            this.addNewItemToState(name, item);
        }
        return result;
    }


}
