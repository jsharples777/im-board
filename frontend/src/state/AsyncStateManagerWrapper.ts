import {AbstractStateManager, stateValue} from "./AbstractStateManager";
import StateChangeListener from "./StateChangeListener";
import {equalityFunction} from "../util/EqualityFunctions";

import debug from 'debug';
import AsychronousStateManager from "./AsynchronousStateManager";

const asyncLogger = debug('state-manager-async');

export default class AsyncStateManagerWrapper extends AbstractStateManager implements StateChangeListener {
    protected wrappedSM:AsychronousStateManager;
    protected topLevelSM:AbstractStateManager;

    public constructor(topLevelSM:AbstractStateManager, wrappedSM:AsychronousStateManager) {
        super();
        this.topLevelSM = topLevelSM;
        this.wrappedSM = wrappedSM;
        this.forceSaves = false;
        let stateNamesToMonitor = this.wrappedSM.getConfiguredStateNames();

        this.stateChanged = this.stateChanged.bind(this);
        this.stateChangedItemAdded = this.stateChangedItemAdded.bind(this);
        this.stateChangedItemRemoved = this.stateChangedItemRemoved.bind(this);
        this.stateChangedItemUpdated = this.stateChangedItemUpdated.bind(this);


        stateNamesToMonitor.forEach((stateName) => {
           this.wrappedSM.addChangeListenerForName(stateName,this);
        });
    }

    _addItemToState(name: string, stateObj: any,isPersisted:boolean = false): void {
        asyncLogger(`adding item to state ${name} - is persisted ${isPersisted}`);
        this.wrappedSM._addItemToState(name,stateObj,isPersisted);
    }


    _getState(name: string): stateValue {
        // assume wrapped SM is asynchronous
        // make the call to get state but supply the caller with an empty state for now
        asyncLogger(`getting state ${name}`);
        this.wrappedSM._getState(name);
        return {name:name, value: []};
    }


    _removeItemFromState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        asyncLogger(`removing item from state ${name}`);
        this.wrappedSM._removeItemFromState(name,stateObj,testForEqualityFunction);
    }
    _updateItemInState(name: string, stateObj: any, testForEqualityFunction: equalityFunction): void {
        asyncLogger(`updating item in state ${name}`);
        this.wrappedSM._updateItemInState(name,stateObj,testForEqualityFunction);
    }

    _ensureStatePresent(name: string): void {this.wrappedSM._ensureStatePresent(name);}
    _addNewNamedStateToStorage(state: stateValue): void {} // assume already present
    _replaceNamedStateInStorage(state: stateValue): void {} // not implemented, not replacing state wholesale
    _saveState(name: string, stateObj: any): void {} // not implemented, not replacing state wholesale
    stateChangedItemRemoved(name: string, itemRemoved: any): void {} // not implemented, assumes called to wrapped SM worked
    stateChangedItemUpdated(name: string, itemUpdated: any, itemNewValue: any): void {} // not implemented, assumes called to wrapped SM worked


    stateChanged(name: string, newValue: any): void {
        // received new state from the wrapped SM
        // pass the received state to the top level SM
        asyncLogger(`Wrapped SM has supplied new state ${name} passing to top level SM`);
        this.topLevelSM.setStateByName(name,newValue);
    }

    stateChangedItemAdded(name: string, itemAdded: any): void {
        asyncLogger(`Wrapped SM has supplied new completed item for state ${name} passing to top level SM`);
        this.topLevelSM.addNewItemToState(name,itemAdded,true);
    }

}